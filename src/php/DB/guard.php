<?php
require_once '../headers.php';
require_once '../config.php';
require_once '../JWT/tokenVerifier.php';

try {
  $method = $_SERVER['REQUEST_METHOD'];
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