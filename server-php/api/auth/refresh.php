
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

$data = json_decode(file_get_contents("php://input"));

if (empty($data->refreshToken)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Refresh token is required"
    ));
    exit();
}

$jwt = new JWTHandler();
$decoded = $jwt->validateRefreshToken($data->refreshToken);

if (!$decoded) {
    http_response_code(401);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid or expired refresh token"
    ));
    exit();
}

// Generate new tokens
$token = $jwt->generateToken($decoded['userId']);
$refreshToken = $jwt->generateRefreshToken($decoded['userId']);

http_response_code(200);
echo json_encode(array(
    "success" => true,
    "message" => "Token refreshed successfully",
    "data" => array(
        "token" => $token,
        "refreshToken" => $refreshToken
    )
));
?>
