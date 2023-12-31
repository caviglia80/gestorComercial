<?php
ini_set('log_errors', 1);
ini_set('error_log', 'tokenVerifier_error.txt');
ini_set('display_errors', 0); // Desactiva la visualización de errores
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
  exit;

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
    $decoded = $decoded ? $decoded : null;

    return $decoded;
  } catch (Firebase\JWT\ExpiredException $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    return null;
  } catch (Firebase\JWT\SignatureInvalidException $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    return null;
  } catch (Firebase\JWT\BeforeValidException $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    return null;
  } catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['Error' => $e->getMessage()]);
    return null;
  }
}
?>