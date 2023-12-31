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
ini_set('error_log', 'inventario_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

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

require_once 'config.php';

try {
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
    PDO::ATTR_EMULATE_PREPARES => false, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);
  $data = json_decode(file_get_contents("php://input"));

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM inventario WHERE empresaId = ?");
    $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'DELETE') {
    if (isset($data->id) && !empty($data->id)) {
      $id = $data->id;
      $stmt = $conn->prepare("DELETE FROM `inventario` WHERE `id` = :id AND `empresaId` = :empresaId;");
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
    if (isset($data->nombre) && !empty($data->nombre)) {
      $idExterno = isset($data->idExterno) ? $data->idExterno : '';
      $nombre = $data->nombre;
      $costo = $data->costo;
      $margenBeneficio = $data->margenBeneficio;
      $tipo = $data->tipo;
      $proveedor = isset($data->proveedor) ? $data->proveedor : '';
      $duracion = isset($data->duracion) ? $data->duracion : '';
      $categoria = isset($data->categoria) ? $data->categoria : '';
      $existencias = $data->existencias;
      $descripcion = isset($data->descripcion) ? $data->descripcion : '';

      $stmt = $conn->prepare("INSERT INTO `inventario` (`id`, `idExterno`, `nombre`, `costo`, `existencias`, `margenBeneficio`, `tipo`, `proveedor`, `duracion`, `categoria`, `descripcion`, `empresaId`) VALUES (NULL, :idExterno, :nombre, :costo, :existencias, :margenBeneficio, :tipo, :proveedor, :duracion, :categoria, :descripcion, :empresaId);");
      $stmt->bindParam(':idExterno', $idExterno, PDO::PARAM_STR);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':costo', $costo, PDO::PARAM_STR);
      $stmt->bindParam(':existencias', $existencias, PDO::PARAM_STR);
      $stmt->bindParam(':margenBeneficio', $margenBeneficio, PDO::PARAM_STR);
      $stmt->bindParam(':tipo', $tipo, PDO::PARAM_STR);
      $stmt->bindParam(':proveedor', $proveedor, PDO::PARAM_STR);
      $stmt->bindParam(':duracion', $duracion, PDO::PARAM_STR);
      $stmt->bindParam(':categoria', $categoria, PDO::PARAM_STR);
      $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
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
    if (isset($data->id) && !empty($data->id)) {
      $id = $data->id;

      $updateFields = array();

      if (isset($data->idExterno)) {
        $updateFields[] = 'idExterno = :idExterno';
      }

      if (!empty($data->nombre)) {
        $updateFields[] = 'nombre = :nombre';
      }

      if (isset($data->costo)) {
        $updateFields[] = 'costo = :costo';
      }

      if (isset($data->existencias)) {
        $updateFields[] = 'existencias = :existencias';
      }

      if (isset($data->margenBeneficio)) {
        $updateFields[] = 'margenBeneficio = :margenBeneficio';
      }

      if (!empty($data->tipo)) {
        $updateFields[] = 'tipo = :tipo';
      }

      if (isset($data->proveedor)) {
        $updateFields[] = 'proveedor = :proveedor';
      }

      if (isset($data->duracion)) {
        $updateFields[] = 'duracion = :duracion';
      }

      if (isset($data->categoria)) {
        $updateFields[] = 'categoria = :categoria';
      }

      if (isset($data->descripcion)) {
        $updateFields[] = 'descripcion = :descripcion';
      }

      if (!empty($updateFields)) {
        $updateQuery = "UPDATE `inventario` SET " . implode(', ', $updateFields) . " WHERE `id` = :id AND `empresaId` = :empresaId;";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

        if (isset($data->idExterno)) {
          $stmt->bindParam(':idExterno', $data->idExterno, PDO::PARAM_STR);
        }

        if (!empty($data->nombre)) {
          $stmt->bindParam(':nombre', $data->nombre, PDO::PARAM_STR);
        }

        if (isset($data->costo)) {
          $stmt->bindParam(':costo', $data->costo, PDO::PARAM_STR);
        }

        if (isset($data->existencias)) {
          $stmt->bindParam(':existencias', $data->existencias, PDO::PARAM_STR);
        }

        if (isset($data->margenBeneficio)) {
          $stmt->bindParam(':margenBeneficio', $data->margenBeneficio, PDO::PARAM_STR);
        }

        if (!empty($data->tipo)) {
          $stmt->bindParam(':tipo', $data->tipo, PDO::PARAM_STR);
        }

        if (isset($data->proveedor)) {
          $stmt->bindParam(':proveedor', $data->proveedor, PDO::PARAM_STR);
        }

        if (isset($data->duracion)) {
          $stmt->bindParam(':duracion', $data->duracion, PDO::PARAM_STR);
        }

        if (isset($data->categoria)) {
          $stmt->bindParam(':categoria', $data->categoria, PDO::PARAM_STR);
        }

        if (isset($data->descripcion)) {
          $stmt->bindParam(':descripcion', $data->descripcion, PDO::PARAM_STR);
        }

        if ($stmt->execute()) {
          echo json_encode(array('message' => 'Registro editado.'));
        } else {
          http_response_code(500);
          echo json_encode(array('message' => 'Error al intentar editar el registro (PUT).'));
        }
      } else {
        http_response_code(400);
        echo json_encode(array('message' => 'No se proporcionaron valores para actualizar.'));
      }
    } else {
      http_response_code(400); // Bad Request
      echo json_encode(array('message' => 'Id faltante (PUT).'));
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