
<?php
// API Configuration
class APIConfig {
    // 10-digit numerical API secret - CHANGE THIS IN PRODUCTION
    public static $API_SECRET = '7492836150';
    
    public static function getApiSecret() {
        // Use environment variable if available, otherwise use default
        return isset($_ENV['API_SECRET']) ? $_ENV['API_SECRET'] : self::$API_SECRET;
    }
    
    public static function validateApiSecret($providedSecret) {
        return $providedSecret === self::getApiSecret();
    }
}
?>
