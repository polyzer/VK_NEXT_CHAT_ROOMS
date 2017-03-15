
var _VKSpaceChat = function (json_params) 
{
	this.createUsersByExistingConnectionsBF = this.createUsersByExistingConnections.bind(this);
	this.updateWorkingProcessBF = this.updateWorkingProcess.bind(this);
	this.createUserByRecievedConnectionBF = this.createUserByRecievedConnection.bind(this);
	this.makeCallsToAllRemoteUsersBF = this.makeCallsToAllRemoteUsers.bind(this);
	this.onOpenInitAndStartGameBF = this.onOpenInitAndStartGame.bind(this);
	this.onPeerServerConnectionOpenBF = this.onPeerServerConnectionOpen.bind(this);
	this.onRecieveMediaConnectionBF = this.onRecieveMediaConnection.bind(this);
	this.onFindNewRoomBF = this.onFindNewRoom.bind(this);
	this.resetWorldAndCreateUsersByExistingConnectionsBF = this.resetWorldAndCreateUsersByExistingConnections.bind(this);

	this.Renderer = null;
	this.CSSRenderer = null;
	this.Camera = null;


	if(json_params !== undefined)
	{
		if(json_params.renderer !== undefined)
		{
			this.Renderer = json_params.renderer;
		}
		if(json_params.css_renderer !== undefined)
		{
			this.CSSRenderer = json_params.css_renderer;
		}
		if(json_params.camera !== undefined)
		{
			this.Camera = json_params.camera;
			this.Camera.position.set(0,0,0);
		}
	}
	// подготовка
	this.Container = document.createElement("div");
	this.Container.tabindex = 1;
	this.Container.autofocus = true;
	this.Container.setAttribute("id", "MainContainer");
	document.body.appendChild(this.Container);


	if(this.Camera === null)
	{
		this.Camera = new THREE.PerspectiveCamera(
			CAMERA_PARAMETERS.ANGLE, 
			CAMERA_PARAMETERS.SCREEN_WIDTH/CAMERA_PARAMETERS.SCREEN_HEIGHT, 
			CAMERA_PARAMETERS.NEAR, 
			CAMERA_PARAMETERS.FAR
		);
	}
	if(this.Renderer === null)
	{
		this.Renderer = new THREE.WebGLRenderer();
	}
	this.Renderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	
	if(this.CSSRenderer === null)
	{
		this.CSSRenderer = new THREE.CSS3DRenderer();	
	}

	this.Scene = new THREE.Scene();
	this.CSSScene = new THREE.Scene();
	this.Scenes = [this.Scene, this.CSSScene];


	var startexture = new THREE.ImageUtils.loadTexture("models/bg_1_1.png");
	var ambientlight = new THREE.AmbientLight( 0xffffff, 5 );
	this.Scene.add(ambientlight);


	this.SkyBox = {};
	this.SkyBox.Geometry = new THREE.BoxGeometry(WORLD_CUBE.SIZE.x, WORLD_CUBE.SIZE.y, WORLD_CUBE.SIZE.z);
	this.SkyBox.Geometry.scale(WORLD_CUBE.SCALE.x, WORLD_CUBE.SCALE.y, WORLD_CUBE.SCALE.z);
	this.SkyBox.Material = new THREE.MeshStandardMaterial({map: startexture, side: THREE.BackSide});
	this.SkyBox.Mesh = new THREE.Mesh(this.SkyBox.Geometry, this.SkyBox.Material);
	this.Scene.add(this.SkyBox.Mesh);																						

	this.FlyingObjects = new _FlyingObjects(this.Scene);																					
	
	this.Container.appendChild(this.Renderer.domElement);

	this.CSSRenderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	this.CSSRenderer.domElement.style.position = "absolute";
	this.CSSRenderer.domElement.style.top = 0;
	this.Container.appendChild(this.CSSRenderer.domElement);

	this.Clock = new THREE.Clock();
	
	this.Body = json_params.body;
	
// ВНИМАНИЕ: В игре используется глобальный объект		
	this.NetMessagesObject = new _NetMessages({nickname: this.Nickname, id: this.ID});
	
	// Список удаленных игроков;
	this.RemoteUsers = [];
 
  // Локальный игрок
	this.LocalUser = null;
	/*Все игроки в системе.
	[0] - LocalUser;
	[1] - RemoteUsers - удаленные игроки
  структура, хранящая всех игроков, включая локального;	
	*/
	this.AllUsers = [];

	/*Идентификатор комнаты будет устанавливаться,
		когда пользователь будет в комнате;
	*/
	this.RoomID = null;
	if(json_params.room_id !== undefined)
		this.setRoomID(json_params.room_id);
	else
		this.setRoomID(DEFAULT_ROOM_ID);

	this.Peer = window.Peer;
	this.Peer.on("connection", this.createUserByRecievedConnectionBF);
	this.Peer.on("call", this.onRecieveMediaConnectionBF);
	this.Peer.on("error", function (err) {
		console.log(err.type);
	});

	this.VisavisCounter = {};
	this.VisavisCounter.Div = document.createElement("div");
	this.VisavisCounter.Div.appendChild(document.createTextNode("Визави в комнате: 0"));
	document.body.appendChild(this.VisavisCounter.Div);
	this.VisavisCounter.Div.id = "VisavisCounter";
	this.VisavisCounter.LastNum = 0;

	this.Time = Date.now();
	this.onOpenInitAndStartGame();
};		

