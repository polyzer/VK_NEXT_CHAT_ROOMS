/*
IN: Scene, color, LocalBoundingMesh
*/
var _CollectingObjects = function (scene, LocalBoundingMesh, callback)
{
	this.LocalBoundingMesh = LocalBoundingMesh;
	this.Color = null;
	this.Scene = scene;
	this.Objects = [];
	this.BoundingRadius = 200;
	this.Callback = callback;
	this.ObjectsCount = 5;
	this.OneObjectCost = 200;

	this.ObjectsCounter = {
		LastNum: 0,
		Div: document.createElement("div")
	};

	this.ObjectsCounter.Div.appendChild(document.createTextNode(": " + this.ObjectsCounter.LastNum));
	this.ObjectsCounter.Div.id = "CollectingObjectsCounter";
	document.body.appendChild(this.ObjectsCounter.Div);

	this.resetColor();
	this.createObjects();
};

_CollectingObjects.prototype.setOneObjectCost = function (cost)
{
	this.OneObjectCost = cost;
};

_CollectingObjects.prototype.setScene = function (scene)
{
	this.Scene = scene;
};
_CollectingObjects.prototype.getScene = function ()
{
	return this.Scene;
};

_CollectingObjects.prototype.getColor = function ()
{
	return this.Color;
};

_CollectingObjects.prototype.resetColor = function ()
{
	this.Color = Math.random()*0xFFFFFF;
}

_CollectingObjects.prototype.createObjects = function ()
{

	for (var i=0; i< this.ObjectsCount; i++)
	{
		var el = new THREE.Mesh(
				new THREE.BoxGeometry(200, 200, 200), 
				new THREE.MeshStandardMaterial({color: this.Color, opacity: 0.9, transparent: true})
			);
		el.add(new THREE.LineSegments( 
			new THREE.EdgesGeometry( el.geometry ), 
			new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } )
		));

		el.position.x = (Math.random()*2 - 1)/2 * WORLD_CUBE.SCALED_SIZE.x;
		el.position.y = (Math.random()*2 - 1)/2 * WORLD_CUBE.SCALED_SIZE.y;
		el.position.z = (Math.random()*2 - 1)/2 * WORLD_CUBE.SCALED_SIZE.z;
		el.MoveSpeed = Math.random()*FLYING_OBJECTS.MAX_SPEED;
		this.Objects.push(el);
		this.Scene.add(el);
	}
};

_CollectingObjects.prototype.deleteObjects = function ()
{
	for(var i=this.Objects.length-1; i >= 0; i--)
	{
		this.Scene.remove(this.Objects[i]);
		this.Objects.splice(i, 1);
	}
};

_CollectingObjects.prototype.update = function ()
{
	for(var i=0; i< this.Objects.length; i++)
	{		
		var distTo = this.LocalBoundingMesh.position.distanceTo(this.Objects[i].position);
		if(distTo < this.BoundingRadius)
		{
			this.Scene.remove(this.Objects[i]);
			this.Objects.splice(i,1);
			this.Callback(this.OneObjectCost);
		}
	}

	if(this.Objects.length !== this.ObjectsCounter.LastNum)
	{
		this.ObjectsCounter.Div.removeChild(this.ObjectsCounter.Div.firstChild);
		this.ObjectsCounter.Div.appendChild(document.createTextNode(": " + this.Objects.length));
		this.ObjectsCounter.LastNum = this.Objects.length;
	}
};