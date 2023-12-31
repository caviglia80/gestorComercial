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
ini_set('error_log', 'remito_error.txt');
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
        PDO::ATTR_EMULATE_PREPARES => true, // Desactivar emulación de sentencias preparadas
    ];
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);
    $data = json_decode(file_get_contents("php://input"));

    if ($method === 'GET') {
        $stmt = $conn->prepare("SELECT * FROM remito WHERE empresaId = ?");
        $stmt->bindParam(1, $empresaId, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);

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
