<!DOCTYPE html>
<html> 
<head>
<meta charset="UTF-8" /> 
<link rel="stylesheet" href="./vk_space_chat.css" />

<script src='../games_resources/libs/three.js/build/three.min.js'></script>
<!--<script src='../games_resources/libs/three.js/examples/js/controls/FirstPersonControls.js'></script>-->
<script src='../games_resources/libs/three.js/examples/js/controls/FlyControls.js'></script>
<script src='../games_resources/libs/three.js/examples/js/renderers/CSS3DRenderer.js'></script>		 
<script src="../games_resources/libs/jquery.js"></script>
<script src="../games_resources/libs/peer.min.js"></script>

<script src="./vk_space_chat_constants_and_general_functions.js"></script>
<script src="./vk_space_chat_net_messages.js"></script>
<script src="./vk_space_chat.js"></script>
<script src="./vk_space_chat_menu.js"></script>
<script src="./vk_space_chat_users.js"></script>
<script src="./vk_space_chat_visual_keeper.js"></script>
<script src="./vk_space_chat_hint.js"></script>
<script src="./vk_space_chat_body.js"></script>
<script src="./vk_space_chat_my_controls.js"></script>
<script src="./vk_space_chat_flying_objects.js"></script>
<script src="./vk_space_chat_user_chat_controls.js"></script>
<script src="./vk_space_chat_collecting_objects.js"></script>
<script src="./vk_space_chat_bad_blocks.js"></script>

</head>
<body>
<!--<div id="ID_VIEWER" style="position: absolute; left: 0px; top: 0px; z-index: 1000000; background-color: yellow;"></div>-->
<script>
</script>
<script>

/*
window.globPlayer = {};
window.globPlayer.ObjHTML = document.createElement("div");
window.globPlayer.ObjHTML.setAttribute("id", "player");
document.body.appendChild(window.globPlayer.ObjHTML);
window.globPlayer.ObjHTML.style.display = "none";
window.globPlayer.ObjHTML.style.position = "absolute";
window.globPlayer.ObjHTML.style.zIndex = "1000000";
window.globPlayer.ObjHTML.style.left = "100px";
window.globPlayer.ObjHTML.style.top = "100px";
window.globPlayer.ShowingState = false;
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var YouTubePlayer;
function onYouTubeIframeAPIReady() {
  YouTubePlayer = new YT.Player('player', {
    height: '200',
    width: '400',
    videoId: 'bTTy2ymdavY',
    events: {
      'onReady': onPlayerReady
    }
  });
}

  // 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	window.Peer = new Peer({
		host: PEER_SERVER_ADDR, 
		port: PEER_PORT_ADDR, 
		path: PEER_PATH_ADDR //,debug: true
	});
	
	window.Peer.on("open", function () {
		var MenuObj = new _Menu();
		YouTubePlayer.setVolume(0);
		YouTubePlayer.playVideo();
	});

}

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
function stopVideo() {
    YouTubePlayer.stopVideo();
}

window.addEventListener("keydown", function (event) {
	if(event.keyCode === 80)
	{
		if(window.globPlayer.ShowingState === false)
		{
			$("#player").show("slow");
			window.globPlayer.ShowingState = true;
		} else
		{
			$("#player").hide("slow");
			window.globPlayer.ShowingState = false;
		}
	}
});
*/

var ForUpdating = [];		
var StreamObj = null;


	window.Peer = new Peer({
		host: PEER_SERVER_ADDR, 
		port: PEER_PORT_ADDR, 
		path: PEER_PATH_ADDR //,debug: true
	});


	window.Peer.on("open", function () {
		window.MenuObj = new _Menu();
	});

</script>
<!-- <iframe style="display: none; z-index: -1000;" width="420" height="315" src="https://www.youtube.com/embed/VDC9d0PIPGc?autoplay=1">
</iframe> -->
</body>
</html>

