<?php
    
    function send($key, $message)
	{
		$ch = curl_init("https://alarmerbot.ru/");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
		curl_setopt($ch, CURLOPT_TIMEOUT, 3);
		curl_setopt($ch, CURLOPT_POSTFIELDS, array(
			"key" => $key,
			"message" => $message,
		));
		curl_exec($ch);
		curl_close($ch);
	}

    header('Access-Control-Allow-Origin: *');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
        header('Access-Control-Max-Age: 1728000');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        die();
    }

    $result_json = file_get_contents('php://input');

    $result_data = json_decode($result_json);

    $mysqli = new mysqli('localhost', 'xxxxxx', 'xxxxxx', 'xxxxxx');
    $mysqli->set_charset('utf8');


    if (mysqli_connect_errno()) {
        error_log("Can't connect: %s\n", mysqli_connect_error());
        exit();
    }
    
    $user_info = $result_data->userInfo;
    $insertSQL = "INSERT INTO tests (firstname, lastname, age, sex, occupation, phone, email) 
                  VALUES (
                    '$user_info->firstname',
                    '$user_info->lastname',
                    '$user_info->age',
                    '$user_info->sex',
                    '$user_info->occupation',
                    '$user_info->phone',
                    '$user_info->email');";
    if ($stmt = $mysqli->prepare($insertSQL)) {
        $stmt->execute();
        $test_id = $mysqli->insert_id;
        $stmt->close();
    }

    $insertSQL = "INSERT INTO answers (test_id, num, capacity, value, answer) VALUES (?, ?, ?, ?, ?);";
    if ($stmt = $mysqli->prepare($insertSQL)) {
        foreach(($result_data->answers) as $answer) {
            $stmt->bind_param("iisis", $test_id, $answer->num, $answer->capacity, $answer->value, $answer->answer);
            $stmt->execute();
            $answer_id = $mysqli->insert_id;

        }
        $stmt->close();
        send('6556f0-8fceca-dde2b4', $user_info->lastname . ' прошел(а) тест');
    }
    $mysqli->close();
?>
