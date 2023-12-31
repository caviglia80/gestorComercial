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
ini_set('error_log', 'ingresos_error.txt');
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
    PDO::ATTR_EMULATE_PREPARES => true, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);
  $data = json_decode(file_get_contents("php://input"));

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM ingresos WHERE empresaId = ?");
    $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'DELETE') {
    if (isset($data->id) && !empty($data->id)) {
      $id = $data->id;
      $stmt = $conn->prepare("DELETE FROM `ingresos` WHERE `id` = :id AND `empresaId` = :empresaId;");
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

    // Verificar si los datos son un array
    if (is_array($data)) {
      // Array para almacenar los IDs generados
      $idsGenerados = [];

      // Variables para almacenar los datos de 'remito'
      $comprobante = obtenerMaximoComprobante($conn, $empresaId);
      $fecha = null;

      // Iniciar una transacción
      $conn->beginTransaction();

      try {
        // Preparar la consulta SQL para 'ingresos'
        $stmt = $conn->prepare("INSERT INTO `ingresos` (`id`, `date`, `inventarioId`, `nombre`, `moneda`, `monto`, `method`, `category`, `comprobante`, `cliente`, `margenBeneficio`, `description`, `empresaId`) VALUES (NULL, :date, :inventarioId, :nombre, :moneda, :monto, :method, :category, :comprobante, :cliente, :margenBeneficio, :description, :empresaId)");

        // Recorrer cada registro
        foreach ($data as $registro) {
          // Asignar valores usando bindParam
          $stmt->bindParam(':date', $registro->date, PDO::PARAM_STR);
          $stmt->bindParam(':inventarioId', $registro->inventarioId, PDO::PARAM_INT);
          $stmt->bindParam(':nombre', $registro->nombre, PDO::PARAM_STR);
          $stmt->bindParam(':moneda', $registro->moneda, PDO::PARAM_STR);
          $stmt->bindParam(':monto', $registro->monto, PDO::PARAM_STR);
          $stmt->bindParam(':method', $registro->method, PDO::PARAM_STR);
          $stmt->bindParam(':category', $registro->category, PDO::PARAM_STR);
          $stmt->bindParam(':comprobante', $comprobante, PDO::PARAM_STR);
          $stmt->bindParam(':cliente', $registro->cliente, PDO::PARAM_STR);
          $stmt->bindParam(':margenBeneficio', $registro->margenBeneficio, PDO::PARAM_STR);
          $stmt->bindParam(':description', $registro->description, PDO::PARAM_STR);
          $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

          // Ejecutar la consulta
          $stmt->execute();

          // Almacenar el ID generado
          $idsGenerados[] = $conn->lastInsertId();

          // Almacenar'fecha' del primer registro
          if (empty($fecha)) {
            $fecha = $registro->date;
          }
        }

        // Preparar la consulta SQL para 'remito'
        $stmtRemito = $conn->prepare("INSERT INTO `remito` (`id`, `empresaId`, `ingresos`, `comprobante`, `fecha`) VALUES (NULL, :empresaId, :ingresos, :comprobante, :fecha)");

        // Convertir el array de IDs a JSON
        $jsonIds = json_encode($idsGenerados);

        $stmtRemito->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
        $stmtRemito->bindParam(':ingresos', $jsonIds, PDO::PARAM_STR);
        $stmtRemito->bindParam(':comprobante', $comprobante, PDO::PARAM_STR);
        $stmtRemito->bindParam(':fecha', $fecha, PDO::PARAM_STR);

        // Ejecutar la consulta para 'remito'
        $stmtRemito->execute();

        // Confirmar la transacción
        $conn->commit();

        // Devolver los IDs generados y el ID de 'remito'
        echo json_encode(['ingresoIds' => $idsGenerados, 'comprobante' => $comprobante]);

      } catch (Exception $e) {
        // En caso de error, revertir la transacción
        $conn->rollBack();

        // Devolver un mensaje de error
        http_response_code(500);
        echo json_encode(['message' => 'Error al insertar registros: ' . $e->getMessage()]);
      }
    } else {
      // Manejo de error si los datos no son un array
      http_response_code(400);
      echo json_encode(['message' => 'Datos no proporcionados o formato incorrecto']);
    }
  } elseif ($method === 'PUT') {
    if (isset($data->id) && !empty($data->id)) {
      $id = $data->id;
      $date = $data->date;
      $inventarioId = $data->inventarioId;
      $nombre = $data->nombre;
      $moneda = $data->moneda;
      $monto = $data->monto;
      $method = $data->method;
      $category = $data->category;
      $comprobante = $data->comprobante;
      $anulado = $data->anulado;
      $cliente = $data->cliente;
      $margenBeneficio = $data->margenBeneficio;
      $description = $data->description;

      $stmt = $conn->prepare("UPDATE `ingresos` SET `date` = :date, `inventarioId` = :inventarioId, `nombre` = :nombre, `moneda` = :moneda, `monto` = :monto, `method` = :method, `category` = :category, `comprobante` = :comprobante, `anulado` = :anulado, `cliente` = :cliente, `margenBeneficio` = :margenBeneficio, `description` = :description WHERE `id` = :id AND `empresaId` = :empresaId;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':date', $date, PDO::PARAM_STR);
      $stmt->bindParam(':inventarioId', $inventarioId, PDO::PARAM_STR);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':moneda', $moneda, PDO::PARAM_STR);
      $stmt->bindParam(':monto', $monto, PDO::PARAM_STR);
      $stmt->bindParam(':method', $method, PDO::PARAM_STR);
      $stmt->bindParam(':category', $category, PDO::PARAM_STR);
      $stmt->bindParam(':comprobante', $comprobante, PDO::PARAM_STR);
      $stmt->bindParam(':anulado', $anulado, PDO::PARAM_STR);
      $stmt->bindParam(':cliente', $cliente, PDO::PARAM_STR);
      $stmt->bindParam(':margenBeneficio', $margenBeneficio, PDO::PARAM_STR);
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

function obtenerMaximoComprobante($conn, $empresaId)
{
  $stmt = $conn->prepare("SELECT MAX(comprobante) AS maxComp FROM remito WHERE comprobante IS NOT NULL AND comprobante != '0' AND `empresaId` = :empresaId");
  $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
  $stmt->execute();
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $maximo = $row ? intval($row['maxComp']) : 0;
  $maximo++;
  // Convertir a string y rellenar con ceros a la izquierda hasta tener una longitud de 10.
  return str_pad(strval($maximo), 10, '0', STR_PAD_LEFT);
}

$conn = null;
?>