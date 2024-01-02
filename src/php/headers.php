<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Content-Type: application/json");

// Respuesta específica para solicitudes OPTIONS.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header("Access-Control-Max-Age: 1728000");  // Tiempo que el navegador puede cachear la respuesta a la solicitud preflight.
  header("Content-Length: 0");
  header("Content-Type: application/json");
  exit(0); // Terminar la ejecución después de enviar las cabeceras de preflight.
}
?>