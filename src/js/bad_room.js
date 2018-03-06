var _BadRoom = function ()
{
	this.Scene = new THREE.Scene();

	this.BadBlocksArray = [];
	for(var i=0; i<50; i++)
	{
		this.Scene.add(new THREE.Mesh(
			new THREE.BoxGeometry(120, 120, 120),
			new THREE.MeshStandardMaterial({color: 0x000000, map: THREE.TextureLoader.load("./bad_block_256.png")});
		));
		
	}

};

_BadRoom.prototype.controlBadBlocks = function ()
{

};

_BadRoom.prototype.update = function ()
{

};