
<?php
require_once '../auth/JWTHandler.php';
require_once '../models/User.php';
require_once '../config/database.php';

function authenticate() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : 
                 (isset($headers['authorization']) ? $headers['authorization'] : '');

    if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Access token is required"
        ));
        return false;
    }

    $token = $matches[1];
    $jwt = new JWTHandler();
    $decoded = $jwt->validateToken($token);

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid or expired token"
        ));
        return false;
    }

    // Get user from database
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    $user->id = $decoded['userId'];

    if (!$user->read()) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "User not found"
        ));
        return false;
    }

    if ($user->status !== 'active') {
        http_response_code(403);
        echo json_encode(array(
            "success" => false,
            "message" => "Account is not active"
        ));
        return false;
    }

    return $user;
}

function authorize($roles = []) {
    $user = authenticate();
    if (!$user) {
        return false;
    }

    if (!empty($roles) && !in_array($user->role, $roles)) {
        http_response_code(403);
        echo json_encode(array(
            "success" => false,
            "message" => "Insufficient permissions"
        ));
        return false;
    }

    return $user;
}
?>
