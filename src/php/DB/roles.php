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
    $stmt = $conn->prepare("SELECT * FROM roles WHERE empresaId = ?");
    $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'DELETE') {
    if (isset($data->id) && !empty($data->id)) {
      $id = $data->id;

      // Primero, verificar si hay usuarios con el rolId y empresaId especificados.
      $checkStmt = $conn->prepare("SELECT COUNT(*) FROM `usuarios` WHERE `rolId` = :id AND `empresaId` = :empresaId;");
      $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
      $checkStmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);
      $checkStmt->execute();

      if ($checkStmt->fetchColumn() > 0) {
        // Si hay usuarios usando el rol, no permitir borrar.
        http_response_code(400); // Bad Request
        echo json_encode(array('message' => 'No se puede eliminar el rol porque está en uso.'));
        die();
      } else {
        // Si no hay usuarios usando el rol, proceder a borrar.
        $stmt = $conn->prepare("DELETE FROM `roles` WHERE `id` = :id AND `empresaId` = :empresaId;");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

        if ($stmt->execute()) {
          echo json_encode(array('message' => 'Registro eliminado.'));
        } else {
          http_response_code(500); // Error interno del servidor
          echo json_encode(array('message' => 'Error al eliminar registro (DELETE).'));
        }
      }
    } else {
      http_response_code(400); // Bad Request
      echo json_encode(array('message' => 'Parámetro id faltante (DELETE).'));
    }
  } elseif ($method === 'POST') {
    if (isset($data->nombre) && !empty($data->nombre)) {
      $nombre = $data->nombre;
      $menus = $menus = isset($data->menus) ? $data->menus : '';
      $permisos = $permisos = isset($data->permisos) ? $data->permisos : '';
      $descripcion = $descripcion = isset($data->descripcion) ? $data->descripcion : '';

      $stmt = $conn->prepare("INSERT INTO `roles` (`id`, `nombre`, `menus`, `permisos`, `descripcion`, `empresaId`) VALUES (NULL, :nombre, :menus, :permisos, :descripcion, :empresaId);");
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':menus', $menus, PDO::PARAM_STR);
      $stmt->bindParam(':permisos', $permisos, PDO::PARAM_STR);
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
    if (isset($data->id, $data->nombre) && !empty($data->id) && !empty($data->nombre)) {
      $id = $data->id;
      $nombre = $data->nombre;
      $menus = $data->menus;
      $descripcion = $data->descripcion;

      $stmt = $conn->prepare("UPDATE `roles` SET `nombre` = :nombre, `menus` = :menus, `descripcion` = :descripcion WHERE `id` = :id AND `empresaId` = :empresaId;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':menus', $menus, PDO::PARAM_STR);
      $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
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