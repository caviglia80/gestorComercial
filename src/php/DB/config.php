<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
  exit;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../../storagedir/private/dbConfig.php';

#  Instalacion: tener en cuenta que las credenciales de la base de datos se encuentran en:
#  /storagedir/private/dCbonfig.php ($servername,$username,$password,$dbname)
#  Tambien se debe configurar el .htaccess en la carpeta raiz para que se acepte el encabezado de Autorization.
?>