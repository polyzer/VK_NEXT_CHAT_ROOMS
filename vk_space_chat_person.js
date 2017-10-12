/*
Класс описывает структуру, в которой будут храниться все необходимые данные
характеризующие текущую клиентскую сессию!
Здесь хранятся все данные получаемые с сервера:
параметры внешнего вида VisualKeeper'а клиента, которые сохраняются и меняются в Store.
ID - Внутрипрограммный идентификатор пользователя, пока что не используется;
Nickname - Никнейм пользователя. Пока что не используется;
UserType - описывает тип пользователя. Удаленный/локальный.
*/


var _Person = function (json_params)
{

	this.onCheckSuccessBF = this.onCheckSuccess.bind(this);
	this.setLoadedCustomViewParametersBF = this.setLoadedCustomViewParameters.bind(this);
	this.onSaveOpenMeshesToDBSuccessBF = this.onSaveOpenMeshesToDBSuccess.bind(this);

	/*ИДшник для использования в приложении*/
	this.ID = null;
	/*Если нужно использовать Никнеймы*/
	this.Nickname = null;
	/*Тип пользователя*/
	this.UserType = null;
	/*
	Хранит данные Вконтакта для текущей сессии пользователя.
	Данные типа vk_id и т.д.
	*/
	this.VKVars = {};
	/*	Меши открытые пользователем для использования.*/
	this.OpenMeshes = [];
	/*
	Объект для Кейса локального пользователя, на который ДОЛЖЕН ссылаться
	его VisualKeeper.VideoMesh.Case
	*/
	this.MeshesBase = GLOBAL_OBJECTS.getMeshesBase();
	this.VideoMesh = {};
	this.VideoMesh.Case = null; /*Любой Меш. Может быть равен this.VideoMesh.CubeMeshCase*/
	this.VideoMesh.CaseMeshIndex = CASE_MESHES_INDEXES.CUBE;
	/*Далее идут действия, которые выполняются только для локального пользователя*/
	if(json_params instanceof Object)
	{
		this.UserType = json_params.user_type;
	} else 
	{
		throw new Error("We have a BIG PROBLEM!");
	}

	if(this.UserType === USER_TYPES.LOCAL){
		this.generateID();
		this.generateNickname();
		if(window.VK_WAS_INIT === true)
		{
			this.parseVKVars();
			this.checkPersonAtDB();
			if(!this.isMeshIndexInOpenMeshes())
			{
				this.addMeshIndexToOpenMeshesAndSaveToDB(CASE_MESHES_INDEXES.CUBE);
			}
			this.loadSavedCustomViewParameters();
			this.setVideoMeshCaseByMeshIndex();
		}

	}

};

_Person.prototype.getOpenMeshesSaveString = function ()
{
	var topen_meshes = "";
	for(var i=0; i< this.OpenMeshes.length; i++)
	{
		topen_meshes += this.OpenMeshes[i];
		if(i !== (this.OpenMeshes.length - 1))
		{
			topen_meshes += ",";
		}
	}
	return topen_meshes;
};

/*
	Проверяет наличие Меша в открытых, т.е. куплен ли Меш, или нет.
*/
_Person.prototype.isMeshIndexInOpenMeshes = function (index)
{
	for(var i=0; i< this.OpenMeshes.length; i++)
	{
		if(this.OpenMeshes[i] === index)
		{
			return true;
		}
	}
	return false;
};
/**
	Добавляет индекс Меша в открытые меши.
	После чего должен сохранять его в DB.
*/
_Person.prototype.addMeshIndexToOpenMeshesAndSaveToDB = function (mesh_index)
{
	for(var i=0; i< this.OpenMeshes.length; i++)
	{
		if(this.OpenMeshes[i] === mesh_index)
		{
			console.log("That Mesh was buying!");
			return;
		}
	}
	
	this.OpenMeshes.push(mesh_index);
	this.saveOpenMeshesToDB();
};

/*устанавливает параметры передаваемые сообщением REQUESTS.UTOU.GetYourFullDataMessage | REQUESTS.UTOU.SendMyFullDataMessage*/
_Person.prototype.setRemotePersonParameters = function(json_params)
{
	this.setUserVKID(this.json_params.vk_id);
	this.setCubeVideoMeshCaseParametersJSON(json_params);
	this.setCaseMeshIndex(json_params.mesh_case_index);
	this.setVideoMeshCaseByMeshIndex();
};

