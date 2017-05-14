var _StoreWindow = function ()
{
	/*Кнопка закрытия магазина*/
	this.CloseWindowButton = {};
	this.CloseWindowButton.HTMLObj = document.createElement("div");


	this.StoreWindowDiv = document.createElement("div");
	this.StoreWindowDiv.setAttribute("id", "StoreWindowDiv");

	/*Окно предпросмотра вида пользовательского куба*/
	this.UserObjectView = {};
	this.UserObjectView.Container = document.createElement("div");
	this.UserObjectView.Container.setAttribute("id", "UserObjectCustomizeContainer");
	this.UserObjectView.Renderer = new THREE.WebGLRenderer();
	this.UserObjectView.Camera = new THREE.PerspectiveCamera();
	this.UserObjectView.Scene = new THREE.Scene();
	this.UserObjectVide.UserMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.);

	/*Секция покупки возможности кастомизации*/
	this.CustomizeSection = {};
	this.CustomizeSection.BuyCustomButton = document.createElement("div");

	/*Ползунок выбора прозрачности*/
	this.CustomizeSection.SetOpacityRangeInput = document.createElement("input");
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("type", "range");
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("min", 0);
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("max", 1);	
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("value", 0.5);	

	/*Инпут выбора цвета*/
	this.CustomizeSection.SetFaceColorInput = document.createElement("input");
	this.CustomizeSection.SetFaceColorInput.setAttribute("type", "color");
	this.CustomizeSection.SetFaceColorInput.setAttribute("value", "#ff0000");	

	this.CustomizeSection.SaveOptionsButton = document.createElement("div");
	this.CustomizeSection.SaveOptionsButton.setAttribute("id", "SaveCustomizeOptionsButton");


};



/*Загружает сохраненные настройки вида с сервера*/ 
_StoreWindow.prototype.loadSavedCustomViewParameters = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "get_custom_view_params",
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
_StoreWindow.prototype.setLoadedCustomViewParameters = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}

	
};

/*Обработчик нажатия на кнопку сохранить*/
_StoreWindow.prototype.onSaveButtonPress = function ()
{

	var send_data = "datas=" + JSON.stringify({
		user_id: this.Person.getUserID(),
		opacity: this.CustomizeSection.SetOpacityRangeInput.value,
		color: this.CustomizeSection.SetFaceColorInput.value,
		date_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
		operation: "save_custom_view_params"
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

_StoreWindow.prototype.onOpacityRangeInputChange = function ()
{

};