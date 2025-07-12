
<?php
require_once '../config/database.php';

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $email;
    public $password;
    public $full_name;
    public $phone;
    public $role;
    public $is_email_verified;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET email=:email, password=:password, full_name=:full_name, 
                     phone=:phone, role=:role, created_at=NOW(), updated_at=NOW()";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->role = htmlspecialchars(strip_tags($this->role));

        // Bind values
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":role", $this->role);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function emailExists() {
        $query = "SELECT id, email, password, full_name, phone, role, status 
                 FROM " . $this->table_name . " 
                 WHERE email = :email LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        $num = $stmt->rowCount();

        if($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->password = $row['password'];
            $this->full_name = $row['full_name'];
            $this->phone = $row['phone'];
            $this->role = $row['role'];
            $this->status = $row['status'];
            return true;
        }

        return false;
    }

    public function read() {
        $query = "SELECT id, email, full_name, phone, role, status, created_at 
                 FROM " . $this->table_name . " 
                 WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->email = $row['email'];
            $this->full_name = $row['full_name'];
            $this->phone = $row['phone'];
            $this->role = $row['role'];
            $this->status = $row['status'];
            $this->created_at = $row['created_at'];
            return true;
        }

        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                 SET full_name=:full_name, phone=:phone, updated_at=NOW() 
                 WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));

        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }
}
?>
