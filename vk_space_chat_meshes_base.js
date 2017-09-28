/*
Модуль содержит все загружаемые и создаваемые Меши.
Все используемые в игре меши должны копироваться из этого модуля!
*/
var _MeshesBase = function ()
{
	this.onSceneLoadedBF = this.onSceneLoaded.bind(this);
	this.onLoadMeshesPricesFromDBBF = this.onLoadMeshesPricesFromDB.bind(this);
	/*Загрузчик текстур*/
	this.ColladaLoader = new THREE.ColladaLoader();

	this.radius = 180;
	this.PlanetsTargetMeshRadius = 40;
	/*Индексы, ныжные для того, чтобы доставать Индексы Мешей по запросу*/
	this.Indexes = {
		First: null,
		Last: null,
		Prev: null,
		Next: null
	}

	this.CubeMesh = new THREE.Mesh(
		new THREE.BoxGeometry(180, 180, 180), 
		new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: 0.9, transparent: true, side: THREE.DoubleSide})
	);
	this.CubeMesh.add(new THREE.LineSegments( 
		new THREE.EdgesGeometry( this.CubeMesh.geometry ), 
		new THREE.LineBasicMaterial( { color: 0xffffff*Math.random(), linewidth: 2 } )
	));
	this.MercuryMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_mercury.png")})
	);
	this.TargetMercuryMesh = this.MercuryMesh.clone();
	this.TargetMercuryMesh.scale.set(0.2, 0.2, 0.2);

	this.VenusMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_venus.png")})
	);
	this.TargetVenusMesh = this.VenusMesh.clone();
	this.TargetVenusMesh.scale.set(0.2, 0.2, 0.2);

	this.EarthMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_earth.png")})
	);
	this.TargetEarthMesh = this.EarthMesh.clone();
	this.TargetEarthMesh.scale.set(0.2, 0.2, 0.2);

	this.MarsMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_mars.png")})
	);
	this.TargetMarsMesh = this.MarsMesh.clone();
	this.TargetMarsMesh.scale.set(0.2, 0.2, 0.2);

	this.JupiterMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_jupiter.png")})
	);
	this.TargetJupiterMesh = this.JupiterMesh.clone();
	this.TargetJupiterMesh.scale.set(0.2, 0.2, 0.2);

	this.SaturnMesh = new THREE.Mesh(
		new  THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_saturn.png")})
	);
	this.TargetSaturnMesh = this.SaturnMesh.clone();
	this.TargetSaturnMesh.scale.set(0.2, 0.2, 0.2);

	this.UranusMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_uranus.png")})
	);
	this.TargetUranusMesh = this.UranusMesh.clone();
	this.TargetUranusMesh.scale.set(0.2, 0.2, 0.2);

	this.NeptuneMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_neptune.png")})
	);
	this.TargetNeptuneMesh = this.NeptuneMesh.clone();
	this.TargetNeptuneMesh.scale.set(0.2, 0.2, 0.2);

	this.SunMesh = new THREE.Mesh(
		new THREE.SphereGeometry(this.radius, 40, 40),
		new THREE.MeshStandardMaterial({map: new THREE.ImageUtils.loadTexture("./models/textures/tex_sun.gif")})
	);
	this.TargetSunMesh = this.SunMesh.clone();
	this.TargetSunMesh.scale.set(0.2, 0.2, 0.2);

	var prom = this.load3DSceneByCollada(this.ColladaLoader, "./models/tardis_centered.dae");
	prom.then(this.onSceneLoadedBF);
};
/*
После загрузки сцены мы создаем все необходимые для работы объекты.
*/
_MeshesBase.prototype.onSceneLoaded = function (scene)
{

	this.CaseMeshesWithDescriptions = {
		Cube: { 
			Mesh: this.CubeMesh, 
			TargetMesh: this.TargetCubeMesh,
			Description: "THERE IS DESCRIPTION",
			Index: CASE_MESHES_INDEXES.CUBE,
			Price: 0,
			Customizable: true
		},
		PlanetMercury: { 
			Mesh: this.MercuryMesh,//scene.getObjectByName(CASE_MESHES_INDEXES.PLANET_MERCURY) 
			TargetMesh: this.TargetMercuryMesh,
			Description: "PLANET_MERCURY",
			Index: CASE_MESHES_INDEXES.PLANET_MERCURY,
			Price: 0,
			Customizable: false

		},
		PlanetVenus: { 
			Mesh: this.VenusMesh,//scene.getObjectByName(CASE_MESHES_INDEXES.PLANET_VENUS) 
			TargetMesh: this.TargetVenusMesh,
			Description: "PLANET_VENUS",
			Index: CASE_MESHES_INDEXES.PLANET_VENUS,
			Price: 0,
			Customizable: false

		},
		PlanetEarth: { 
			Mesh: this.EarthMesh,// scene.getObjectByName(CASE_MESHES_INDEXES.PLANET_EARTH)
			TargetMesh: this.TargetEarthMesh,
			Description: "PLANET_EARTH",
			Index: CASE_MESHES_INDEXES.PLANET_EARTH,
			Price: 0,
			Customizable: false

		},
		PlanetMars: { 
			Mesh: this.MarsMesh, //scene.getObjectByName(CASE_MESHES_INDEXES.CUBE)
			TargetMesh: this.TargetMarsMesh,
			Description: "PLANET_MARS",
			Index: CASE_MESHES_INDEXES.PLANET_MARS,
			Price: 0,
			Customizable: false
		},
		PlanetJupiter: { 
			Mesh: this.JupiterMesh, //scene.getObjectByName(CASE_MESHES_INDEXES.CUBE)
			TargetMesh: this.TargetJupiterMesh,
			Description: "PLANET_JUPITER",
			Index: CASE_MESHES_INDEXES.PLANET_JUPITER,
			Price: 0,
			Customizable: false
		},
		PlanetSaturn: { 
			Mesh: this.SaturnMesh, //scene.getObjectByName(CASE_MESHES_INDEXES.CUBE)
			TargetMesh: this.TargetSaturnMesh,
			Description: "PLANET_SATURN",
			Index: CASE_MESHES_INDEXES.PLANET_SATURN,
			Price: 0,
			Customizable: false
		},
		PlanetUranus: { 
			Mesh: this.UranusMesh, 
			TargetMesh: this.TargetUranusMesh,
			Description: "PLANET_URANUS",
			Index: CASE_MESHES_INDEXES.PLANET_URANUS,
			Price: 0,
			Customizable: false
		},
		PlanetNeptune: { 
			Mesh: this.NeptuneMesh,
			TargetMesh: this.TargetNeptuneMesh,
			Description: "PLANET_NEPTUNE",
			Index: CASE_MESHES_INDEXES.PLANET_NEPTUNE,
			Price: 0,
			Customizable: false
		},
		Sun: { 
			Mesh: this.SunMesh, 
			TargetMesh: this.TargetSunMesh,
			Description: "SUN",
			Index: CASE_MESHES_INDEXES.SUN,
			Price: 0,
			Customizable: false
		},
		Tardis: { 
			Mesh: scene.getObjectByName(CASE_MESHES_INDEXES.TARDIS), 
			TargetMesh: scene.getObjectByName(CASE_MESHES_INDEXES.TARDIS),
			Description: "TARDIS",
			Index: CASE_MESHES_INDEXES.TARDIS,
			Price: 0,
			Customizable: false
		},
	};
	
	this.CaseMeshesWithDescriptions.Tardis.Mesh.scale.set(30,30,30);
	this.CaseMeshesWithDescriptions.Tardis.Mesh.rotation.z = 90;
	/*
		В конце, после загрузки всех текс мы создаем персону и Меню;
	*/
	this.loadMeshesPricesFromDB();
	window.GLOBAL_OBJECTS.createPerson();
	window.GLOBAL_OBJECTS.createMenu();
};

