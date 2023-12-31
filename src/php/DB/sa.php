<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS')
  exit;

ini_set('log_errors', 1);
ini_set('error_log', 'sa_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

// NOTA: se debe configurar el .htaccess para que se acepte el encabezado de Autorization
require_once '../JWT/tokenVerifier.php';

$headers = apache_request_headers();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
if (!$token || $token === '') {
  http_response_code(401);
  echo json_encode(['Error' => 'No se encontro el token', 'Mensaje' => 'Falta configurar el .htaccess ?']);
  die();
}

$decoded = verifyToken($token);
if (!$decoded->userId || !$decoded->empresaId) {
  http_response_code(401);
  die();
}

$id = $decoded->empresaId;
$data = json_decode(file_get_contents("php://input"));

try {
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
    PDO::ATTR_EMULATE_PREPARES => true, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT id, nombre, fechaVencimiento, usuarioId FROM empresa");
    if (!$stmt->execute())
      throw new Exception('Error al intentar obtener empresas.');
    $empresas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    $stmt = $conn->prepare("SELECT id, empresaId, email, username, fullname, phone FROM usuarios WHERE administrador = 1");
    if (!$stmt->execute())
      throw new Exception('Error al intentar obtener administradores.');
    $administradores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(
      [
        "empresas" => $empresas,
        "administradores" => $administradores
      ]
    );

  } elseif ($method === 'PUT') {

    $updateFields = array();
    $usuarioId = $data->usuarioId;
    $empresaId = $data->empresaId;

    if (!empty($data->email)) {
      $updateFields[] = 'email = :email';
    }
    if (!empty($data->password)) {
      $updateFields[] = 'password = :password';
    }

    if (!empty($updateFields)) {
      $updateQuery = "UPDATE `usuarios` SET " . implode(', ', $updateFields) . " WHERE `id` = :usuarioId;";
      $stmt = $conn->prepare($updateQuery);
      $stmt->bindParam(':usuarioId', $usuarioId, PDO::PARAM_INT);

      if (isset($data->email)) {
        $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
      }
      if (isset($data->password)) {
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
      }

      if (!$stmt->execute())
        throw new Exception('Error al intentar actualizar usuarios.');
      $stmt->closeCursor();
    }

    $updateFields = array();
    if (!empty($data->fechaVencimiento)) {
      $updateFields[] = 'fechaVencimiento = :fechaVencimiento';
    }

    if (!empty($updateFields)) {
      $updateQuery = "UPDATE `empresa` SET " . implode(', ', $updateFields) . " WHERE `id` = :empresaId;";
      $stmt = $conn->prepare($updateQuery);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      if (isset($data->fechaVencimiento)) {
        $stmt->bindParam(':fechaVencimiento', $data->fechaVencimiento, PDO::PARAM_STR);
      }

      if (!$stmt->execute())
        throw new Exception('Error al intentar actualizar empresa.');
      $stmt->closeCursor();
    }

  } else {
    http_response_code(400);
    echo json_encode(array('message' => 'Metodo incorrecto.'));
  }
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(array('message' => 'Error: ' . $e->getMessage()));
}
$conn = null;
?>