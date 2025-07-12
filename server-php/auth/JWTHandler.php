
<?php
require_once '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHandler {
    private $secret_key = "youthnet_jwt_secret_key_2024";
    private $issuer = "youthnet";
    private $audience = "youthnet-users";
    private $algorithm = "HS256";

    public function __construct() {
        // Use environment variable if available
        if (isset($_ENV['JWT_SECRET'])) {
            $this->secret_key = $_ENV['JWT_SECRET'];
        }
    }

    public function generateToken($user_id) {
        $issued_at = time();
        $expiration_time = $issued_at + (7 * 24 * 60 * 60); // 7 days
        
        $payload = array(
            "iss" => $this->issuer,
            "aud" => $this->audience,
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "userId" => $user_id
        );

        return JWT::encode($payload, $this->secret_key, $this->algorithm);
    }

    public function generateRefreshToken($user_id) {
        $issued_at = time();
        $expiration_time = $issued_at + (30 * 24 * 60 * 60); // 30 days
        
        $payload = array(
            "iss" => $this->issuer,
            "aud" => $this->audience,
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "userId" => $user_id,
            "type" => "refresh"
        );

        return JWT::encode($payload, $this->secret_key . '_refresh', $this->algorithm);
    }

    public function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, $this->algorithm));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }

    public function validateRefreshToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key . '_refresh', $this->algorithm));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>
