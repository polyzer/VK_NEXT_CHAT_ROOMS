
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
	this.onGameEndingBF = this.onGameEnding.bind(this);

	this.Renderer = null;
	this.CSSRenderer = null;
	this.Camera = null;
	this.updating = true;
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
		this.Renderer = new THREE.WebGLRenderer({antialias: true, shadows: true});
	}
	this.Renderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	
	if(this.CSSRenderer === null)
	{
		this.CSSRenderer = new THREE.CSS3DRenderer();	
	}

	this.Scene = new THREE.Scene();
	this.CSSScene = new THREE.Scene();
	this.BadScene = new THREE.Scene();
	this.Scenes = [this.Scene, this.CSSScene, this.BadScene];


	this.ambientlight = new THREE.AmbientLight( 0xffffff, 4 );

	this.BadScene.add(this.ambientlight);
	this.Scene.add(this.ambientlight);


	this.SkyBox = {};
	this.SkyBox.Geometry = new THREE.BoxGeometry(WORLD_CUBE.SIZE.x, WORLD_CUBE.SIZE.y, WORLD_CUBE.SIZE.z);
	this.SkyBox.Geometry.scale(WORLD_CUBE.SCALE.x, WORLD_CUBE.SCALE.y, WORLD_CUBE.SCALE.z);
	this.SkyBox.Material = new THREE.MeshStandardMaterial({
		map: new THREE.ImageUtils.loadTexture("models/skybox_cube_1.png"), 
		side: THREE.BackSide
	});
	this.SkyBox.Mesh = new THREE.Mesh(this.SkyBox.Geometry, this.SkyBox.Material);
	this.Scene.add(this.SkyBox.Mesh);

	this.BadSkyBox = {};
	this.BadSkyBox.Geometry = new THREE.BoxGeometry(WORLD_CUBE.SIZE.x, WORLD_CUBE.SIZE.y, WORLD_CUBE.SIZE.z);
	this.BadSkyBox.Geometry.scale(WORLD_CUBE.SCALE.x, WORLD_CUBE.SCALE.y, WORLD_CUBE.SCALE.z);
	this.BadSkyBox.Material = new THREE.MeshStandardMaterial({
		map: new THREE.ImageUtils.loadTexture("models/bad_sky_box.png"), 
		side: THREE.BackSide
	});	
	this.BadSkyBox.Mesh = new THREE.Mesh(this.BadSkyBox.Geometry, this.BadSkyBox.Material);
	this.BadScene.add(this.BadSkyBox.Mesh);

	this.FlyingObjects = new _FlyingObjects(this.Scene);
	
	this.Container.appendChild(this.Renderer.domElement);

	this.CSSRenderer.setSize(CAMERA_PARAMETERS.SCREEN_WIDTH, CAMERA_PARAMETERS.SCREEN_HEIGHT);
	this.CSSRenderer.domElement.style.position = "absolute";
	this.CSSRenderer.domElement.style.top = 0;
	this.Container.appendChild(this.CSSRenderer.domElement);

	this.Stand = new THREE.Mesh(new THREE.BoxGeometry(1000, 80, 1000), new THREE.MeshStandardMaterial({transparent: true, opacity: 0.8}));
	this.Scene.add(this.Stand);

	this.Clock = new THREE.Clock();
	
	this.Person = json_params.person;
	
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
	/**
	Счётчик наших визави. Занимается отображением
	*/
	this.VisavisCounter = {};
	this.VisavisCounter.Div = document.createElement("div");
	this.VisavisCounter.Div.appendChild(document.createTextNode("Визави: 0"));
	document.body.appendChild(this.VisavisCounter.Div);
	this.VisavisCounter.Div.id = "VisavisCounter";
	this.VisavisCounter.LastNum = 0;
	this.VisavisCounter.MeshesArray = [];

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
		person: this.Person,
		stream: GLOBAL_OBJECTS.getStream(),
		peer: this.Peer,
		cssscene: this.CSSScene,
		chat_controls_callback_bf: this.onFindNewRoomBF,
		visavis_counter: this.VisavisCounter
	});

	this.AllUsers.push(this.LocalUser);
	this.AllUsers.push(this.RemoteUsers);
	this.BadBlocks = new _BadBlocks(this.BadScene, this.AllUsers[0].getVisualKeeper().getVideoMesh(), this.onGameEndingBF);

	this.getAndSetInitConnections();

	this.startWorkingProcess();

}