_VKSpaceChat.prototype.onRecieveMediaConnection = function (call)
{
	for(var i=0; i<this.AllUsers[1].length; i++)
	{
		//call.answer(Stream);
		if(this.AllUsers[1][i].getPeerID() === call.peer)
			this.AllUsers[1][i].onCall(call);
	}
};

_VKSpaceChat.prototype.onPeerServerConnectionOpen = function ()
{
	this.comeIntoRoom();
};

/* Инициализирует начало работы Peer.js
 */
_VKSpaceChat.prototype.onOpenInitAndStartGame = function (e)
{
	// Локальный игрок, который будет
	this.LocalUser = new _LocalUser({
		scene: this.Scene, 
		all_users: this.AllUsers, 
		net_messages_object: this.NetMessagesObject,
		camera: this.Camera,
		body: this.Body,
		stream: window.StreamObj,
		peer: this.Peer,
		cssscene: this.CSSScene,
		chat_controls_callback_bf: this.onFindNewRoomBF
	});
	this.AllUsers.push(this.LocalUser);
	this.AllUsers.push(this.RemoteUsers);

	this.getAndSetInitConnections();

	this.startWorkingProcess();

}

_VKSpaceChat.prototype.onFindNewRoom = function ()
{
	var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.FIND_ROOM_TO_ME;
	$.ajax({
		type:"POST",
		url: req_str,
		async: true,
		data: {user_id: this.Peer.id},
		success: this.resetWorldAndCreateUsersByExistingConnectionsBF,
		error: function (jqXHR, textStatus, errorThrown) {
			alert(textStatus + " " + errorThrown);
		}
	});	
}

_VKSpaceChat.prototype.resetWorldAndCreateUsersByExistingConnections = function(json_params)
{
	this.disconnectRemoteUsers();
	this.AllUsers[0].resetMeForNewRoom();
	this.createUsersByExistingConnections(json_params);
};

/* Важнейшая функция.
 * Создает соединения с пользователями, которые уже
 * находятся в сети.
 * Принимает на вход:
 * json_params: {response: [ids]}
 */
