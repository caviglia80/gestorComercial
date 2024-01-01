<?php
//header("Access-Control-Allow-Origin: *");
$allowed_domains = ['http://test.cavigliayasociados.com.ar', 'http://localhost:4200'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) 
	header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
	exit;

$servername = "localhost";
$username = "c2411522_gc";
$password = "tuPA95mala";
$dbname = "c2411522_gc";
?>
