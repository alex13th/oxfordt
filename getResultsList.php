<?php
    $mysqli = new mysqli('localhost', 'xxxxxx', 'xxxxxx', 'xxxxxx');
    $mysqli->set_charset('utf8');

    if (mysqli_connect_errno()) {
        error_log("Can't connect: %s\n", mysqli_connect_error());
        exit();
    }


    $sql = "SELECT * FROM tests ORDER BY completed_at DESC;";
    $result = $mysqli->query($sql);

    $resultsList = [];
    while ($test = $result->fetch_assoc()) {
        $result_data = [];
        $result_data["id"] = $test["id"];
        $result_data["completedAt"] = $test["completed_at"];
        $result_data["firstname"] = $test["firstname"];
        $result_data["lastname"] = $test["lastname"];
        $result_data["age"] = $test["age"];
        $result_data["sex"] = $test["sex"];
        $result_data["occupation"] = $test["occupation"];
        $resultsList[] = $result_data;
    }

    $mysqli->close();

    $result_json = json_encode($resultsList, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);

    echo $result_json;
?>
