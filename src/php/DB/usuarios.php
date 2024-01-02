<?php
require_once '../headers.php';
require_once '../config.php';
require_once '../JWT/tokenVerifier.php';

try {
  $data = json_decode(file_get_contents("php://input"));
  $method = $_SERVER['REQUEST_METHOD'];
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

      $id = $data->id;

      // Comprobar si el ID del usuario a eliminar es el mismo que el del usuario actual
      if ($id == $userId) {
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