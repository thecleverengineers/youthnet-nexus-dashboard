
<?php
// API Configuration
class APIConfig {
    // 10-digit numerical API secret
    public static $API_SECRET = '1234567890';
    
    public static function getApiSecret() {
        // Use environment variable if available, otherwise use default
        return isset($_ENV['API_SECRET']) ? $_ENV['API_SECRET'] : self::$API_SECRET;
    }
    
    public static function validateApiSecret($providedSecret) {
        return $providedSecret === self::getApiSecret();
    }
}
?>
