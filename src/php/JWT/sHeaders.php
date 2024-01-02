<?php
$allowed_domains = ['http://test.cavigliayasociados.com.ar', 'http://localhost:4200'];

// Verificar el origen y establecer las cabeceras de CORS si es permitido.
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) {
  header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
  header("Access-Control-Allow-Credentials: true");
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  header("Content-Type: application/json");
} else {
  // Enviar una respuesta de error y detener la ejecución si el dominio no está permitido.
  header("HTTP/1.1 403 Access Forbidden");
  header("Content-Type: application/json");
  echo json_encode(['Error' => 'El acceso desde su origen no está permitido.', 'Origen' => $_SERVER['HTTP_ORIGIN']]);
  exit(); // Detiene la ejecución del script
}

// Respuesta específica para solicitudes OPTIONS.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if (!isset($_SERVER['HTTP_ORIGIN']) || !in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) {
    header("HTTP/1.1 403 Access Forbidden");
    exit();
  }

  // Establecer cabeceras adicionales específicas para preflight aquí si es necesario.
  header("Access-Control-Max-Age: 1728000");  // Tiempo que el navegador puede cachear la respuesta a la solicitud preflight.
  header("Content-Length: 0");
  header("Content-Type: application/json");
  exit(0); // Terminar la ejecución después de enviar las cabeceras de preflight.
}
?>