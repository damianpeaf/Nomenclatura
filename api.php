<?php

$numeroAtomico = $_GET['numeroAtomico'] ?? null;

$data = file_get_contents("./api.json");

$elementos = json_decode($data, true);

// echo var_dump($elementos);

$elementosFormateados = [];

foreach ($elementos as $elemento) {

    $elementosFormateados[] = $elemento;
}

if ($numeroAtomico != null) {

    $elementosFormateados = $elementosFormateados[$numeroAtomico - 1];
}

// echo var_dump($elementosFormateados);

echo json_encode($elementosFormateados);
