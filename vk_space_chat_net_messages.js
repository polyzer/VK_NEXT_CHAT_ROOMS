/* Объект содержит сообщения, которые должны пересылаться между игроками
 * IN:
 * json_params = {
 * 	nickname,
 * 	id,
 * }
 * 
 * UtoU - от юзера к юзеру
 * UtoS - от юзера к серверу
 */
var _NetMessages = function (json_params)
{
	this.MoveMessage = {};
	this.MoveMessage.request = REQUESTS.UTOU.MOVE;
	this.MoveMessage.data = 
	{
		position: {x:0, y:0, z:0}, // Mesh.position.clone();
		rotation: {x:0, y:0, z:0}, // Mesh.rotation.clone();
	};
	
	this.ShootMessage = {};
	this.ShootMessage.request = REQUESTS.UTOU.SHOOT;
	this.ShootMessage.data = 
	{
		distance: 0,
		speed: 0,
		direction: {x:0,y:0,z:0},
		start_position: {x:0,y:0,z:0},
		gun_type: "",
		bullet_type: "",
		damage: 0 				
	};
	/*Это сообщение должно отправляться для того, чтобы получить nickname'ы
	 * уже существующих игроков!
	 */ 
	this.GetNickNameMessage = {};
	this.GetNickNameMessage.request = REQUESTS.UTOU.GET_NICKNAME;
	this.GetNickNameMessage.data = {
		requested_user_nickname: json_params.nickname,
		requested_user_id: json_params.id
	};
	/*Это сообщение должно отправляться только в ответ на запрос "get_nickname";
	*/ 
	this.SendNickNameMessage = {};
	this.SendNickNameMessage.request = REQUESTS.UTOU.SEND_NICKNAME;
	this.SendNickNameMessage.data = 
	{
		nickname: json_params.nickname,
		id: json_params.id
	};

    /* Запрос на возможность присоединиться к пользователю!
     sending_time - время, когда сообщение было отослано.
     Предполагается использование для того, если 2 пользователя
     пытаются одновременно законнектить друг друга, и получается петля.
     Чтобы разорвать одно из соединений, нужно оставить соединение того юзера,
     который сконнектился первым!

    */
	this.CanIConnectToYouMessage = {
		request: REQUESTS.UTOU.CAN_I_CONNECT_TO_YOU,
		data: {
			sending_time: null 
		}
	};

	this.YesYouCanConnectToMeMessage = {
		request: REQUESTS.UTOU.YES_YOU_CAN_CONNECT_TO_ME,
		data: {}
	};

	this.WeCanStartChattingMessage = {
		request: REQUESTS.UTOU.WE_CAN_START_CHATTING,
		data: {}
	};

	this.GetYourVisualKeeperCaseMeshParametersMessage = {
		request: REQUESTS.UTOU.GET_YOUR_VISUAL_KEEPER_CASE_MESH_PARAMETERS,
		data: {
			opacity: 0.5,
			face_color: "#ff0000",
			edge_color: "#ff0000",
			case_mesh_index: 1
		} 
	};

	this.SendMyVisualKeeperCaseMeshParametersMessage = {
		request: REQUESTS.UTOU.SEND_MY_VISUAL_KEEPER_CASE_MESH_PARAMETERS,
		data: {
			opacity: 0.5,
			face_color: "#ff0000",
			edge_color: "#ff0000",
			case_mesh_index: 1
		} 
	};

	this.GetYourVKIDMessage = {
		request:  REQUESTS.UTOU.GET_YOUR_VKID,
		data: {
			vk_id: 0
		}
	};

	this.SendMyVKIDMessage = {
		request: REQUESTS.UTOU.SEND_MY_VKID,
		data: {
			vk_id: 0
		}
	};

	this.GetYourFullData = {
		request: REQUESTS.UTOU.GET_YOUR_FULL_DATA,
		data: {
			vk_id: 0,
			opacity: 0.5,
			face_color: "#ff0000",
			edge_color: "#ff0000",
			case_mesh_index: 0			
		}
	};

	this.SendMyFullData = {
		request: REQUESTS.UTOU.SEND_MY_FULL_DATA,
		data: {
			vk_id: 0,
			opacity: 0.5,
			face_color: "#ff0000",
			edge_color: "#ff0000",
			case_mesh_index: 0						
		}
	};

};

