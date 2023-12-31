<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS')
  exit;

// NOTA: se debe configurar el .htaccess para que se acepte el encabezado de Autorization
require_once '../JWT/tokenVerifier.php';

ini_set('log_errors', 1);
ini_set('error_log', 'usuarios_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"));
$empresaId = 0; //inicializar si o si con 0 (si es admin despues se edita con la nueva empresa, si es empleado se agarra del jwt de la empresa que lo creo)

try {
  if (!isset($data->isNewAdmin) || $data->isNewAdmin === '0') {
    $headers = apache_request_headers();
    $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
    if (!$token || $token === '') {
      throw new Exception('No se encontró el token o está vacío', 401);
    }

    $decoded = verifyToken($token);
    if (!$decoded->userId || !$decoded->empresaId) {
      throw new Exception('Token inválido', 401);
    }
    $empresaId = $decoded->empresaId;
  }

  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true,
    PDO::ATTR_EMULATE_PREPARES => false,
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT id, administrador, empresaId, rolId, email, username, fullname, phone FROM usuarios WHERE empresaId = :empresaId");
    $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
    if (!$stmt->execute())
      throw new Exception('Error al intentar obtener registros.');
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'DELETE') {
    if (isset($data->id) && !empty($data->id)) {

      $currentUserId = $decoded->userId;
      $id = $data->id;

      // Comprobar si el ID del usuario a eliminar es el mismo que el del usuario actual
      if ($id == $currentUserId) {
        http_response_code(400);
        die("No es posible eliminar el usuario actual.");
      }

      // Comprobar si el usuario a eliminar es el usuario principal de la empresa
      $stmt = $conn->prepare("SELECT COUNT(*) FROM `empresa` WHERE `usuarioId` = :id AND `id` = :empresaId");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
      $stmt->execute();

      if ($stmt->fetchColumn() > 0) {
        http_response_code(400);
        die("No es posible eliminar un administrador.");
      }

      // Si las comprobaciones anteriores pasan, proceder con la eliminación
      $stmt = $conn->prepare("DELETE FROM `usuarios` WHERE id = :id AND `empresaId` = :empresaId;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      if ($stmt->execute()) {
        echo json_encode(['message' => 'Registro eliminado.']);
      } else {
        http_response_code(500); // Error interno del servidor
        echo json_encode(['message' => 'Error al eliminar registro (DELETE).']);
      }
    } else {
      http_response_code(400);
      echo json_encode(['message' => 'Parámetro id faltante (DELETE).']);
    }
  } elseif ($method === 'POST') {
    if ($data === null) {
      http_response_code(400);
      die('Cuerpo de la solicitud vacío o mal formado.');
    }
    if (
      isset($data->username, $data->fullname, $data->phone, $data->email, $data->password)
      && !empty($data->username) && !empty($data->fullname) && !empty($data->phone)
      && !empty($data->email) && !empty($data->password)
    ) {

      try {
        $conn->beginTransaction();

        // Verificar si el email ya existe
        $stmt = $conn->prepare("SELECT COUNT(*) FROM `usuarios` WHERE `email` = :email");
        $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->fetchColumn() > 0)
          throw new Exception('El correo ya se encuentra registrado.');

        // Insertar usuario
        $rolId = isset($data->rolId) ? $data->rolId : null;
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->closeCursor();
        $stmt = $conn->prepare("INSERT INTO `usuarios` (`username`, `fullname`, `phone`, `email`, `password`, `empresaId`, `rolId`) VALUES (:username, :fullname, :phone, :email, :password, :empresaId, :rolId);");
        $stmt->bindParam(':username', $data->username, PDO::PARAM_STR);
        $stmt->bindParam(':fullname', $data->fullname, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $data->phone, PDO::PARAM_STR);
        $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
        $stmt->bindParam(':rolId', $rolId, PDO::PARAM_INT);
        if (!$stmt->execute())
          throw new Exception('Error al intentar crear usuario.');

        $usuarioId = $conn->lastInsertId();

        // Procesar si es isNewAdmin
        if (isset($data->isNewAdmin) && $data->isNewAdmin === '1') {
          $administrador = '1';

          $fechaActual = new DateTime();
          $fechaActual->modify('+1 month');
          $fechaVencimiento = $fechaActual->format('Y-m-d');

          $stmt->closeCursor();
          $stmt = $conn->prepare("INSERT INTO `empresa` (`usuarioId`, `fechaVencimiento`) VALUES (:usuarioId, :fechaVencimiento);");
          $stmt->bindParam(':usuarioId', $usuarioId, PDO::PARAM_INT);
          $stmt->bindParam(':fechaVencimiento', $fechaVencimiento, PDO::PARAM_STR);
          if (!$stmt->execute())
            throw new Exception('Error al intentar crear empresa.');
          $empresaId = $conn->lastInsertId();

          $stmt->closeCursor();
          $stmt = $conn->prepare("UPDATE `usuarios` SET `empresaId` = :empresaId, `administrador` = :administrador WHERE `id` = :id;");
          $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
          $stmt->bindParam(':administrador', $administrador, PDO::PARAM_STR);
          $stmt->bindParam(':id', $usuarioId, PDO::PARAM_INT);
          if (!$stmt->execute())
            throw new Exception('Error al intentar configurar usuario.');
        }

        $conn->commit();
        echo json_encode(['message' => 'Registros generados', 'usuarioId' => $usuarioId, 'empresaId' => isset($empresaId) ? $empresaId : null]);
      } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(400);
        echo json_encode(['message' => $e->getMessage()]);
      }
    } else {
      http_response_code(400);
      echo json_encode(['message' => 'Datos incompletos o inválidos.']);
    }
  } elseif ($method === 'PUT') {
    if ($data === null) {
      http_response_code(400);
      die('Cuerpo de la solicitud vacío o mal formado.');
    }

    $id = $data->id;
    $updateFields = array();

    if (!empty($data->username)) {
      $updateFields[] = 'username = :username';
    }
    if (!empty($data->fullname)) {
      $updateFields[] = 'fullname = :fullname';
    }
    if (!empty($data->phone)) {
      $updateFields[] = 'phone = :phone';
    }
    if (!empty($data->email)) {
      $updateFields[] = 'email = :email';
    }
    if (!empty($data->password)) {
      $updateFields[] = 'password = :password';
    }
    if (!empty($data->rolId)) {
      $updateFields[] = 'rolId = :rolId';
    }

    if (!empty($updateFields)) {
      $updateQuery = "UPDATE `usuarios` SET " . implode(', ', $updateFields) . " WHERE `id` = :id AND `empresaId` = :empresaId;";
      $stmt = $conn->prepare($updateQuery);
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      if (isset($data->username)) {
        $stmt->bindParam(':username', $data->username, PDO::PARAM_STR);
      }
      if (isset($data->fullname)) {
        $stmt->bindParam(':fullname', $data->fullname, PDO::PARAM_STR);
      }
      if (isset($data->phone)) {
        $stmt->bindParam(':phone', $data->phone, PDO::PARAM_STR);
      }
      if (isset($data->email)) {
        $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
      }
      if (isset($data->password)) {
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
      }
      if (isset($data->rolId)) {
        $stmt->bindParam(':rolId', $data->rolId, PDO::PARAM_INT);
      }

      if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
          echo json_encode(['message' => 'Registro editado.', 'id' => $id]);
        } else {
          echo json_encode(['message' => 'No se encontraron registros para actualizar.', 'id' => $id]);
        }
      } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error al editar registro (PUT).']);
      }
    } else {
      http_response_code(400);
      echo json_encode(['message' => 'No se proporcionaron valores para actualizar.']);
    }
  } else {
    http_response_code(400);
    echo json_encode(['message' => 'Metodo incorrecto.']);
  }

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['message' => 'Error de base de datos: ' . $e->getMessage()]);
  exit;
} catch (Exception $e) {
  http_response_code($e->getCode() ?: 400);
  echo json_encode(['message' => $e->getMessage()]);
  exit;
}
$conn = null;
?>