
<?php
require_once '../../config/cors.php';
require_once '../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit();
}

// Validate API secret for installation
if (!validateApiSecretOnly()) {
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->action) || $data->action !== 'validate_installation') {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid installation request"
    ));
    exit();
}

// If we reach here, the API secret is valid
http_response_code(200);
echo json_encode(array(
    "success" => true,
    "message" => "Installation validated successfully",
    "data" => array(
        "app_name" => "YouthNet Management System",
        "version" => "1.0.0",
        "installation_time" => date('Y-m-d H:i:s')
    )
));
?>
