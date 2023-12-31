<?php
require_once __DIR__ . '/src/JWTExceptionWithPayloadInterface.php';
require_once __DIR__ . '/src/BeforeValidException.php';
require_once __DIR__ . '/src/ExpiredException.php';
require_once __DIR__ . '/src/SignatureInvalidException.php';
require_once __DIR__ . '/src/JWT.php';
require_once __DIR__ . '/src/Key.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

function verifyToken($token)
{
  $secretKey = "H;l=/$7k[{_L[0p)RSB^[?Q?pGZ94yP7R+Y=1/<vmE-KaGJhbd6a>0mdGpY6Ly~i";

  try {
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    $decoded = $decoded ?: null;

    return $decoded;
  } catch (Firebase\JWT\ExpiredException $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    die();
  } catch (Firebase\JWT\SignatureInvalidException $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    die();
  } catch (Firebase\JWT\BeforeValidException $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    die();
  } catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    die();
  }
}

$headers = apache_request_headers();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
if (!$token || $token === '') {
  http_response_code(401);
  echo json_encode(['Error' => 'No se encontró el token.', 'Mensaje' => 'Falta configurar el .htaccess?']);
  die(); // Detiene la ejecución si no se encuentra el token
}

$decoded = verifyToken($token);
$empresaId = $decoded->empresaId ?? null;
$userId = $decoded->userId ?? null;

if (!$userId || !$empresaId) {
  http_response_code(401);
  die(); // Detiene la ejecución si no se obtienen los IDs necesarios
}
?>