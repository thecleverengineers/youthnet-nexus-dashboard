
<?php
require_once '../../config/cors.php';
require_once '../../middleware/auth.php';

$user = authenticate();
if (!$user) {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit();
}

// In a more complex system, you might want to blacklist the token
// For now, we'll just return success as the client will handle token removal

http_response_code(200);
echo json_encode(array(
    "success" => true,
    "message" => "Logged out successfully"
));
?>
