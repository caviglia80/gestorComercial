<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS')
  exit;

ini_set('log_errors', 1);
ini_set('error_log', 'proveedores_error.txt');
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

$empresaId = $decoded->empresaId;

try {
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
    PDO::ATTR_EMULATE_PREPARES => false, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);
  $data = json_decode(file_get_contents("php://input"));

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM proveedores WHERE empresaId = ?");
    $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'DELETE') {
    if (isset($data->id)) {
      $id = $data->id;
      $stmt = $conn->prepare("DELETE FROM `proveedores` WHERE `id` = :id AND `empresaId` = :empresaId;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
      if ($stmt->execute()) {
        echo json_encode(array('message' => 'Registro eliminado.'));
      } else {
        http_response_code(500); // Error interno del servidor
        echo json_encode(array('message' => 'Error al eliminar registro (DELETE).'));
      }
    } else {
      http_response_code(400); // Bad Request
      echo json_encode(array('message' => 'Parámetro id faltante (DELETE).'));
    }

  } elseif ($method === 'POST') {
    if (isset($data->contactFullname) && !empty($data->contactFullname)) {
      $company = $company = isset($data->company) ? $data->company : '';
      $contactFullname = $contactFullname = isset($data->contactFullname) ? $data->contactFullname : '';
      $phone = $phone = isset($data->phone) ? $data->phone : '';
      $email = $email = isset($data->email) ? $data->email : '';
      $address = $address = isset($data->address) ? $data->address : '';
      $website = $website = isset($data->website) ? $data->website : '';
      $accountNumber = $accountNumber = isset($data->accountNumber) ? $data->accountNumber : '';
      $tipoSuministro = $tipoSuministro = isset($data->tipoSuministro) ? $data->tipoSuministro : '';
      $observation = $observation = isset($data->observation) ? $data->observation : '';

      $stmt = $conn->prepare("INSERT INTO `proveedores` (`id`, `company`, `contactFullname`, `phone`, `email`, `address`, `website`, `accountNumber`, `tipoSuministro`, `observation`, `empresaId`)
                VALUES (NULL, :company, :contactFullname, :phone, :email, :address, :website, :accountNumber, :tipoSuministro, :observation, :empresaId);");
      $stmt->bindParam(':company', $company, PDO::PARAM_STR);
      $stmt->bindParam(':contactFullname', $contactFullname, PDO::PARAM_STR);
      $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
      $stmt->bindParam(':email', $email, PDO::PARAM_STR);
      $stmt->bindParam(':address', $address, PDO::PARAM_STR);
      $stmt->bindParam(':website', $website, PDO::PARAM_STR);
      $stmt->bindParam(':accountNumber', $accountNumber, PDO::PARAM_STR);
      $stmt->bindParam(':tipoSuministro', $tipoSuministro, PDO::PARAM_STR);
      $stmt->bindParam(':observation', $observation, PDO::PARAM_STR);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      if ($stmt->execute()) {
        echo json_encode(array('message' => 'Registro insertado.'));
      } else {
        http_response_code(500); // Error interno del servidor
        echo json_encode(array('message' => 'Error al insertar registro (POST).'));
      }
    } else {
      http_response_code(400); // Bad Request
      echo json_encode(array('message' => 'Parámetros faltantes (POST).'));
    }

  } elseif ($method === 'PUT') {
    if (isset($data->contactFullname) && !empty($data->contactFullname)) {
      $id = $data->id;
      $company = $data->company;
      $contactFullname = $data->contactFullname;
      $phone = $data->phone;
      $email = $data->email;
      $address = $data->address;
      $website = $data->website;
      $accountNumber = $data->accountNumber;
      $tipoSuministro = $data->tipoSuministro;
      $observation = $data->observation;

      $stmt = $conn->prepare("UPDATE `proveedores` SET `company` = :company, `contactFullname` = :contactFullname, `phone` = :phone, `email` = :email, `address` = :address, `website` = :website, `accountNumber` = :accountNumber, `tipoSuministro` = :tipoSuministro, `observation` = :observation WHERE `id` = :id AND `empresaId` = :empresaId;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':company', $company, PDO::PARAM_STR);
      $stmt->bindParam(':contactFullname', $contactFullname, PDO::PARAM_STR);
      $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
      $stmt->bindParam(':email', $email, PDO::PARAM_STR);
      $stmt->bindParam(':address', $address, PDO::PARAM_STR);
      $stmt->bindParam(':website', $website, PDO::PARAM_STR);
      $stmt->bindParam(':accountNumber', $accountNumber, PDO::PARAM_STR);
      $stmt->bindParam(':tipoSuministro', $tipoSuministro, PDO::PARAM_STR);
      $stmt->bindParam(':observation', $observation, PDO::PARAM_STR);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      if ($stmt->execute()) {
        echo json_encode(array('message' => 'Registro editado.'));
      } else {
        http_response_code(500); // Error interno del servidor
        echo json_encode(array('message' => 'Error al editar registro (PUT).'));
      }
    } else {
      http_response_code(400); // Bad Request
      echo json_encode(array('message' => 'Parámetros faltantes (PUT).'));
    }
  } else {
    http_response_code(400); // Bad Request
    echo json_encode(array('message' => 'Método incorrecto.'));
  }

} catch (PDOException $e) {
  http_response_code(500); // Error interno del servidor
  echo json_encode(array('message' => 'Error: ' . $e->getMessage()));
}
$conn = null;
?>