_VKSpaceChat.prototype.createUsersByExistingConnections = function (json_params)
{
	if(json_params === "undefined")
	{
		throw new Error(this.constructor.name + ".createUsersByExistingConnections(json_response) - have no json_response");
		return;
	}
	
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	for(var i=0; i<json_params.users_array.length; i++)
	{
		// на сервере уже будет установлено наше соединение;
		// а сами к себе мы подсоединяться не должны!
		if(this.Peer.id === json_params.users_array[i])
		{
			continue;
		}
		var conn = this.Peer.connect(json_params.users_array[i]);
		this.RemoteUsers.push(new _RemoteUser({
				net_messages_object: this.NetMessagesObject,
				all_users: this.AllUsers,
				scene: this.Scene,
				connection: conn
			}));
	}

	this.makeCallsToAllRemoteUsers(this.AllUsers[0].getStream());	
};
/*
 * 
*/
_VKSpaceChat.prototype.makeCallsToAllRemoteUsers = function (stream)
{
	for(var i=0; i<this.AllUsers[1].length; i++)
	{
		this.AllUsers[1][i].MediaConnection = this.Peer.call(this.AllUsers[1][i].getPeerID(), stream);
		this.AllUsers[1][i].MediaConnection.on("stream", this.AllUsers[1][i].onStreamBF);
	}
	
};

_VKSpaceChat.prototype.updateVisavisCounter = function ()
{
	if(this.AllUsers[1].length !== this.LastNum)
	{
		this.VisavisCounter.Div.removeChild(this.VisavisCounter.Div.firstChild);
		this.VisavisCounter.Div.appendChild(document.createTextNode("Визави в комнате: " + this.AllUsers[1].length));
		this.LastNum = this.AllUsers[1].length;
	}
};

/* Важнейшая функция игры, в которой происходит управление и обновление всех систем!!
 */

_VKSpaceChat.prototype.updateWorkingProcess = function ()
{

		this.Renderer.render(this.Scene, this.Camera);
		this.CSSRenderer.render(this.CSSScene, this.Camera);
		this.updateRemoteUsers();
		this.FlyingObjects.update();
		this.LocalUser.update(Date.now() - this.Time);
		this.Time = Date.now();
		this.updateVisavisCounter();

	  requestAnimationFrame(this.updateWorkingProcessBF);
}

/* Производит обновление телодвижений удаленных игроков.
 */
_VKSpaceChat.prototype.updateRemoteUsers = function ()
{
		for(var j=0; j<this.RemoteUsers.length; j++)
	  	{
			this.RemoteUsers[j].update();
		}
}

_VKSpaceChat.prototype.setRoomID = function(id)
{
	this.RoomID = id;
}

/*
	Получает список находящихся в комнате пользователей,
	и создает с ними соединения.
*/
_VKSpaceChat.prototype.getAndSetInitConnections = function (json_params)
{
	var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.COME_INTO_ROOM;
	$.ajax({
		type:"POST",
		url: req_str,
		async: true,
		data: {user_id: this.Peer.id},
		success: this.createUsersByExistingConnectionsBF,
		error: function (jqXHR, textStatus, errorThrown) {
			alert(textStatus + " " + errorThrown);
		}
	});
}

/* функция добавляет полученное соединение в массив соединений Connections
 * и сразу отправляет запрос на получение nickname нового игрока
 */
_VKSpaceChat.prototype.createUserByRecievedConnection = function (conn)
{
	var last_remote_user = new _RemoteUser({
					connection: conn,
					scene: this.Scene,
					all_users: this.AllUsers,
					net_messages_object: this.NetMessagesObject													
	}); 

	this.RemoteUsers.push(last_remote_user);
};


/* завершаем соединение с игроком
 */
_VKSpaceChat.prototype.disconnectRemoteUsers = function()
{
	while(this.AllUsers[1].length > 0)
	{
		this.AllUsers[1][this.AllUsers[1].length - 1].disconnect();
	}
};

_VKSpaceChat.prototype.startWorkingProcess = function ()
{
		requestAnimationFrame(this.updateWorkingProcessBF);	
}