_VKSpaceChat.prototype.onGameEnding = function ()
{
	cancelAnimationFrame(this.requestID);
	this.updating = false;
	GLOBAL_OBJECTS.getMenu().updating = true;
	$("#MenuContainer").css("zIndex", "1111111");
	$("#MainContainer").hide();
	$("#MenuContainer").show();

	GLOBAL_OBJECTS.getMenu().updateBF();
};

_VKSpaceChat.prototype.restart = function ()
{
	this.updating = true;
	this.AllUsers[0].addPoints(POINTS.NEXT_ROOM_COST);
	this.onFindNewRoom();
	this.startWorkingProcess();
};

_VKSpaceChat.prototype.onFindNewRoom = function ()
{

	if(Math.random() < 0.5)
	{
		if(this.Scene !== this.Scenes[0])
		{
			this.Scene = this.Scenes[0];
			this.Scene.add(this.ambientlight);
			this.AllUsers[0].getCollectingObjects().deleteObjects();
			this.AllUsers[0].getCollectingObjects().setScene(this.Scene);
			this.Scene.add(this.AllUsers[0].getVisualKeeper().getVideoMesh());
		}
		var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.FIND_ROOM_TO_ME;
		$.ajax({
			type:"POST",
			url: req_str,
			async: true,
			data: {user_id: this.Peer.id},
			success: this.resetWorldAndCreateUsersByExistingConnectionsBF,
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + " " + errorThrown);
			}
		});	
	} else
	{
		if(this.Scene !== this.Scenes[2])
		{
			this.Scene = this.Scenes[2];
			this.Scene.add(this.ambientlight);
			this.AllUsers[0].getCollectingObjects().deleteObjects();
			this.AllUsers[0].getCollectingObjects().setScene(this.Scene);
			this.Scene.add(this.AllUsers[0].getVisualKeeper().getVideoMesh());
		}

		var req_str = SERVER_REQUEST_ADDR  + "/" + REQUESTS.UTOS.ON_COME_TO_BAD_ROOM;
		$.ajax({
			type:"POST",
			url: req_str,
			async: true,
			data: {user_id: this.Peer.id},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + " " + errorThrown);
			}
		});	
		this.comeToBadRoom();
	}
}

_VKSpaceChat.prototype.comeToBadRoom = function ()
{
	this.Scene.add(this.AllUsers[0].getVisualKeeper().getVideoMesh());
	this.disconnectRemoteUsers();
	this.AllUsers[0].resetMeForNewRoom();
	this.BadBlocks.resetObjectsPositions();
};

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
 * Функция занимается вызовом всех удаленных пользователей, которых нам прислал сервер.
*/
_VKSpaceChat.prototype.makeCallsToAllRemoteUsers = function (stream)
{
	var ConCounter = 0;
	for(var i=0; i<this.AllUsers[1].length; i++)
	{
		if(this.AllUsers[1][i].MediaConnection === null)
		{
			this.AllUsers[1][i].MediaConnection = this.Peer.call(this.AllUsers[1][i].getPeerID(), stream);
			this.AllUsers[1][i].MediaConnection.on("stream", this.AllUsers[1][i].onStreamBF);
		}else
			ConCounter++;
	}

	if(this.AllUsers[1].length !== ConCounter)
	{
		setTimeout(this.makeCallsToAllRemoteUsersBF, 1000);
	}else
	{
//		alert("ALLRIGHT!");
	}
};

_VKSpaceChat.prototype.updateVisavisCounter = function ()
{

};

_VKSpaceChat.prototype.collisionStand = function ()
{
	this.Stand.geometry.computeBoundingSphere();
	this.AllUsers[0].getVideoMesh().geometry.computeBoundingBox();
	if(this.AllUsers[0].getVideoMesh().geometry.boundingBox.intersectsSphere(this.Stand.geometry.boundingSphere))
	{

	}
};

/* 
	Важнейшая функция игры, в которой происходит управление и обновление всех систем!!
*/
_VKSpaceChat.prototype.updateWorkingProcess = function ()
{
/*
	if(YouTubePlayer.getVolume() > 10)
	{
		YouTubePlayer.setVolume(YouTubePlayer.getVolume() - 1);
	}
*/
	this.Renderer.render(this.Scene, this.Camera);
	this.CSSRenderer.render(this.CSSScene, this.Camera);
	this.updateRemoteUsers();
	if(this.Scene === this.Scenes[0])
	{
		this.FlyingObjects.update();
	} else
	{
		this.BadBlocks.update(Date.now() - this.Time);
	}
	this.LocalUser.update(Date.now() - this.Time);
	this.Time = Date.now();
//	this.LocalUser.updateVisavisCounter();
	if(this.updating === true)
		this.requestID = requestAnimationFrame(this.updateWorkingProcessBF);
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
