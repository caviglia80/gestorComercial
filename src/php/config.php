<?php
function errores($errno, $errstr, $errfile, $errline, $empresaId = '?', $userId = '?')
{
  $currentDateTime = date('Y-m-d H:i:s');
  $path_parts = pathinfo($errfile);
  $log_file_name = 'Errores-' . $path_parts['filename'] . '.txt';
  $error_message = "[$currentDateTime] Error: [$errno] $errstr - Error on line $errline in $errfile. Empresa ID: $empresaId, Usuario ID: $userId\n";
  error_log($error_message, 3, $log_file_name);
}

// Establecer como el manejador de errores predeterminado
set_error_handler("errores");
ini_set('log_errors', 1);
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once $_SERVER['DOCUMENT_ROOT'] . '/../../storagedir/private/dbConfig.php';
#  Instalacion: tener en cuenta que las credenciales de la base de datos se encuentran en:
#  /storagedir/private/dCbonfig.php ($servername,$username,$password,$dbname)
#  Tambien se debe configurar el .htaccess en la carpeta raiz para que se acepte el encabezado de Autorization.
?>