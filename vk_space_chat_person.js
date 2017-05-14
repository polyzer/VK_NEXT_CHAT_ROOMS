/*Класс описывает структуру, в которой будут храниться все необходимые данные
 *характеризующие текущую клиентскую сессию!
 */


var _Person = function (json_params)
{
	this.onCheckSuccessBF = this.onCheckSuccess.bind(this);

	this.ID = null;
	this.Nickname = null;
	this.VKVars = null;

	this.generateID();
	this.generateNickname();
	
	if(window.VK_WAS_INIT === true)
	{
		this.parseVKVars();
		this.checkPersonAtDB();
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