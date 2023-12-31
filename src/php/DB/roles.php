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
ini_set('error_log', 'roles_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

$headers = apache_request_headers();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
if (!$token || $token === '') {
    http_response_code(401);
    echo json_encode(['Error' => 'No se encontro el token','Mensaje' => 'Falta configurar el .htaccess ?']); 
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
            if (isset($data->id, $data->nombre) && !empty($data->id) && !empty($data->nombre)){
                $id = $data->id;
                $nombre = $data->nombre;
                $menus = $data->menus;
                $permisos = $data->permisos;
                $descripcion = $data->descripcion;

                $stmt = $conn->prepare("UPDATE `roles` SET `nombre` = :nombre, `menus` = :menus, `permisos` = :permisos, `descripcion` = :descripcion WHERE `id` = :id AND `empresaId` = :empresaId;");
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
                $stmt->bindParam(':menus', $menus, PDO::PARAM_STR);
                $stmt->bindParam(':permisos', $permisos, PDO::PARAM_STR);
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
    }
    catch (PDOException $e) {
    http_response_code(500); // Error interno del servidor
    echo json_encode(array('message' => 'Error: ' . $e->getMessage()));
}
$conn = null;
?>
