<?php
ini_set("display_errors", 1);

$history_size = 3;

$filepath = sys_get_temp_dir() . "/webclipboard.json";
if (file_exists($filepath)) {
    $data = file_get_contents($filepath);
    $items = json_decode($data, true);
} else {
    $items = array_fill(0, $history_size, "");
}

// https://amirkamizi.com/blog/php-simple-rest-api

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        header("Content-Type: application/json");
        echo json_encode($items, JSON_PRETTY_PRINT);
        break;
    case "POST":
        header("Content-Type: application/json");
        $item = $_POST["input"];
        if (empty($item)) {
            http_response_code(404);
            echo json_encode(["error" => "item content missing"]);
            break;
        }
        array_unshift($items , $_POST["input"]);
        $items = array_slice($items, 0, $history_size);
        $data = json_encode($items, JSON_PRETTY_PRINT);
        if (file_put_contents($filepath, $data) === false) {
            http_response_code(404);
            echo json_encode(["error" => "failed to write file"]);
            break;
        }

        // Immediate reads can fail (intermittently) due to filesystem caching.
        echo json_encode(["message" => "item saved/cached successfully"]);
        break;
}
?>
