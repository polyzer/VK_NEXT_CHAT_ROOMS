/*
Класс описывает комнату, в которой будет находиться что-то.
В каждой комнате должно быть:
1) Сцена - this.Scene; Может быть импортирована из файла
2) Ограничивающая область - this.SkyBox;
3) Освещение - this.Lightning;
4) Функция, которая должна быть обработана в комнате, каждый момент времени - this.update();
5) 
*/
var _Room = function ()
{
	this.Scene = new THREE.Scene();

	this.SkyBox = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());

	this.UpdatableObjects = [];
};
/*
Основная функция, обрабатывающая все процессы, происходящие в комнате
*/
_Room.prototype.update = function ()
{

};

_Room.prototype.loadSceneFromFile = function ()
{

};

_Room.prototype.addUserToScene = function (user)
{
	this.Scene.add(user);
};