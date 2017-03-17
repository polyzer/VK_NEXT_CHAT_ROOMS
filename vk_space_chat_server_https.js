var express = require("express");
var fs = require("fs");
var https = require("https");
var ExpressPeerServer = require("peer").ExpressPeerServer;
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var jsonParser = bodyParser.json();
var const_and_funcs = require("./vk_space_chat_constants_and_general_functions.js");

var credentials = {
	key: fs.readFileSync("/etc/apache2/ssl/www_polyzer_org/www.polyzer.org_private.key"),
	cert: fs.readFileSync("/etc/apache2/ssl/www_polyzer_org/www_polyzer_org.crt")	
};

/*
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
//   logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
*/

var RETURN_NOTHING = "0";
var ACCESS_CONTROL_ALLOW_ORIGIN = "https://www.polyzer.org";
var ACCESS_CONTROL_ALLOW_HEADERS = "Origin, X-Requested-With, Content-Type, Accept";
var MAX_USERS_IN_ROOM = 5; // максимум человек в комнате;


var app = express();
var httpsServer = https.createServer(credentials, app).listen(const_and_funcs.PEER_PORT_ADDR);

var options = {
//	debug: true,
};

var peerServer = ExpressPeerServer(httpsServer, options);
//var peerServer = ExpressPeerServer(server, options);
app.use(const_and_funcs.PEER_PATH_ADDR, peerServer);
app.use(jsonParser);
app.use(urlencodedParser);


/*
Данная структура позволяет производить следующие действия:
1) Сначала пользователь заходит, мы создаем пользователя.
2) Когда человек начинает искать комнату, мы 
*/
var _User = function (id)
{
	/*По ней определяем, в какой комнате был чел, чтобы не добавлять его туда*/
	this.LastRoomID = null;
	/*Если мы сейчас в какой-то комнате, то сможем ее таким образом быстро найти
	  Если CurrentRoomID === null, ТО МЫ не находимся ни в какой комнате! и нас можно тупо удалить!
	*/
	this.CurrentRoomID = null;
	this.CurrentRoom = null;
	/*Ну енто наш idшник определяемый Peer.js ом*/
	this.ID = id;
};
/*Список комнат. В массиве будем хранить только idшники пользователей!!! Чтобы не искать 3жды*/
var _Room = function (id)
{
	/*Тупо массив idшников юзеров, которые здесь находятся.*/
	this.UsersIDSArray = [];
	if(id !== undefined)
	{
		this.UsersIDSArray.push(id);
	}
	/*idшник комнаты*/
	this.RoomID = const_and_funcs.generateRandomString(10);
};
/*Все пользователи в системе*/
var AllUsers = []; 
/*Массив содержит массив комнат;*/
var Rooms = [];


/*
Функция принимает id пользователя, создает для него новую сущность,
*/
function createUser (id)
{
	AllUsers.push(new _User(id));
}
/*принимает idшник первого юзера, которого добавят сюда!*/
function createRoomByUserAndAddToRooms (UserObj)
{
	var troom = new _Room(UserObj.ID);
	if(UserObj.CurrentRoomID !== null)
	{
		UserObj.LastRoomID = UserObj.CurrentRoomID;
	}
	UserObj.CurrentRoomID = troom.RoomID;
	console.log("New Room ID: " + troom.RoomID + " was created, and User ID: "+ UserObj.ID + " was add there");
	Rooms.push(troom);
}

function MultiRoom_onDisconnect(id)
{

	for(var i=0; i < AllUsers.length; i++)
	{
		if(AllUsers[i].ID === id)
		{
			if(AllUsers[i].CurrentRoomID === null)
			{
				AllUsers.splice(i, 1);
				console.log(id + " was spliced from AllUsers.")
				return;
			}else
			{
				console.log("NOT NULL: " + AllUsers[i].CurrentRoomID);
				for( var j=0; j< Rooms.length; j++)
				{
					if(Rooms[j].RoomID === AllUsers[i].CurrentRoomID)
					{
						for (var k=0; k< Rooms[j].UsersIDSArray.length; k++)
						{
							if(Rooms[j].UsersIDSArray[k] === id)
							{
								Rooms[j].UsersIDSArray.splice(k, 1);
								if(Rooms[j].UsersIDSArray.length === 0)
								{
									Rooms.splice(j, 1);
								}
								AllUsers.splice(i, 1);
								console.log(id + " was spliced from Room, and deleted");
								return;
							}
						}
					}
				}
			}
		}
	}

//	throw new Error(id + " wasn't in any array");
	console.log(id + " wasn't in any array");

}
/*при коннектинге - добавляется в рандомную комнату*/
function MultiRoom_onConnect(id)
{
	createUser(id);
	console.log("new user was created id: " + id);
}

function MultiRoom_onGetRoomsList(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  
  
	res.send(JSON.stringify({users_array: Rooms}));
}