_MeshesBase.prototype.getMeshDataByMeshIndex = function (index)
{
	var keys = Object.keys(this.CaseMeshesWithDescriptions);
	for(var i=0; i< keys.length; i++)
	{
		if(this.CaseMeshesWithDescriptions[keys[i]]["Index"] === index)
		{
			return {
				price: this.CaseMeshesWithDescriptions[keys[i]]["Price"],
				mesh: this.CaseMeshesWithDescriptions[keys[i]]["Mesh"].clone(),
				description: this.CaseMeshesWithDescriptions[keys[i]]["Description"],
				customizable: this.CaseMeshesWithDescriptions[keys[i]]["Customizable"]
			};
		}
	}

	throw new Error("Have no Mesh with this Index");	

};

_MeshesBase.prototype.loadMeshesPricesFromDB = function ()
{
	var send_data = "datas="+JSON.stringify({
		operation: "get_meshes_prices"
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onLoadMeshesPricesFromDBBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}
	});	
};
_MeshesBase.prototype.onLoadMeshesPricesFromDB = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}	

	this.keys = Object.keys(this.CaseMeshesWithDescriptions);
	
	for(var i=0; i< this.keys.length; i++)
	{
		for(var j=0; j < json_params["result_datas"].length; j++)
		{
			if(this.CaseMeshesWithDescriptions[this.keys[i]]["Index"] === json_params["result_datas"][j]["game_case_mesh_index"])
			{
				this.CaseMeshesWithDescriptions[this.keys[i]]["Price"] = parseInt(json_params["result_datas"][j]["price"]);
			}
		}
	}
};

