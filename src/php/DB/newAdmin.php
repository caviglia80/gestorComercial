<?php
require_once '../headers.php';
require_once '../config.php';

try {
  $data = json_decode(file_get_contents("php://input"));
  $method = $_SERVER['REQUEST_METHOD'];
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true,
    PDO::ATTR_EMULATE_PREPARES => false,
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

  if ($method === 'POST') {
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
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->closeCursor();
        $stmt = $conn->prepare("INSERT INTO `usuarios` (`username`, `fullname`, `phone`, `email`, `password`) VALUES (:username, :fullname, :phone, :email, :password);");
        $stmt->bindParam(':username', $data->username, PDO::PARAM_STR);
        $stmt->bindParam(':fullname', $data->fullname, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $data->phone, PDO::PARAM_STR);
        $stmt->bindParam(':email', $data->email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        if (!$stmt->execute())
          throw new Exception('Error al intentar crear usuario.');

        $usuarioId = $conn->lastInsertId();

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
        $stmt = $conn->prepare("UPDATE `usuarios` SET `empresaId` = :empresaId, `administrador` = '1' WHERE `id` = :usuarioId;");
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
        $stmt->bindParam(':usuarioId', $usuarioId, PDO::PARAM_INT);
        if (!$stmt->execute())
          throw new Exception('Error al intentar configurar usuario.');

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