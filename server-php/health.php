
<?php
require_once 'config/cors.php';
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "YouthNet API is running",
            "timestamp" => date('Y-m-d H:i:s'),
            "database" => "connected"
        ));
    } else {
        throw new Exception("Database connection failed");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Health check failed",
        "error" => $e->getMessage(),
        "timestamp" => date('Y-m-d H:i:s')
    ));
}
?>
