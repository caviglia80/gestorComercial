<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS')
  exit;

// NOTA: se debe configurar el .htaccess para que se acepte el encabezado de Autorization
require_once '../JWT/tokenVerifier.php';

ini_set('log_errors', 1);
ini_set('error_log', 'guard_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

// $data = json_decode(file_get_contents("php://input"));

$headers = apache_request_headers();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
if (!$token || $token === '') {
  http_response_code(401);
  echo json_encode(['Error' => 'No se encontro el token', 'Mensaje' => 'Falta configurar el .htaccess ?']);
  die();
}

$decoded = verifyToken($token);
$empresaId = $decoded->empresaId;
$userId = $decoded->userId;

if (!$userId || !$empresaId) {
  http_response_code(401);
  die();
}

try {
  require_once 'config.php';
} catch (\Throwable $e) {
  http_response_code(500);
  echo json_encode(['message' => 'Error: ' . $e->getMessage(), 'extra' => 'config']);
}

try {
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
    PDO::ATTR_EMULATE_PREPARES => false, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

  if ($method === 'GET') {

    // Preparar y ejecutar la consulta para obtener el nombre de usuario
    $stmt = $conn->prepare("SELECT username, isSa FROM usuarios WHERE id = :usuarioId AND empresaId = :empresaId");
    $stmt->execute(['usuarioId' => $userId, 'empresaId' => $empresaId]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Preparar y ejecutar la consulta para verificar si el usuario es administrador
    $stmt->closeCursor();
    $stmt = $conn->prepare("SELECT COUNT(*) FROM empresa WHERE usuarioId = :usuarioId AND id = :empresaId");
    $stmt->execute(['usuarioId' => $userId, 'empresaId' => $empresaId]);
    $isAdmin = ($stmt->fetchColumn() > 0);

    if ($isAdmin && $usuario['isSa'] == 1) {
      echo json_encode(
        [
          "username" => $usuario['username'],
          "isSa" => $usuario['isSa'],
          "isAdmin" => $isAdmin
        ]
      );
      die();
    } else if ($isAdmin) {
      echo json_encode(
        [
          "username" => $usuario['username'],
          "isAdmin" => $isAdmin
        ]
      );
      die();
    }

    // Preparar y ejecutar la consulta para obtener rolId
    $stmt->closeCursor();
    $stmt = $conn->prepare("SELECT rolId FROM usuarios WHERE id = :id AND empresaId = :empresaId");
    $stmt->execute(['id' => $userId, 'empresaId' => $empresaId]);
    $resultadoUsuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultadoUsuario) {
      $rolId = $resultadoUsuario['rolId'];

      // Preparar y ejecutar la consulta para obtener los detalles del rol
      $stmt->closeCursor();
      $stmt = $conn->prepare("SELECT * FROM roles WHERE id = :rolId AND empresaId = :empresaId");
      $stmt->execute(['rolId' => $rolId, 'empresaId' => $empresaId]);
      $rol = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($rol) {
        echo json_encode(
          [
            "username" => $usuario['username'],
            "isAdmin" => $isAdmin,
            "rol" => $rol
          ]
        );
      } else {
        http_response_code(400);
        echo json_encode(["error" => "No se encontró el rol"]);
      }
    } else {
      http_response_code(400);
      echo json_encode(["error" => "No se encontró el usuario"]);
    }

  } else {
    http_response_code(400);
    echo json_encode(array('message' => 'Metodo incorrecto.'));
  }
} catch (PDOException $e) {
  http_response_code(500); // Error interno del servidor
  echo json_encode(array('message' => 'Error: ' . $e->getMessage()));
}
$conn = null;
?>