/*Устанавливает текущий Mesh по индексу.*/
_Person.prototype.setVideoMeshCaseByMeshIndex = function (index)
{
	if(typeof(index) !== "undefined" && typeof(index) !== "null")
	{
		this.VideoMesh.Case = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByIndex(index);
	}else
	{
		this.VideoMesh.Case = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByIndex(this.VideoMesh.CaseMeshIndex);
	}
};
/*Структура возвращает данные от структуры КУБА.*/
_Person.prototype.getCubeVideoMeshCaseParametersJSON = function ()
{
	if(this.VideoMesh.CaseMeshIndex === CASE_MESHES_INDEXES.CUBE){
		return {
			opacity: this.VideoMesh.Case.material.opacity, 
			face_color: this.VideoMesh.Case.material.color.getStyle(), 
			edge_color: this.VideoMesh.Case.children[0].material.color.getStyle()
		};
	}
	else{
		return {
			opacity: this.VideoMesh.Case.material.opacity, 
			face_color: "#000000", 
			edge_color: "#000000"			
		};
	}
};
/*Функция вроде как устанавливает необходимые параметры и материалы структуры КУБА*/
_Person.prototype.setCubeVideoMeshCaseParametersByJSON = function (json_params)
{
	if(this.VideoMesh.CaseMeshIndex === CASE_MESHES_INDEXES.CUBE)
	{
		this.VideoMesh.Case.material.opacity = json_params.opacity;
		this.VideoMesh.Case.material.color.setStyle(json_params.face_color);
		this.VideoMesh.Case.children[0].material.color.setStyle(json_params.edge_color);
	} else {
		this.VideoMesh.Case.material.opacity = json_params.opacity;		
	}
};
/*
IN: 
json_params: {
	open_meshes: []
}
*/
_Person.prototype.saveOpenMeshesToDB = function ()
{
	var topen_meshes = "";
	for(var i=0; i< this.OpenMeshes.length; i++)
	{
		topen_meshes += this.OpenMeshes[i];
		if(i !== (this.OpenMeshes.length - 1))
		{
			topen_meshes += ",";
		}
	}
	var send_data = "datas=" + JSON.stringify({
		operation: "save_open_meshes",
		vk_id: this.getUserVKID(),
		open_meshes: topen_meshes
	});

	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onSaveOpenMeshesToDBSuccessBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	
};
_Person.prototype.setCaseMeshIndex = function (index)
{
	if(index)
		this.VideoMesh.CaseMeshIndex = index;
	else{
		this.VideoMesh.CaseMeshIndex = CASE_MESHES_INDEXES.CUBE;
		throw new Error("No case mesh index!");
	}

};

/*Ёбаный обработчик успешного сохранения*/
_Person.prototype.onSaveOpenMeshesToDBSuccess = function (json_params)
{
	console.log(json_params);
};

_Person.prototype.saveCustomMeshViewParameters = function (json_params)
{
	
};

/*Загружает сохраненные настройки вида с сервера*/ 
_Person.prototype.loadSavedCustomViewParameters = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "get_custom_mesh_view_params",
		vk_id: this.getUserVKID()
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



/*Принимает и устанавливает полученные с сервера параметры к пользовательскому Мешу*/
_Person.prototype.setLoadedCustomViewParameters = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	/*Если сервер сказал, что данные доступны!*/
	if(json_params["server_answer"] === "YES_DATA")
	{
		this.setCaseMeshIndex(json_params["result_datas"]["case_mesh_index"]);
		this.OpenMeshes = json_params["result_datas"]["open_meshes"].split(",");

	} else if(json_params["server_answer"] === "NO_DATA")
	{
		console.log("User hasn't custom view VisualKeeper parameters");
	} else
	{
		console.log("something is wrong :(");
	}
};

/*Функция занимается разбором url-строки, из которой получает все необходимые данные пользователя*/
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

_Person.prototype.getCaseMeshIndex = function ()
{
	return this.VideoMesh.CaseMeshIndex;
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
/*Формирует необходимый объект для */
_Person.prototype.getAllVideoMeshCaseParametersForNetMessageJSON = function ()
{
	var params = this.getCubeVideoMeshCaseParametersJSON();
	params.case_mesh_index = this.getCaseMeshIndex();
	return params;
};

/*
	Структура удалённой персоны.
	Используется удалённым пользователем для хранения определённых данных.
*/
var _RemotePerson = function (json_params)
{
	this.MeshesBase = GLOBAL_OBJECTS.getMeshesBase();
	this.VideoMesh = {
		Case: null,
		CaseMeshIndex: CASE_MESHES_INDEXES.CUBE,
		TargetMesh: null
	};
}
/*Функция вроде как устанавливает необходимые параметры и материалы структуры КУБА*/
_RemotePerson.prototype.setVideoMeshCaseParametersByJSON = function (json_params)
{
	this.VideoMesh.CaseMeshIndex = json_params.data.case_mesh_index;
	
	this.VideoMesh.Case = this.MeshesBase.getMeshCopyByIndex(this.VideoMesh.CaseMeshIndex);

	this.VideoMesh.TargetMesh = this.MeshesBase.getTargetMeshCopyByIndex(this.VideoMesh.CaseMeshIndex);

	if(this.VideoMesh.CaseMeshIndex === CASE_MESHES_INDEXES.CUBE)
	{
		this.VideoMesh.Case.material.opacity = json_params.data.opacity;
		this.VideoMesh.Case.material.color.setStyle(json_params.data.face_color);
		this.VideoMesh.Case.children[0].material.color.setStyle(json_params.data.edge_color);

		this.VideoMesh.TargetMesh.material.opacity = json_params.data.opacity;
		this.VideoMesh.TargetMesh.material.color.setStyle(json_params.data.face_color);
		this.VideoMesh.TargetMesh.children[0].material.color.setStyle(json_params.data.edge_color);
	}
};

_RemotePerson.prototype.getVideoMeshCase = function ()
{
	return this.VideoMesh.Case;
};
_RemotePerson.prototype.getTargetMesh = function ()
{
	return this.VideoMesh.TargetMesh;
};
_RemotePerson.prototype.getVideoMeshCaseMeshIndex = function ()
{
	return this.VideoMesh.CaseMeshIndex;
};