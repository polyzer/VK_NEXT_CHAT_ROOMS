/*
Класс содержит
MeshesBase: база всех мешей приложения;
Person: структура, которая описывает все данные, связанные с необходимыми данными в приложении
Должен существовать только один экземпляр данного объекта.
*/
var _GlobalObjects = function ()
{
	this.setMeshesBaseBF = this.setMeshesBase.bind(this);
	this.setStreamBF = this.setStream.bind(this);
	
	this.MeshesBase = null;
	this.Person = null;
	this.Menu = null;
	this.Game = null;
	this.Stream = null;
	this.Controls = null;
	this.DeviceType = null;
	
 	var testExp = new RegExp('Android|webOS|iPhone|iPad|' +
    		       'BlackBerry|Windows Phone|'  +
    		       'Opera Mini|IEMobile|Mobile' , 
    		      'i');
  
    if (testExp.test(navigator.userAgent)){
    	this.DeviceType = DEVICE_TYPES.MOBILE;
    }else{
    	this.DeviceType = DEVICE_TYPES.DESKTOP;
    }

	window.GLOBAL_OBJECTS = this;

	this.meshes_base_promise = new Promise(function (resolve) {
		resolve(new _MeshesBase());
	});
	this.meshes_base_promise.then(this.setMeshesBaseBF);


};

_GlobalObjects.prototype.makeRightStreamRequest = function()
{
	if(json_params instanceof Object)
		if(navigator.mediaDevices !== undefined)
		{
			navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then(this.setStreamBF)
			.catch(this.onStreamErrorBF);
		} else
		{
			navigator.getUserMedia(
				{video: true, audio: true}, 
				this.setStreamBF,
				this.onStreamErrorBF);
		}
	else
		throw new Error("json_params must be instance of Object");
}


_GlobalObjects.prototype.setStream = function (stream)
{
	this.Stream = stream;
}

_GlobalObjects.prototype.getStream = function ()
{
	return this.Stream;
}

_GlobalObjects.prototype.setGame = function(game)
{
	this.Game = game;
};
_GlobalObjects.prototype.getGame = function()
{
	return this.Game;
};

_GlobalObjects.prototype.createMeshesBase = function ()
{
	this.MeshesBase = new _MeshesBase();
};
_GlobalObjects.prototype.getMeshesBase = function ()
{
	return this.MeshesBase;
};
_GlobalObjects.prototype.setMeshesBase = function (meshes_base)
{
	this.MeshesBase = meshes_base;
};


_GlobalObjects.prototype.createMenu = function ()
{
	this.Menu = new _Menu();
};
_GlobalObjects.prototype.setMenu = function (menu)
{
	this.Menu = menu;
};
_GlobalObjects.prototype.getMenu = function ()
{
	return this.Menu;
};


_GlobalObjects.prototype.createPerson = function ()
{
	this.Person = new _Person({user_type: USER_TYPES.LOCAL});
};
_GlobalObjects.prototype.getPerson = function ()
{
	return this.Person;
};