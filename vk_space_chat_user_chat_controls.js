/*
Представляет собой класс контроллеров, добавляемых на экран.
В данном случае представляет собой 3 кнопки.
Кнопка - показывающая и скрывающая ID удаленного собеседника.
Кнопка - показывающая и скрывающия видео собеседника.
Кнопка - заставляющая производить поиск нового собеседника.
*/
/*
IN:
json_params = {
	scene: new THREE.Scene(),
	on_vkid_button_click: handler_function,
	on_video_button_click: handler_function,
	on_next_button_click: handler_function
}
*/
var _ChatControls = function (json_params)
{
	this.onVKIDButtonClickBF = this.onVKIDButtonClick.bind(this);
	this.onVideoButtonClickBF = this.onVideoButtonClick.bind(this);
	this.onFindNextButtonClickBF = this.onFindNextButtonClick.bind(this);

	this.Controls = {};
	this.Controls.VKIDButton = {};
	this.Controls.VideoButton = {};
	this.Controls.FindNextButton = {};

	this.Mode = CONTROL_BUTTONS_MODE.CSS3D;
	this.Scene = json_params.scene;
	this.CSSScene = json_params.cssscene;

	this.UsersOnClicks = {
		onFindNextButtonClick: json_params.on_find_next_button_click
	};

	switch(this.Mode)
	{
		case CONTROL_BUTTONS_MODE.CSS3D:
			this.initButtons3DCSS();
		break;
	}

	this.setOnClicks();

};

_ChatControls.prototype.setOnClicks = function (json_params)
{
	switch(this.Mode)
	{
		case CONTROL_BUTTONS_MODE.CSS3D:
			this.Controls.FindNextButton.ObjHTML.onclick = this.onFindNextButtonClickBF;
		break;
	}
};

_ChatControls.prototype.onVKIDButtonClick = function ()
{
	this.UsersOnClicks.onVKIDButtonClick();
};
_ChatControls.prototype.onVideoButtonClick = function ()
{
	this.UsersOnClicks.onVideoButtonClick();	
};
_ChatControls.prototype.onFindNextButtonClick = function ()
{
	this.UsersOnClicks.onFindNextButtonClick();	
};

_ChatControls.prototype.initButtons3DCSS = function ()
{

	this.Controls.FindNextButton.ObjHTML = document.createElement("div");
	this.Controls.FindNextButton.ObjHTML.setAttribute("id", "FindNextButton");
	this.Controls.FindNextButton.TextContent = document.createTextNode("Next Room");
	this.Controls.FindNextButton.ObjHTML.appendChild(this.Controls.FindNextButton.TextContent);
	document.body.appendChild(this.Controls.FindNextButton.ObjHTML);
	this.hideFindNextRoomButton();

//	this.CSSScene.add(
//		this.Controls.FindNextButton.Obj3DCSS
//	);

};

_ChatControls.prototype.showFindNextRoomButton = function ()
{
	$("#FindNextButton").show();
};
_ChatControls.prototype.hideFindNextRoomButton = function ()
{
	$("#FindNextButton").hide();
};

_ChatControls.prototype.getNextRoomButtonMesh = function ()
{
	return this.Controls.FindNextButton.Obj3DCSS;
};

