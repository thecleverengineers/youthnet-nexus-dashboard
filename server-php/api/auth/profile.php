
<?php
require_once '../../config/cors.php';
require_once '../../middleware/auth.php';

$user = authenticate();
if (!$user) {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get profile
    $userData = array(
        "_id" => $user->id,
        "id" => $user->id,
        "email" => $user->email,
        "profile" => array(
            "fullName" => $user->full_name,
            "phone" => $user->phone,
            "role" => $user->role
        ),
        "isEmailVerified" => $user->is_email_verified,
        "status" => $user->status,
        "createdAt" => $user->created_at,
        "updatedAt" => $user->updated_at
    );

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "message" => "Profile retrieved successfully",
        "data" => array(
            "user" => $userData
        )
    ));

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update profile
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->fullName)) {
        $user->full_name = $data->fullName;
    }
    if (isset($data->phone)) {
        $user->phone = $data->phone;
    }

    if ($user->update()) {
        $userData = array(
            "_id" => $user->id,
            "id" => $user->id,
            "email" => $user->email,
            "profile" => array(
                "fullName" => $user->full_name,
                "phone" => $user->phone,
                "role" => $user->role
            ),
            "isEmailVerified" => $user->is_email_verified,
            "status" => $user->status,
            "createdAt" => $user->created_at,
            "updatedAt" => date('Y-m-d\TH:i:s\Z')
        );

        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "Profile updated successfully",
            "data" => array(
                "user" => $userData
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to update profile"
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
}
?>