_NetMessages.prototype.setGetYourFullDataMessage = function (json_params)
{
	for(param in Object.getOwnPropertyNames(this.GetYourFullData.data))
	{
		if(json_params.hasOwnProperty(param))
		{
			this.GetYourFullData.data[param] = json_params[param];
		} else
		{
			console.log("WE HAD UNDEFINED DATA PARAMETER: " + json_params[param]);
		}
	}
};

_NetMessages.prototype.setSendMyFullDataMessage = function (json_params)
{
	for(param in Object.getOwnPropertyNames(this.SendMyFullData.data))
	{
		if(json_params.hasOwnProperty(param))
		{
			this.SendMyFullData.data[param] = json_params[param];
		} else
		{
			console.log("WE HAD UNDEFINED DATA PARAMETER: " + json_params[param]);
		}
	}
};
/*
Функция обновляет свойства объекта this.SendMyVisualKeeperCaseMeshParametersMessage.data на 
соответствующие из json_params
*/
_NetMessages.prototype.setGetYourVisualKeeperCaseMeshParametersDataMessage = function (json_params)
{
	for(param in Object.getOwnPropertyNames(this.GetYourVisualKeeperCaseMeshParametersMessage.data))
	{
		if(json_params.hasOwnProperty(param))
		{
			this.SendMyVisualKeeperCaseMeshParametersMessage.data[param] = json_params[param];
		} else
		{
			console.log("WE HAD UNDEFINED DATA PARAMETER: " + json_params[param]);
		}
	}
};

/*
Функция обновляет свойства объекта this.SendMyVisualKeeperCaseMeshParametersMessage.data на 
соответствующие из json_params
*/
_NetMessages.prototype.setSendMyVisualKeeperCaseMeshParametersDataMessage = function (json_params)
{
	for(param in Object.getOwnPropertyNames(this.SendMyVisualKeeperCaseMeshParametersMessage.data))
	{
		if(json_params.hasOwnProperty(param))
		{
			this.SendMyVisualKeeperCaseMeshParametersMessage.data[param] = json_params[param];
		} else
		{
			console.log("WE HAD UNDEFINED DATA PARAMETER: " + json_params[param]);
		}
	}
};

_NetMessages.prototype.setNickname = function (json_params)
{
	this.GetNickNameMessage.data.requested_user_nickname = json_params.nickname;
	this.SendNickNameMessage.data.nickname = json_params.nickname;
};

_NetMessages.prototype.setID = function (json_params)
{
	this.GetNickNameMessage.data.requested_user_id = json_params.id;
	this.SendNickNameMessage.data.id = json_params.id;
};

/* Устанавливает новые о позиции корабля в пространстве, которые затем будут отправлены остальным пользователям;
 */

_NetMessages.prototype.setPositionDataFromMesh = function (mesh_object)
{
	this.MoveMessage.data.position = mesh_object.position.clone();
	this.MoveMessage.data.rotation = mesh_object.rotation.clone();
};

/*
IN:
json_params{
	my_vk_id = "string"
}
*/
_NetMessages.prototype.setSendMyVKIDMessage = function (json_params)
{
	if(json_params !== undefined)
	{
		this.SendMyVKIDMessage.data.vk_id = json_params.vk_id;
	}
};

_NetMessages.prototype.setGetYourVKIDMessage = function (json_params)
{
	if(json_params !== undefined)
	{
		this.GetYourVKIDMessage.data.vk_id = json_params.vk_id;
	}
};


_NetMessages.prototype.setCanIConnectToYouMessageData = function (json_params)
{
	this.CanIConnectToYouMessage.data.sending_time = json_params.sending_time;
};