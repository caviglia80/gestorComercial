<?php
$archivoDeErrores = './errores.log';
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', $archivoDeErrores);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "c2411522_gc";
$password = "tuPA95mala";
$dbname = "c2411522_gc";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents("php://input"));

    if ($method === 'OPTIONS') {
        echo json_encode(array('message' => 'OPTIONS: GET, POST, DELETE, PUT, OPTIONS'));

    } elseif ($method === 'GET') {
        $stmt = $conn->prepare("SELECT * FROM `facturacionAuth`;");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);

    } elseif ($method === 'PUT') {
        if (isset($data->id) && !empty($data->id)) {
            $id = $data->id;
            
            // Verificar y actualizar los campos que no están vacíos
            $updateFields = array();
            if (!empty($data->sign)) {
                $updateFields[] = 'sign = :sign';
            }
            if (!empty($data->cuit)) {
                $updateFields[] = 'cuit = :cuit';
            }
            if (!empty($data->token)) {
                $updateFields[] = 'token = :token';
            }
            if (!empty($data->expirationTime)) {
                $updateFields[] = 'expirationTime = :expirationTime';
            }
            if (!empty($data->uniqueId)) {
                $updateFields[] = 'uniqueId = :uniqueId';
            }
            if (!empty($data->certificado)) {
                $updateFields[] = 'certificado = :certificado';
            }
            if (!empty($data->llave)) {
                $updateFields[] = 'llave = :llave';
            }

            if (!empty($updateFields)) {
                $updateQuery = "UPDATE `facturacionAuth` SET " . implode(', ', $updateFields) . " WHERE `id` = :id;";
                $stmt = $conn->prepare($updateQuery);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                if (!empty($data->sign)) {
                    $stmt->bindParam(':sign', $data->sign, PDO::PARAM_STR);
                }
                if (!empty($data->cuit)) {
                    $stmt->bindParam(':cuit', $data->cuit, PDO::PARAM_STR);
                }
                if (!empty($data->token)) {
                    $stmt->bindParam(':token', $data->token, PDO::PARAM_STR);
                }
                if (!empty($data->expirationTime)) {
                    $stmt->bindParam(':expirationTime', $data->expirationTime, PDO::PARAM_STR);
                }
                if (!empty($data->uniqueId)) {
                    $stmt->bindParam(':uniqueId', $data->uniqueId, PDO::PARAM_STR);
                }
                if (!empty($data->certificado)) {
                    $stmt->bindParam(':certificado', $data->certificado, PDO::PARAM_STR);
                }
                if (!empty($data->llave)) {
                    $stmt->bindParam(':llave', $data->llave, PDO::PARAM_STR);
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
            echo json_encode(array('message' => 'Parámetros faltantes (PUT).'));
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
