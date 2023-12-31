<?php
require_once '../DB/config.php';

ini_set('log_errors', 1);
ini_set('error_log', 'JWT_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
  exit;

require_once __DIR__ . '/src/JWTExceptionWithPayloadInterface.php';
require_once __DIR__ . '/src/BeforeValidException.php';
require_once __DIR__ . '/src/ExpiredException.php';
require_once __DIR__ . '/src/SignatureInvalidException.php';
require_once __DIR__ . '/src/JWT.php';

use \Firebase\JWT\JWT;

// Secret key for JWT (should be stored securely and not regenerated every request)
$secretKey = "H;l=/$7k[{_L[0p)RSB^[?Q?pGZ94yP7R+Y=1/<vmE-KaGJhbd6a>0mdGpY6Ly~i";
// Expiration time
define("JWT_EXPIRATION_HOURS", 12);

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}

// Get the client login data (email and password)
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
  $email = $data->email;
  $password = $data->password;

  // Prepared statement to prevent SQL injection
  $stmt = $conn->prepare("SELECT id, email, password, empresaId FROM usuarios WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
      $expirationTime = time() + (JWT_EXPIRATION_HOURS * 3600); // Expresado en segundos

      // JWT payload with "exp" claim
      $payload = [
        "userId" => $row['id'],
        "email" => $row['email'],
        "empresaId" => $row['empresaId'],
        "exp" => $expirationTime // Expiration time
      ];

      // Generate JWT
      $jwt = JWT::encode($payload, $secretKey, 'HS256');
      echo json_encode(["message" => "Login successful", "jwt" => $jwt]);

    } else {
      http_response_code(401);
      echo json_encode(["message" => "Invalid credentials"]);
    }
  } else {
    http_response_code(401);
    echo json_encode(["message" => "User not found"]);
  }
  $stmt->close();
} else {
  http_response_code(400);
  echo json_encode(["message" => "Incomplete login data"]);
}

$conn->close();

function generateRandomString($length = 64)
{
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_-+=<>?';
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[random_int(0, strlen($characters) - 1)];
  }
  return $randomString;
}
?>