function MultiRoom_onComeIntoRoom(req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  


	for(var i=0; i< AllUsers.length; i++)
	{
		if(AllUsers[i].ID === req.body.user_id)
		{
			if(AllUsers[i].CurrentRoomID !== null)
			{
				for(var j=0; j< Rooms.length; j++)
				{

					if(AllUsers[i].CurrentRoomID === Rooms[j].RoomID)
					{
						for(var k=0; k< Rooms[j].UsersIDSArray.length; k++)
						{
							if(Rooms[j].UsersIDSArray[k] === req.body.user_id)
							{
								Rooms[j].UsersIDSArray.splice(k, 1);
								AllUsers[i].LastRoomID = Rooms[j].RoomID;
								if(Rooms[j].UsersIDSArray.length === 0)
								{
									Rooms.splice(j, 1);
								}
								AllUsers[i].CurrentRoomID = null;
								break;
							}
						}

						for (var k=0; k< Rooms.length; k++)
						{
							if(Rooms[k].UsersIDSArray.length < MAX_USERS_IN_ROOM && Rooms[k].RoomID !== AllUsers[i].LastRoomID)
							{
								res.send({users_array: Rooms[k].UsersIDSArray});
								AllUsers[i].CurrentRoomID = Rooms[k].RoomID;
								Rooms[k].UsersIDSArray.push(req.body.user_id);
								return;
							}
						}
						/*Если мы не нашли свободной комнаты, то создаем ее!
						И отправляем в ответе пустой массив!
						*/
						createRoomByUserAndAddToRooms(AllUsers[i]);
						res.send({users_array: []});
						return;
					}
				}
			} else
			{
				for(var j=0; j< Rooms.length; j++)
				{
					if(Rooms[j].UsersIDSArray.length < MAX_USERS_IN_ROOM)
					{
						res.send({users_array: Rooms[j].UsersIDSArray});
						Rooms[j].UsersIDSArray.push(req.body.user_id);
						AllUsers[i].CurrentRoomID = Rooms[j].RoomID;
						return;
					}
				}
				createRoomByUserAndAddToRooms(AllUsers[i]);
				res.send({users_array: []});
				return;
			}
		}
	}

	throw new Error("User isn't in arrays");


}

/*Поиск новой комнаты для пользователя.
  Предполагается, что он до этого был в другой комнате!
*/
function MultiRoom_onFindRoomToMe (req, res)
{
	res.header("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Headers", ACCESS_CONTROL_ALLOW_HEADERS);  

	for(var i=0; i< AllUsers.length; i++)
	{
		if(AllUsers[i].ID === req.body.user_id)
		{
			if(AllUsers[i].CurrentRoomID !== null)
			{
				for(var j=0; j< Rooms.length; j++)
				{
					if(AllUsers[i].CurrentRoomID === Rooms[j].RoomID)
					{
						for(var k=0; k< Rooms[j].UsersIDSArray.length; k++)
						{
							if(Rooms[j].UsersIDSArray[k] === req.body.user_id)
							{
								Rooms[j].UsersIDSArray.splice(k, 1);
								AllUsers[i].LastRoomID = Rooms[j].RoomID;
								if(Rooms[j].UsersIDSArray.length === 0)
								{
									Rooms.splice(j, 1);
								}
								AllUsers[i].CurrentRoomID = null;
								break;
							}
						}

						for (var k=0; k< Rooms.length; k++)
						{
							if(Rooms[k].UsersIDSArray.length < MAX_USERS_IN_ROOM && Rooms[k].RoomID !== AllUsers[i].LastRoomID)
							{
								res.send({users_array: Rooms[k].UsersIDSArray});
								AllUsers[i].CurrentRoomID = Rooms[k].RoomID;
								Rooms[k].UsersIDSArray.push(req.body.user_id);
								return;
							}
						}
						/*Если мы не нашли свободной комнаты, то создаем ее!
						И отправляем в ответе пустой массив!
						*/
						createRoomByUserAndAddToRooms(AllUsers[i]);
						res.send({users_array: []});
						return;
					}
				}
			} else
			{
				for(var j=0; j< Rooms.length; j++)
				{
					if(Rooms[j].UsersIDSArray.length < MAX_USERS_IN_ROOM)
					{
						res.send({users_array: Rooms[j].UsersIDSArray});
						Rooms[j].UsersIDSArray.push(req.body.user_id);
						AllUsers[i].CurrentRoomID = Rooms[j].RoomID;
						return;
					}
				}
				createRoomByUserAndAddToRooms(AllUsers[i]);
				res.send({users_array: []});
				return;
			}
		}
	}

	throw new Error("User isn't in arrays");

}


var ServiceFunctions = {};

ServiceFunctions.onConnect = MultiRoom_onConnect;
ServiceFunctions.onDisconnect = MultiRoom_onDisconnect;
ServiceFunctions.onComeIntoRoom = MultiRoom_onComeIntoRoom;
ServiceFunctions.onFindRoomToMe = MultiRoom_onFindRoomToMe;

/*Если пользователь решил выйти из в основное меню*/
app.post("/" + const_and_funcs.REQUESTS.UTOS.FIND_ROOM_TO_ME, ServiceFunctions.onFindRoomToMe);
app.post("/" + const_and_funcs.REQUESTS.UTOS.COME_INTO_ROOM, ServiceFunctions.onComeIntoRoom);
/*При создании соединения, игрок автоматически добавляеся в список
 *неопределившихся игроков;
 **/
peerServer.on("connection", ServiceFunctions.onConnect);
/*При ризрыве соединения, выходит, что пользователь полностью покинул игру;
 *Должен быть автоматически удален из всех структур, в которых он содержится;
 **/
peerServer.on("disconnect", ServiceFunctions.onDisconnect);
