/*
 * Класс описывает объект, на котором будет отображаться запись с web-камеры.
 * Летающая плоскость, на которой будет отображаться картинка с web-камеры;
 IN:
 json_params = {
	scene: new THREE.Scene(),
	user_type: {_Local,_Remote}User.UserType
 };
 * */

var _VisualKeeper = function (json_params)
{	
	this.UserType = null; // null, USER_TYPES.LOCAL, USER_TYPE.REMOTE
	this.Status = "live"; // ("live", "dead")
	this.Scene = null;
	this.Camera = null;	

	this.Video = document.createElement("video");
	this.Video.autoplay = 1;
	this.Video.width = CAMERA_VIDEO_SIZES.SMALL;
	this.Video.height = CAMERA_VIDEO_SIZES.SMALL;

	this.VideoMesh = {};
	this.VideoMesh.Geometry = new THREE.PlaneGeometry(CAMERA_VIDEO_SIZES.SMALL, CAMERA_VIDEO_SIZES.SMALL);
	this.VideoMesh.Material = null;
	this.VideoMesh.Mesh = null;

	this.VideoMeshCaseOpacity = null;

	if(json_params !== undefined)
	{
		
		if(json_params.position !== undefined)
		{
			this.VideoMesh.position.set(json_params.position);
		}

		if(json_params.scene !== undefined)
		{
			this.Scene = json_params.scene;
		}
		if(json_params.cssscene !== undefined)
		{
			this.CSSScene = json_params.cssscene;
		}
		if(json_params.camera !== undefined)
		{
			this.Camera = json_params.camera;
		}
		if(json_params.user_type !== undefined)
		{
			this.UserType = json_params.user_type;
		}
		if(json_params.texture !== undefined)
		{
			this.VideoMesh.Material = new THREE.MeshBasicMaterial( { map: json_params.texture, overdraw: true, side:THREE.DoubleSide, color: 0xff0000 } );
		}
		if(json_params.vkid !== undefined)
		{
			this.VKID = json_params.vkid;
		}

	}
	
	if(this.VideoMesh.Material === null)
	{
		this.VideoMesh.Material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});			
	}

	// Для локального игрока
	if(this.UserType === USER_TYPES.LOCAL)
	{
//		this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);		
//		this.Video.muted = 1;
		this.VideoMesh.Mesh = this.Camera;
	}else if(this.UserType === USER_TYPES.REMOTE)
	{
		this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);
		this.VideoMeshCaseOpacity = Math.random()*0.2+0.5;
		this.VideoMesh.Case = new THREE.Mesh(
			new THREE.BoxGeometry(150, 150, 150), 
			new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: this.VideoMeshCaseOpacity, transparent: true})
		);
		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
		this.Scene.add(this.VideoMesh.Case);
		this.Scene.add(this.VideoMesh.Mesh);	
	}

};

_VisualKeeper.prototype.setRandomPosition = function ()
{
	this.VideoMesh.Mesh.position.set(
		(Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.x, 
		(Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.y,
		(Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.z
	);				
	this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
};


// это функция, которая должна вызываться в главной игровой функции
_VisualKeeper.prototype.Life = function ()
{
};

/* Устанавливает позицию корабля
 */ 
_VisualKeeper.prototype.setCasePositionByMesh = function ()
{	
	this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
};
_VisualKeeper.prototype.setCaseRotationByMesh = function ()
{
	this.VideoMesh.Case.rotation.copy(this.VideoMesh.Mesh.rotation);
};

_VisualKeeper.prototype.setPosition = function (json_params)
{	
	this.VideoMesh.Mesh.position.copy(json_params);
	this.VideoMesh.Case.position.copy(json_params);
};
/* Устанавливает поворот корабля в пространстве
 */
_VisualKeeper.prototype.setRotation = function (json_params)
{
		
	this.VideoMesh.Mesh.rotation.copy(json_params);
	this.VideoMesh.Case.rotation.copy(json_params);
};


/* Возвращает позицию корабля 
 */
_VisualKeeper.prototype.getPosition = function ()
{
	return this.VideoMesh.Mesh.position.clone();
};
/* Возвращает поворот корабля
 */
_VisualKeeper.prototype.getRotation = function ()
{
	return this.VideoMesh.Mesh.rotation.clone();
};

_VisualKeeper.prototype.getVideoMesh = function ()
{
	return this.VideoMesh.Mesh;
};

_VisualKeeper.prototype.removeFromScene = function ()
{
	this.Scene.remove(this.VideoMesh.Mesh);
	this.Scene.remove(this.VideoMesh.Case);
};

_VisualKeeper.prototype.setVideoTextureByStream = function (stream)
{
		this.Video.srcObject = stream;
		this.Video.volume = 0;

		this.VideoTexture = new THREE.VideoTexture( this.Video);
		this.VideoTexture.minFilter = THREE.LinearFilter;
		this.VideoTexture.magFilter = THREE.LinearFilter;
		this.VideoTexture.format = THREE.RGBFormat;
		this.setTextureAndUpdateMesh(this.VideoTexture);
	
};
/*
 * Устанавливает текстуру и обновляет Mesh.
 */
_VisualKeeper.prototype.setTextureAndUpdateMesh = function (texture)
{
	this.Scene.remove(this.VideoMesh.Mesh);	
	var temp_mesh = this.VideoMesh.Mesh;
	
	this.VideoMesh.Material = new THREE.MeshBasicMaterial({
		map: texture, 
		overdraw: true,
		side: THREE.BackSide
	});
	
	this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);
	this.VideoMesh.Mesh.position.copy(temp_mesh.position);
	
	this.Scene.add(this.VideoMesh.Mesh);
};

_VisualKeeper.prototype.getMovementStatus = function ()
{
	return this.MovementStatus;
};
_VisualKeeper.prototype.position = function ()
{
	return this.MovementStatus;
};