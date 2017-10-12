/*
 * Класс описывает объект, на котором будет отображаться запись с web-камеры.
 * Летающая плоскость, на которой будет отображаться картинка с web-камеры;
 IN:
 json_params = {
	scene: new THREE.Scene(),
	user_type: {_Local,_Remote}User.UserType,
	camera: new THREE.PerspectiveCamera(params),
	mesh_case_index: some
 };
 * */

var _LocalVisualKeeper = function (json_params)
{	
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

	if(json_params instanceof Object)
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
			this.VideoMesh.Material = new THREE.MeshBasicMaterial( { map: json_params.texture, overdraw: true, side:THREE.DoubleSide, color: 0xffffff } );
		}

	}
	
	if(this.VideoMesh.Material === null)
	{
		this.VideoMesh.Material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});			
	}

//		this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);		
//		this.Video.muted = 1;
	this.TargetMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide, }));
	this.TargetMesh.add(new THREE.LineSegments( 
		new THREE.EdgesGeometry( this.TargetMesh.geometry ), 
		new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } )
	));
		
	this.TargetMesh.position.set(-25, -15, -50);

	this.Scene.remove(this.Camera);
	this.VideoMesh.Mesh = this.Camera;
	this.VideoMesh.Mesh.add(this.TargetMesh);
	this.Scene.add(this.VideoMesh.Mesh);
		
	this.VideoMesh.Mesh.position.x = (Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.x;
	this.VideoMesh.Mesh.position.y = (Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.y;
	this.VideoMesh.Mesh.position.z = (Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.z;

};

_LocalVisualKeeper.prototype.setVisualMeshCase = function (mesh)
{
	this.VideoMesh.Case = mesh;
};

_LocalVisualKeeper.prototype.setTargetMesh = function (mesh)
{
	this.TargetMesh = mesh;
};

/*Настройка внешнего вида Кейса*/
_LocalVisualKeeper.prototype.setVideoMeshCaseByParameters = function (json_params)
{
	if(json_params instanceof Object)
	{
		if(json_params.case_mesh_index)
		{
			this.VideoMesh.Case = GLOBAL_OBJECTS.getMeshesBase().getMeshCopyByIndex(json_params.case_mesh_index);
			this.setTargetMeshByCaseMeshIndex(json_params);
		}
	}
};
/*
Устанавливает ТаргетМеш по индексу
IN: json_params: {case_mesh_index}
*/
_LocalVisualKeeper.prototype.setTargetMeshByCaseMeshIndex = function (json_params)
{
	if(json_params instanceof Object)
	{
		this.TargetMesh = GLOBAL_OBJECTS.getMeshesBase().getTargetMeshCopyByIndex(json_params.case_mesh_index);
	}
};

_LocalVisualKeeper.prototype.setTargetMesh = function (mesh)
{
	if(mesh instanceof Object)
	{
		this.TargetMesh = mesh;
	}
};

_LocalVisualKeeper.prototype.getTargetMesh = function ()
{
	return this.TargetMesh;
};

/*функция только для ЛОКАЛЬНОГО ПОЛЬЗОВАТЕЛЯ*/
_LocalVisualKeeper.prototype.setTargetMeshByColor = function (new_color)
{
	this.TargetMesh.material.color.set(new_color);
}

_LocalVisualKeeper.prototype.setRandomPosition = function ()
{
	this.VideoMesh.Mesh.position.set(
		(Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.x, 
		(Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.y,
		(Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.z
	);

	if(this.UserType === USER_TYPES.REMOTE)
		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
};


// это функция, которая должна вызываться в главной игровой функции
_LocalVisualKeeper.prototype.update = function ()
{
	this.TargetMesh.rotation.y += 0.002;
};

/* Устанавливает позицию корабля
 */ 
_LocalVisualKeeper.prototype.setCasePositionByMesh = function ()
{	
	this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
};
_LocalVisualKeeper.prototype.setCaseRotationByMesh = function ()
{
	this.VideoMesh.Case.rotation.copy(this.VideoMesh.Mesh.rotation);
};

_LocalVisualKeeper.prototype.setPosition = function (json_params)
{	
	this.VideoMesh.Mesh.position.copy(json_params);
	this.VideoMesh.Case.position.copy(json_params);
};
/* Устанавливает поворот корабля в пространстве
 */
_LocalVisualKeeper.prototype.setRotation = function (json_params)
{
		
	this.VideoMesh.Mesh.rotation.copy(json_params);
	this.VideoMesh.Case.rotation.copy(json_params);
};


/* Возвращает позицию корабля 
 */
_LocalVisualKeeper.prototype.getPosition = function ()
{
	return this.VideoMesh.Mesh.position.clone();
};
/* Возвращает поворот корабля
 */
_LocalVisualKeeper.prototype.getRotation = function ()
{
	return this.VideoMesh.Mesh.rotation.clone();
};

_LocalVisualKeeper.prototype.getVideoMesh = function ()
{
	return this.VideoMesh.Mesh;
};

_LocalVisualKeeper.prototype.removeFromScene = function ()
{
	this.Scene.remove(this.VideoMesh.Mesh);
	this.Scene.remove(this.VideoMesh.Case);
};

_LocalVisualKeeper.prototype.removeCaseMeshFromScene = function (mesh)
{
	if(mesh){
		this.Scene.remove(mesh);		
	}
	else{
		this.Scene.remove(this.VideoMesh.Case);
	}
};
_LocalVisualKeeper.prototype.addCaseMeshToScene = function (mesh)
{
	if(mesh)
		this.Scene.add(mesh);
	else
		this.Scene.add(this.VideoMesh.Case);
};



_LocalVisualKeeper.prototype.setVideoTextureByStream = function (stream)
{
	if(window.isUsingPlugin === true)
	{
		this.Video.style.position = "absolute";
		this.Video.style.zIndex = -1000;
		document.body.appendChild(this.Video);
		this.Video = attachMediaStream(this.Video, stream);
		this.Video.style.position = "absolute";
		this.Video.style.zIndex = -1000;
		this.Video.autoplay = 1;
		this.Video.width = CAMERA_VIDEO_SIZES.SMALL;
		this.Video.height = CAMERA_VIDEO_SIZES.SMALL;
	} else
	{
		this.Video.srcObject = stream;		
	}
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
_LocalVisualKeeper.prototype.setTextureAndUpdateMesh = function (texture)
{
	this.Scene.remove(this.VideoMesh.Mesh);	
	var temp_mesh = this.VideoMesh.Mesh;
	
	this.VideoMesh.Material = new THREE.MeshBasicMaterial({
		map: texture, 
		overdraw: true,
		side: THREE.BackSide,
		color: 0xffffff
	});
	
	this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);
	var tempmesh_1 = new THREE.Mesh(this.VideoMesh.Geometry, new THREE.MeshBasicMaterial({
		overdraw: true,
		side: THREE.FrontSide,
		color: 0xffffff
	}));
	tempmesh_1.position.z  = -3;
	this.VideoMesh.Mesh.add(tempmesh_1);

	this.VideoMesh.Mesh.position.copy(temp_mesh.position);
	
	this.Scene.add(this.VideoMesh.Mesh);
};

_LocalVisualKeeper.prototype.getMovementStatus = function ()
{
	return this.MovementStatus;
};
_LocalVisualKeeper.prototype.position = function ()
{
	return this.MovementStatus;
};


/*ВизуалКипер для удалённого пользователя.*/
var _RemoteVisualKeeper = function (json_params)
{
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

	if(json_params)
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
		if(json_params.texture !== undefined)
		{
			this.VideoMesh.Material = new THREE.MeshBasicMaterial( { map: json_params.texture, overdraw: true, side:THREE.DoubleSide, color: 0xffffff } );
		}

	}
	
	if(this.VideoMesh.Material === null)
	{
		this.VideoMesh.Material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});			
	}

		this.VideoMesh.Mesh = new THREE.Mesh(this.VideoMesh.Geometry, this.VideoMesh.Material);
		this.VideoMeshCaseOpacity = Math.random()*0.2+0.5;
		this.VideoMesh.Case = new THREE.Mesh(
			new THREE.BoxGeometry(180, 180, 180), 
			new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: this.VideoMeshCaseOpacity, transparent: true})
		);
		this.VideoMesh.Case.add(new THREE.LineSegments( 
			new THREE.EdgesGeometry( this.VideoMesh.Case.geometry ), 
			new THREE.LineBasicMaterial( { color: 0xffffff*Math.random(), linewidth: 2 } )
		));

		this.TargetMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide, }));
		this.TargetMesh.add(new THREE.LineSegments( 
			new THREE.EdgesGeometry( this.TargetMesh.geometry ), 
			new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } )
		));

		this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
		this.Scene.add(this.VideoMesh.Case);
		this.Scene.add(this.VideoMesh.Mesh);	

};
/*Наследуем прототип от _LocalVisualKeeper*/
_RemoteVisualKeeper.prototype = Object.create(_LocalVisualKeeper.prototype);

_RemoteVisualKeeper.prototype.setRandomPosition = function ()
{
	this.VideoMesh.Mesh.position.set(
		(Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.x, 
		(Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.y,
		(Math.random()*0.4 - 0.2) * WORLD_CUBE.SCALED_SIZE.z
	);
	this.VideoMesh.Case.position.copy(this.VideoMesh.Mesh.position);
};
_RemoteVisualKeeper.prototype.update = function ()
{
	this.TargetMesh.rotation.copy(this.VideoMesh.Case.rotation);
};
