<?php
require_once '../headers.php';
require_once '../config.php';
require_once '../JWT/tokenVerifier.php';

try {
  $method = $_SERVER['REQUEST_METHOD'];
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
    PDO::ATTR_EMULATE_PREPARES => true, // Desactivar emulación de sentencias preparadas
  ];
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);

  if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM empresa WHERE id = ?");
    $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

  } elseif ($method === 'PUT') {
    $updateFields = array();

    if (!empty($data->icono)) {
      $updateFields[] = 'icono = :icono';
    }
    if (isset($data->usuarioId)) {
      $updateFields[] = 'usuarioId = :usuarioId';
    }
    if (isset($data->copyEnabled)) {
      $updateFields[] = 'copyEnabled = :copyEnabled';
    }
    if (!empty($data->color1)) {
      $updateFields[] = 'color1 = :color1';
    }

    if (!empty($data->color2)) {
      $updateFields[] = 'color2 = :color2';
    }

    if (isset($data->ingresoRapidoEnabled)) {
      $updateFields[] = 'ingresoRapidoEnabled = :ingresoRapidoEnabled';
    }

    if (isset($data->egresoRapidoEnabled)) {
      $updateFields[] = 'egresoRapidoEnabled = :egresoRapidoEnabled';
    }

    if (isset($data->ingresoRestaStockEnabled)) {
      $updateFields[] = 'ingresoRestaStockEnabled = :ingresoRestaStockEnabled';
    }

    if (isset($data->ingresoAnuladoSumaStockEnabled)) {
      $updateFields[] = 'ingresoAnuladoSumaStockEnabled = :ingresoAnuladoSumaStockEnabled';
    }

    if (isset($data->permitirStockCeroEnabled)) {
      $updateFields[] = 'permitirStockCeroEnabled = :permitirStockCeroEnabled';
    }

    if (isset($data->validarInventarioEnabled)) {
      $updateFields[] = 'validarInventarioEnabled = :validarInventarioEnabled';
    }

    if (isset($data->nombre)) {
      $updateFields[] = 'nombre = :nombre';
    }

    if (!empty($updateFields)) {
      $updateQuery = "UPDATE `empresa` SET " . implode(', ', $updateFields) . " WHERE `id` = :id;";
      $stmt = $conn->prepare($updateQuery);
      $stmt->bindParam(':id', $empresaId, PDO::PARAM_INT);

      if (isset($data->usuarioId)) {
        $stmt->bindParam(':usuarioId', $data->usuarioId, PDO::PARAM_STR);
      }

      if (!empty($data->icono)) {
        $stmt->bindParam(':icono', $data->icono, PDO::PARAM_STR);
      }

      if (isset($data->copyEnabled)) {
        $stmt->bindParam(':copyEnabled', $data->copyEnabled, PDO::PARAM_STR);
      }

      if (!empty($data->color1)) {
        $stmt->bindParam(':color1', $data->color1, PDO::PARAM_STR);
      }

      if (!empty($data->color2)) {
        $stmt->bindParam(':color2', $data->color2, PDO::PARAM_STR);
      }

      if (isset($data->ingresoRapidoEnabled)) {
        $stmt->bindParam(':ingresoRapidoEnabled', $data->ingresoRapidoEnabled, PDO::PARAM_STR);
      }

      if (isset($data->egresoRapidoEnabled)) {
        $stmt->bindParam(':egresoRapidoEnabled', $data->egresoRapidoEnabled, PDO::PARAM_STR);
      }

      if (isset($data->ingresoRestaStockEnabled)) {
        $stmt->bindParam(':ingresoRestaStockEnabled', $data->ingresoRestaStockEnabled, PDO::PARAM_STR);
      }

      if (isset($data->ingresoAnuladoSumaStockEnabled)) {
        $stmt->bindParam(':ingresoAnuladoSumaStockEnabled', $data->ingresoAnuladoSumaStockEnabled, PDO::PARAM_STR);
      }

      if (isset($data->permitirStockCeroEnabled)) {
        $stmt->bindParam(':permitirStockCeroEnabled', $data->permitirStockCeroEnabled, PDO::PARAM_STR);
      }

      if (isset($data->validarInventarioEnabled)) {
        $stmt->bindParam(':validarInventarioEnabled', $data->validarInventarioEnabled, PDO::PARAM_STR);
      }

      if (isset($data->nombre)) {
        $stmt->bindParam(':nombre', $data->nombre, PDO::PARAM_STR);
      }

      if ($stmt->execute()) {
        echo json_encode(array('message' => 'Registro editado.'));
      } else {
        http_response_code(500);
        echo json_encode(array('message' => 'Error al editar registro (PUT).'));
      }
    } else {
      http_response_code(400);
      echo json_encode(array('message' => 'No se proporcionaron valores para actualizar.'));
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