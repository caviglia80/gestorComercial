<?php
require_once '../headers.php';
require_once '../config.php';
require_once '../JWT/tokenVerifier.php';

try {
  $data = json_decode(file_get_contents("php://input"));
  $method = $_SERVER['REQUEST_METHOD'];
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
    PDO::ATTR_EMULATE_PREPARES => false, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM egresos WHERE empresaId = ?");
    $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'DELETE') {
    if (isset($data->id) && !empty($data->id)) {
      $id = $data->id;
      $stmt = $conn->prepare("DELETE FROM `egresos` WHERE `id` = :id AND `empresaId` = :empresaId;");
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
    if (isset($data->date, $data->monto) && !empty($data->date) && !empty($data->monto)) {
      $date = $data->date;
      $moneda = $data->moneda;
      $monto = $data->monto;
      $method = $data->method;
      $category = $data->category;
      $comprobante = $comprobante = isset($data->comprobante) ? $data->comprobante : '';
      $beneficiario = $data->beneficiario;
      $description = $description = isset($data->description) ? $data->description : '';

      $stmt = $conn->prepare("INSERT INTO `egresos` (`id`, `date`, `moneda`, `monto`, `method`, `category`, `comprobante`, `beneficiario`, `description`, `empresaId`) VALUES (NULL, :date, :moneda, :monto, :method, :category, :comprobante, :beneficiario, :description, :empresaId);");
      $stmt->bindParam(':date', $date, PDO::PARAM_STR);
      $stmt->bindParam(':moneda', $moneda, PDO::PARAM_STR);
      $stmt->bindParam(':monto', $monto, PDO::PARAM_STR);
      $stmt->bindParam(':method', $method, PDO::PARAM_STR);
      $stmt->bindParam(':category', $category, PDO::PARAM_STR);
      $stmt->bindParam(':comprobante', $comprobante, PDO::PARAM_STR);
      $stmt->bindParam(':beneficiario', $beneficiario, PDO::PARAM_STR);
      $stmt->bindParam(':description', $description, PDO::PARAM_STR);
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
    if (isset($data->id, $data->date, $data->monto) && !empty($data->id) && !empty($data->date) && !empty($data->monto)) {
      $id = $data->id;
      $date = $data->date;
      $moneda = $data->moneda;
      $monto = $data->monto;
      $method = $data->method;
      $category = $data->category;
      $comprobante = $data->comprobante;
      $beneficiario = $data->beneficiario;
      $description = $data->description;

      $stmt = $conn->prepare("UPDATE `egresos` SET `date` = :date, `moneda` = :moneda, `monto` = :monto, `method` = :method, `category` = :category, `comprobante` = :comprobante, `beneficiario` = :beneficiario, `description` = :description WHERE `id` = :id AND `empresaId` = :empresaId;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':date', $date, PDO::PARAM_STR);
      $stmt->bindParam(':moneda', $moneda, PDO::PARAM_STR);
      $stmt->bindParam(':monto', $monto, PDO::PARAM_STR);
      $stmt->bindParam(':method', $method, PDO::PARAM_STR);
      $stmt->bindParam(':category', $category, PDO::PARAM_STR);
      $stmt->bindParam(':comprobante', $comprobante, PDO::PARAM_STR);
      $stmt->bindParam(':beneficiario', $beneficiario, PDO::PARAM_STR);
      $stmt->bindParam(':description', $description, PDO::PARAM_STR);
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
    echo json_encode(array('message' => 'Metodo incorrecto.'));
  }
} catch (PDOException $e) {
  http_response_code(500); // Error interno del servidor
  echo json_encode(array('message' => 'Error: ' . $e->getMessage()));
}
$conn = null;
?>