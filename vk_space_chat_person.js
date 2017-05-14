/*
Класс описывает структуру, в которой будут храниться все необходимые данные
характеризующие текущую клиентскую сессию!
Здесь хранятся все данные получаемые с сервера:
параметры внешнего вида VisualKeeper'а клиента, которые сохраняются и меняются в Store.

 */


var _Person = function (json_params)
{

	this.onCheckSuccessBF = this.onCheckSuccess.bind(this);

	this.ID = null;
	this.Nickname = null;

	this.UserType = null;

	this.VKVars = null;

	/*Объект для Кейса локального пользователя, на который может ссылаться
		его VisualKeeper.VideoMesh.Case
	*/
	this.VideoMesh = {};
	this.VideoMesh.Case = new THREE.Mesh(
		new THREE.BoxGeometry(180, 180, 180), 
		new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: this.VideoMeshCaseOpacity, transparent: true})
	);
	this.VideoMesh.Case.add(new THREE.LineSegments( 
		new THREE.EdgesGeometry( this.VideoMesh.Case.geometry ), 
		new THREE.LineBasicMaterial( { color: 0xffffff*Math.random(), linewidth: 2 } )
	));

	/*Далее идут действия, которые выполняются только для локального пользователя*/

	if(this.UserType === USER_TYPES.LOCAL){
		this.generateID();
		this.generateNickname();
		//Прописываем персону как глобальный объект чтобы иметь доступ к ней из любой части программы!
		window.LocalPersonObj = this;
	}

	if(window.VK_WAS_INIT === true && this.UserType === USER_TYPES.LOCAL)
	{
		this.parseVKVars();
		this.checkPersonAtDB();
	}


};

_Person.prototype.getVideoMeshCaseParametersJSON = function ()
{
	return 
	{
		opacity: this.VideoMesh.Case.material.opacity, 
		face_color: this.VideoMesh.Case.material.color.getHex(), 
		edge_color: this.VideoMesh.Case.children[0].material.color.getHex()
	};
};

_Person.prototype.setVideoMeshCaseParametersJSON = function (json_params)
{
		this.VideoMesh.Case.material.opacity = json_params.opacity;
		this.VideoMesh.Case.material.color.setHex(json_params.face_color);
		this.VideoMesh.Case.children[0].material.color.setHex(json_params.edge_color);
};

/*Загружает сохраненные настройки вида с сервера*/ 
_Person.prototype.loadSavedCustomViewParameters = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "get_custom_mesh_view_params",
		user_id: this.Person.getUserID()
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.setLoadedCustomViewParametersBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	
};

/*Принимает и устанавливает полученные с сервера параметры к пользовательскому Mesh'у*/
_Person.prototype.setLoadedCustomViewParameters = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}

	/**/
	if(json_params["server_answer"] === "YES_DATA")
	{
		this.VideoMesh.Case.material.color.setHex(json_params["result_datas"]["color"]);
		this.VideoMesh.Case.material.opacity = parseFloat(json_params["result_datas"]["opacity"]);
	} else if(json_params["server_answer"] === "NO_DATA")
	{
		console.log("User hasn't custom view VisualKeeper parameters");
	} else
	{
		console.log("something is wrong :(");
	}
};




_Person.prototype.parseVKVars = function ()
{
	this.VKVars = {};
	this.VKVars.user_id = 0;
	var answr = location.search;
	answr = answr.split("&");
	for (var i = 0; i < answr.length; i++) {
		answr[i] = answr[i].split('=');//Создание двумерного массива
		this.VKVars[answr[i][0]] = answr[i][1];//Создание объекта, со свойствами двумерного массива.
	}
	if (this.VKVars.user_id == 0) {
		this.VKVars.user_id = this.VKVars.viewer_id;
	}

};

_Person.prototype.setNickname = function (nick)
{
	this.Nickname = nick;
};

_Person.prototype.generateID = function ()
{
	this.ID = generateRandomString(11);
};


_Person.prototype.generateNickname = function ()
{
	this.Nickname = generateRandomString(11);
};


_Person.prototype.getNickname = function ()
{
	return this.Nickname;
};


_Person.prototype.getID = function ()
{
	return this.ID;
};

_Person.prototype.getUserVKID = function ()
{
	return this.VKVars.user_id;
};

_Person.prototype.setUserVKID = function (json_params)
{
	this.VKVars.user_id = json_params.vk_id;
};

_Person.prototype.getAccessToken = function ()
{
	return this.VKVars.access_token;
};

_Person.prototype.checkPersonAtDB = function ()
{		

	var send_data = "datas=" + JSON.stringify({
		vk_id: this.getUserVKID(),
		date_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
		operation: "check_and_save_user"
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onCheckSuccessBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});
};
_Person.prototype.onCheckSuccess = function (json_params)
{
	console.log(json_params);
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
};