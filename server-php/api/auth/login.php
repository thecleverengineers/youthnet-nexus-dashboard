
<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/User.php';
require_once '../../auth/JWTHandler.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit();
}

// Validate API secret first
if (!validateApiSecretOnly()) {
    exit();
}

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$jwt = new JWTHandler();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Email and password are required"
    ));
    exit();
}

// Check if user exists
$user->email = $data->email;
if (!$user->emailExists()) {
    http_response_code(401);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid login credentials"
    ));
    exit();
}

// Verify password
if (!password_verify($data->password, $user->password)) {
    http_response_code(401);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid login credentials"
    ));
    exit();
}

// Check if account is active
if ($user->status !== 'active') {
    http_response_code(403);
    echo json_encode(array(
        "success" => false,
        "message" => "Account is not active"
    ));
    exit();
}

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
    "isEmailVerified" => $user->is_email_verified,
    "status" => $user->status,
    "createdAt" => $user->created_at,
    "updatedAt" => $user->updated_at
);

http_response_code(200);
echo json_encode(array(
    "success" => true,
    "message" => "Login successful",
    "data" => array(
        "user" => $userData,
        "token" => $token,
        "refreshToken" => $refreshToken
    )
));
?>
