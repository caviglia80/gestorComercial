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
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

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
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      } elseif ($reporte == 3) {
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
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

      } elseif ($reporte == 4) {
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
        $stmt->bindParam(':empresaId', $empresaId, PDO::PARAM_INT);

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