<?php
    $mysqli = new mysqli('localhost', 'xxxxx', 'xxxxx', 'xxxxx');
    $mysqli->set_charset('utf8');

    if (mysqli_connect_errno()) {
        error_log("Can't connect: %s\n", mysqli_connect_error());
        exit();
    }


    $sql = "SELECT * FROM tests WHERE id = " . $_GET["test"];
    $result = $mysqli->query($sql);

    $test = $result->fetch_assoc();

    $result_data["userInfo"] = [];
    $result_data["userInfo"]["firstname"] = $test["firstname"];
    $result_data["userInfo"]["lastname"] = $test["lastname"];
    $result_data["userInfo"]["age"] = $test["age"];
    $result_data["userInfo"]["sex"] = $test["sex"];
    $result_data["userInfo"]["occupation"] = $test["occupation"];
    $result_data["userInfo"]["phone"] = $test["phone"];
    $result_data["userInfo"]["email"] = $test["email"];

    $sql = "SELECT * FROM answers WHERE test_id = " . $_GET["test"];
    $result = $mysqli->query($sql);
    $answers = [];
    while ($answer = $result->fetch_assoc()) {
        $answerData = [];
        $answerData["num"] = $answer["num"];
        $answerData["capacity"] = $answer["capacity"];
        $answerData["value"] = $answer["value"];
        $answerData["answer"] = $answer["answer"];
        $answers[] = $answerData;
    }
    $mysqli->close();
    $result_data["answers"] = $answers;
    $result_json = json_encode($result_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);

    echo $result_json;
?>
