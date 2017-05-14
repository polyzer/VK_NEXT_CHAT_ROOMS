<?php 
session_start();
if ($_SESSION["vk_vis_a_vis_rooms"]["true_connection"] && $_POST["datas"]) 
{
	// присланные AJAX данные
	$datas = json_decode(stripslashes($_POST["datas"]), true);
	// ассоциативный массив, который будет преобразован в JSON объект и возвращен через echo
	$result_arr = array();
	// ответ сервера - есть данные, или нет!
	$result_arr["server_answer"] = NULL;
	// результирующие данные, в которых хранится результат текущий
	$result_arr["result_datas"] = array();

	$mysqli = new mysqli("localhost", "root", "000000", "vk_vis_a_vis_rooms");

	if ($mysqli->connect_errno) {
		echo "Не удалось подключиться к MYSQL: (" . $mysqli->connect_errno . ") ". $mysqli->connect_error;
	} else {
		$mysqli->set_charset("utf8");
	}
	/*Парсим, что нужно пользователю*/
	switch($datas["operation"])
	{
		/*Когда нужно проверить, пользовался ли уже ВК-юзер вазави!
			IN: [vk_id, date_time];
			OUT: [server_answer: (0, 1)] ; 0 = уже был, 1 = занесен!
		*/
		case "check_and_save_user":
/*			$stmt = $mysqli->prepare("SELECT `vk_id` FROM `users` WHERE `vk_id` = '?';"); 
			$stmt->bind_param("i", $datas['vk_id']);
			$stmt->execute();
			$res = $stmt->get_result();
*/
			$res = $mysqli->query("SELECT * FROM `users` WHERE `vk_id`='".$datas["vk_id"]."';");
			if($res->num_rows > 0)
			{
				$mysqli->query("UPDATE `users` SET `date_time` = '".$datas["date_time"]."' WHERE  `vk_id`='".$datas["vk_id"]."' ;");
				$result_arr['server_answer'] = "YES_DATA";
			} else
			{
/*
				$stmt = $mysqli->prepare("INSERT INTO `users` (`vk_id`, `capabilities_id`, `status_id`, `date_time`) VALUES (?, ?, ?, ?);");
				$stmt->bind_param("iiis", $datas["vk_id"], 0,0, $datas["date_time"]);
				$stmt->execute();
*/
				$mysqli->query("INSERT INTO `users` (`vk_id`, `capability_id`, `status_id`, `date_time`) VALUES ('".$datas["vk_id"]."', '0', '0', '".$datas["date_time"]."');");				
				$result_arr["server_answer"] = "NO_DATA";
			}			
			echo json_encode($result_arr);
		break;
		/*Сохраняем полученные от пользователя параметры*/
		case "save_custom_mesh_view_params":
			$res = $mysqli->query("SELECT `vk_id` FROM `capabilities`  WHERE `vk_id`='".$datas["vk_id"]."';");
			if($res->num_rows > 0)
			{
				$mysqli->query("UPDATE `capabilities` SET `date_time` = '".$datas["date_time"]."' , `opacity` = '".$datas["opacity"]."' , `face_color` = '".$datas["face_color"]."' , `edge_color` = '".$datas["edge_color"]."'  WHERE  `vk_id`='".$datas["vk_id"]."' ;");
				$result_arr['server_answer'] = "UPDATED";
			} else
			{
				$mysqli->query("INSERT INTO `capabilities` (`capability_id`, `vk_id`, `opacity`, `face_color`, `edge_color`, `date_time`) VALUES ( NULL, '".$datas["vk_id"]."', '".$datas["opacity"]."', '".$datas["face_color"]."',  '".$datas["edge_color"]."','".$datas["date_time"]."');");				
				$result_arr["server_answer"] = "INSERTED";
			}			
			echo json_encode($result_arr);

		break;
		/*Срыгаем сохраненные пользователем параметры*/
		case "get_custom_mesh_view_params":
			$res = $mysqli->query("SELECT * FROM `capabilities` WHERE `vk_id`='".$datas["vk_id"]."';");
			if($res->num_rows > 0)
			{
				$row = $res->fetch_assoc();
				$result_arr["result_datas"]["opacity"] = $row["opacity"];
				$result_arr["result_datas"]["face_color"] = $row["face_color"];
				$result_arr["result_datas"]["edge_color"] = $row["edge_color"];
				$result_arr["server_answer"] = "YES_DATA";
			} else
			{
				$result_arr["server_answer"] = "NO_DATA";
			}			
			echo json_encode($result_arr);			
		break;

		/*Когда нужно проверить, зарегистрирован ли VK-юзер!*/
		default:
			echo "hz";
		break;
	}

} else
{
	echo "You have no permission";
}

?>