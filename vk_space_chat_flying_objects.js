var _FlyingObjects = function (scene)
{
	this.Scene = scene;

	this.FlyingObjects = [];
	for (var i=0; i<FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{
		var el = new THREE.Mesh(
				new THREE.BoxGeometry(100, 100, 100), 
				new THREE.MeshStandardMaterial({color: 0xffffff*Math.random(), opacity: Math.random()*0.2+0.7, transparent: true})
			);
		el.position.x = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.x;
		el.position.y = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.y;
		el.position.z = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.z;
		el.MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		this.FlyingObjects.push(el);
		this.Scene.add(el);
	}

	for(var i=0; i < FLYING_OBJECTS.FARTHER_OBJECTS_COUNT; i++)
	{
		var el = new THREE.Mesh(
				new THREE.SphereGeometry(10+Math.round(Math.random()*-3), 32, 32), 
				new THREE.MeshStandardMaterial({color: 0xd2fff0, opacity: 0.9, transparent: true})
			);
		el.position.x = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.x;
		el.position.y = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.y;
		el.position.z = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.z;
		el.MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		this.FlyingObjects.push(el);
		this.Scene.add(el);
	}


};

_FlyingObjects.prototype.update = function ()
{
	for(var i=0; i< FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{		
		if(this.FlyingObjects[i].position.y >= WORLD_CUBE.SCALED_SIZE.y)
		{
			this.FlyingObjects[i].position.x = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.x;
			this.FlyingObjects[i].position.y = (-1) * WORLD_CUBE.SCALED_SIZE.y;
			this.FlyingObjects[i].position.z = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.z;
			this.FlyingObjects[i].material.color.set(0xffffff*Math.random());			
			this.FlyingObjects[i].MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		} else
		{
			this.FlyingObjects[i].position.y += 30;
			this.FlyingObjects[i].position.y += this.FlyingObjects[i].MoveSpeed;
		}
	}

	for(var i= FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i<(FLYING_OBJECTS.NEAREST_OBJECTS_COUNT+FLYING_OBJECTS.FARTHER_OBJECTS_COUNT); i++)
	{		
		if(this.FlyingObjects[i].position.y >= WORLD_CUBE.SCALED_SIZE.y)
		{
			this.FlyingObjects[i].position.x = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.x;
			this.FlyingObjects[i].position.y = (-1) * WORLD_CUBE.SCALED_SIZE.y;
			this.FlyingObjects[i].position.z = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.z;
			this.FlyingObjects[i].MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		} else
		{
			this.FlyingObjects[i].position.y += 30;
			this.FlyingObjects[i].position.y += this.FlyingObjects[i].MoveSpeed;
		}
	}	

};

_FlyingObjects.prototype.resetPositionsAndColors = function ()
{
	for(var i=0; i< FLYING_OBJECTS.NEAREST_OBJECTS_COUNT; i++)
	{		
			this.FlyingObjects[i].material.color = 0xffffff*Math.random();
			this.FlyingObjects[i].position.x = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.x;
			this.FlyingObjects[i].position.y = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.y;
			this.FlyingObjects[i].position.z = (Math.random()*2 - 1) * WORLD_CUBE.SCALED_SIZE.z;
	}
};