/*Возвращает индекс следующего Меша используя индекс текущего Меша*/
_MeshesBase.prototype.getNextMeshIndexByCurrentMeshIndex = function (index)
{
	this.keys = Object.keys(this.CaseMeshesWithDescriptions);
	for(var i=0; i< this.keys.length; i++)
	{
		if(this.CaseMeshesWithDescriptions[this.keys[i]]["Index"] === index)
		{
			if( i === (this.keys.length - 1))
			{
				return this.CaseMeshesWithDescriptions[this.keys[0]]["Index"];
			} else {
				return this.CaseMeshesWithDescriptions[this.keys[i+1]]["Index"];
			}
		}
	}
	throw new Error("Have no Mesh with this Index");	
};

/*Возвращает индекс предыдущего Меша используя индекс текущего Меша*/
_MeshesBase.prototype.getPrevMeshIndexByCurrentMeshIndex = function (index)
{
	this.keys = Object.keys(this.CaseMeshesWithDescriptions);
	for(var i=0; i< this.keys.length; i++)
	{
		if(this.CaseMeshesWithDescriptions[this.keys[i]]["Index"] === index)
		{
			if( i === 0)
			{
				return this.CaseMeshesWithDescriptions[this.keys[this.keys.length - 1]]["Index"];
			} else {
				return this.CaseMeshesWithDescriptions[this.keys[i-1]]["Index"];
			}
		}
	}
	throw new Error("Have no Mesh with this Index");	
};

_MeshesBase.prototype.getMeshPriceByIndex = function (index)
{
	var keys = Object.keys(this.CaseMeshesWithDescriptions);
	for(var i=0; i< keys.length; i++)
	{
		if(this.CaseMeshesWithDescriptions[keys[i]]["Index"] === index)
		{
			return this.CaseMeshesWithDescriptions[keys[i]]["Price"];
		}
	}

	throw new Error("Have no Mesh with this Index");	
};

/*Returns copy of the Object by Object Index*/
_MeshesBase.prototype.getDescriptionByIndex = function (index)
{
	var keys = Object.keys(this.CaseMeshesWithDescriptions);
	for(var i=0; i< keys.length; i++)
	{
		if(this.CaseMeshesWithDescriptions[keys[i]]["Index"] === index)
		{
			return this.CaseMeshesWithDescriptions[keys[i]]["Description"];
		}
	}

	throw new Error("Have no Mesh with this Index");
};

/*Returns copy of the Object by Object Index*/
_MeshesBase.prototype.getMeshCopyByIndex = function (index)
{
	for(var mesh_name in this.CaseMeshesWithDescriptions)
	{
		if(this.CaseMeshesWithDescriptions.hasOwnProperty(mesh_name))
		{
			if(this.CaseMeshesWithDescriptions[mesh_name]["Index"] === index)
			{
				return this.CaseMeshesWithDescriptions[mesh_name]["Mesh"].clone();
			}
		}
	}

	throw new Error("Have no Mesh with this Index");
};

/*Returns copy of the Object by Object Index*/
_MeshesBase.prototype.getTargetMeshCopyByIndex = function (index)
{
	for(var mesh_name in this.CaseMeshesWithDescriptions)
	{
		if(this.CaseMeshesWithDescriptions.hasOwnProperty(mesh_name))
		{
			if(this.CaseMeshesWithDescriptions[mesh_name]["Index"] === index)
			{
				return this.CaseMeshesWithDescriptions[mesh_name]["TargetMesh"].clone();
			}
		}
	}

	throw new Error("Have no Mesh with this Index");
};

/*загружает Меши из внешнего файла. Меши должны быть определены как */
_MeshesBase.prototype.load3DSceneByCollada = function (loader, file_str)
{
  return new Promise(
	    function(resolve) 
	    {
	        loader.load(
	            file_str,
	            function(collada) 
	            {											
					resolve(collada.scene);
	            }
	        );
	    }
	);
};
