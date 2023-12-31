<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') 
    exit;

ini_set('log_errors', 1);
ini_set('error_log', 'reportes_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

// NOTA: se debe configurar el .htaccess para que se acepte el encabezado de Autorization
require_once '../JWT/tokenVerifier.php';

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

require_once 'config.php';

try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_PERSISTENT => true, // Habilitar conexiones persistentes
        PDO::ATTR_EMULATE_PREPARES => false, // Desactivar emulación de sentencias preparadas
    ];
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $options);
    $data = json_decode(file_get_contents("php://input"));
    $reporte = isset($_GET['reporte']) ? $_GET['reporte'] : null;
    $startd = isset($_GET['startd']) ? $_GET['startd'] : null;
    $endd = isset($_GET['endd']) ? $_GET['endd'] : null;
    $query = '';

    if ($method === 'GET') {

        if ($reporte !== null) {

            if ($reporte == 1) {
                $query = 'SELECT
                    inv.id AS id,
                    inv.nombre AS name,
                    SUM(CASE WHEN i.anulado = 0 THEN 1 ELSE 0 END) AS cantidadIngresos,
                    SUM(CASE WHEN i.anulado = 0 THEN i.monto ELSE 0 END) AS totalIngresos,
                    ROUND(SUM(CASE WHEN i.anulado = 0 THEN 
                        (CASE WHEN i.margenBeneficio IS NOT NULL THEN (i.monto - ((i.margenBeneficio / 2) * i.monto / 100))
                        ELSE i.monto END) ELSE 0 END), 2) AS margenGanancias
                FROM inventario inv
                LEFT JOIN ingresos i ON inv.id = i.inventarioId AND i.empresaId = :empresaId
                GROUP BY inv.id, inv.nombre;';

                $stmt = $conn->prepare($query);
                $stmt->bindParam(':empresaId', $decoded->empresaId, PDO::PARAM_INT);

            } elseif ($reporte == 2) {
                $query = "SELECT
                    inv.id AS id,
                    inv.nombre AS name,
                    SUM(CASE WHEN i.anulado = 0 THEN 1 ELSE 0 END) AS cantidadIngresos,
                    SUM(CASE WHEN i.anulado = 0 THEN i.monto ELSE 0 END) AS totalIngresos,
                    ROUND(SUM(CASE WHEN i.anulado = 0 THEN 
                        (CASE WHEN i.margenBeneficio IS NOT NULL THEN (i.monto - ((i.margenBeneficio / 2) * i.monto / 100))
                        ELSE i.monto END) ELSE 0 END), 2) AS margenGanancias
                FROM inventario inv
                LEFT JOIN ingresos i ON inv.id = i.inventarioId
                WHERE i.date BETWEEN :startd AND :endd AND i.empresaId = :empresaId
                GROUP BY inv.id, inv.nombre";

                $stmt = $conn->prepare($query);
                $stmt->bindParam(':startd', $startd, PDO::PARAM_STR);
                $stmt->bindParam(':endd', $endd, PDO::PARAM_STR);
                $stmt->bindParam(':empresaId', $decoded->empresaId, PDO::PARAM_INT);

            }elseif ($reporte == 3) {
                $query = "SELECT
                category AS rubro,
                COUNT(*) AS cantidadEgresos,
                SUM(monto) AS montoTotalEgresos
                FROM
                egresos AS e
                WHERE
                e.date BETWEEN :startd AND :endd AND e.empresaId = :empresaId
                GROUP BY
                category;";

                $stmt = $conn->prepare($query);
                $stmt->bindParam(':startd', $startd, PDO::PARAM_STR);
                $stmt->bindParam(':endd', $endd, PDO::PARAM_STR);
                 $stmt->bindParam(':empresaId', $decoded->empresaId, PDO::PARAM_INT);

            }elseif ($reporte == 4) {
                $query = "SELECT
                beneficiario AS bp,
                COUNT(*) AS cantidadEgresos,
                SUM(monto) AS montoTotalEgresos
                FROM
                egresos AS e
                WHERE
                e.date BETWEEN :startd AND :endd AND e.empresaId = :empresaId
                GROUP BY
                beneficiario;";

                $stmt = $conn->prepare($query);
                $stmt->bindParam(':startd', $startd, PDO::PARAM_STR);
                $stmt->bindParam(':endd', $endd, PDO::PARAM_STR);
                 $stmt->bindParam(':empresaId', $decoded->empresaId, PDO::PARAM_INT);

            } else {
               http_response_code(400);
               echo json_encode(array('message' => 'Falta elegir reporte.'));
           }
           if ($query != '') {
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($data);
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'Reporte no válido.'));
        }
    } else {
        http_response_code(400);
        echo json_encode(array('message' => 'Reporte vacio.'));
    }
}  else {
    http_response_code(400);
    echo json_encode(array('message' => 'Metodo incorrecto.'));
}}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error: ' . $e->getMessage()));
}
$conn = null;
?>
