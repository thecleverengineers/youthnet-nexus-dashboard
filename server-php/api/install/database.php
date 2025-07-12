
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

if (empty($data->action) || $data->action !== 'setup_database') {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid database setup request"
    ));
    exit();
}

if (empty($data->database)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Database configuration is required"
    ));
    exit();
}

$dbConfig = $data->database;

// Validate required fields
if (empty($dbConfig->host) || empty($dbConfig->name) || empty($dbConfig->user)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Database host, name, and user are required"
    ));
    exit();
}

try {
    // Test database connection
    $dsn = "mysql:host=" . $dbConfig->host . ";charset=utf8mb4";
    $pdo = new PDO($dsn, $dbConfig->user, $dbConfig->password ?? '', array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ));

    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . $dbConfig->name . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Switch to the database
    $pdo->exec("USE `" . $dbConfig->name . "`");

    // Read and execute the SQL schema file
    $schemaPath = __DIR__ . '/../../database/schema.sql';
    if (!file_exists($schemaPath)) {
        throw new Exception("Database schema file not found");
    }

    $schema = file_get_contents($schemaPath);
    if ($schema === false) {
        throw new Exception("Failed to read database schema file");
    }

    // Remove the CREATE DATABASE and USE statements from schema since we handle them above
    $schema = preg_replace('/CREATE DATABASE.*?;/i', '', $schema);
    $schema = preg_replace('/USE .*?;/i', '', $schema);

    // Split the schema into individual statements
    $statements = array_filter(array_map('trim', explode(';', $schema)));

    // Execute each statement
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }

    // Update the .env file with new database configuration
    updateEnvFile($dbConfig);

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "message" => "Database setup completed successfully",
        "data" => array(
            "database_name" => $dbConfig->name,
            "host" => $dbConfig->host,
            "tables_created" => true,
            "demo_data_inserted" => true
        )
    ));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Database connection failed: " . $e->getMessage()
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Database setup failed: " . $e->getMessage()
    ));
}

function updateEnvFile($dbConfig) {
    $envPath = __DIR__ . '/../../.env';
    $envExamplePath = __DIR__ . '/../../.env.example';
    
    // Read the example file as template
    if (file_exists($envExamplePath)) {
        $envContent = file_get_contents($envExamplePath);
    } else {
        // Create basic .env content if example doesn't exist
        $envContent = "# Database Configuration\nDB_HOST=localhost\nDB_NAME=youthnet_db\nDB_USER=root\nDB_PASS=\n\n# JWT Configuration\nJWT_SECRET=youthnet_jwt_secret_key_2024\n\n# API Security\nAPI_SECRET=1234567890\n\n# Environment\nENVIRONMENT=development\n";
    }
    
    // Update database configuration
    $envContent = preg_replace('/DB_HOST=.*/', 'DB_HOST=' . $dbConfig->host, $envContent);
    $envContent = preg_replace('/DB_NAME=.*/', 'DB_NAME=' . $dbConfig->name, $envContent);
    $envContent = preg_replace('/DB_USER=.*/', 'DB_USER=' . $dbConfig->user, $envContent);
    $envContent = preg_replace('/DB_PASS=.*/', 'DB_PASS=' . ($dbConfig->password ?? ''), $envContent);
    
    // Write the updated .env file
    if (file_put_contents($envPath, $envContent) === false) {
        throw new Exception("Failed to update .env file");
    }
}
?>
