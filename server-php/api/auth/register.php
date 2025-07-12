
<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/User.php';
require_once '../../auth/JWTHandler.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit();
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$jwt = new JWTHandler();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password) || empty($data->fullName) || empty($data->role)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Email, password, full name, and role are required"
    ));
    exit();
}

// Check if user already exists
$user->email = $data->email;
if ($user->emailExists()) {
    http_response_code(409);
    echo json_encode(array(
        "success" => false,
        "message" => "User already exists with this email"
    ));
    exit();
}

// Validate role
$allowed_roles = ['admin', 'staff', 'trainer', 'student'];
if (!in_array($data->role, $allowed_roles)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid role. Allowed roles: " . implode(', ', $allowed_roles)
    ));
    exit();
}

// Create user
$user->email = $data->email;
$user->password = $data->password;
$user->full_name = $data->fullName;
$user->phone = isset($data->phone) ? $data->phone : '';
$user->role = $data->role;

if ($user->create()) {
    // Generate tokens
    $token = $jwt->generateToken($user->id);
    $refreshToken = $jwt->generateRefreshToken($user->id);

    // Prepare user data for response
    $userData = array(
        "_id" => $user->id,
        "id" => $user->id,
        "email" => $user->email,
        "profile" => array(
            "fullName" => $user->full_name,
            "phone" => $user->phone,
            "role" => $user->role
        ),
        "isEmailVerified" => false,
        "status" => "active",
        "createdAt" => date('Y-m-d\TH:i:s\Z'),
        "updatedAt" => date('Y-m-d\TH:i:s\Z')
    );

    http_response_code(201);
    echo json_encode(array(
        "success" => true,
        "message" => "User registered successfully",
        "data" => array(
            "user" => $userData,
            "token" => $token,
            "refreshToken" => $refreshToken
        )
    ));
} else {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Unable to create user"
    ));
}
?>
