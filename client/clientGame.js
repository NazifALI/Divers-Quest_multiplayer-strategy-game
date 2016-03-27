//client side of game with phaser

/**************************************************
** GAME VARIABLES
**************************************************/
var socket // Socket connection
var player
var bomb
var wreckage
var treasure
var shark
var timer

/**************************************************
** GAME DEFINITION USING PHASER API
**************************************************/

// creating phaser game instance
var game = new Phaser.Game(800, // width of game screen in pixels
			  600,  // height of game screen in pixels
                          { preload, create, update, render }  // list of functions that define game state
)

/**************************************************
** GAME EVENT HANDLERS
**************************************************/

var setEventHandlers = function () {
  	socket.on( onSocketConnected)	// socket connected successfully
  	socket.on( onSocketDisconnect)	// socket disconnected
  	socket.on( onNewPlayer)		// new player message received
  	socket.on( onMovePlayer)	// player move message received
  	socket.on( onRemovePlayer)	// player removed message received
  	
  	socket.on( onBombPlaced)	// position of bomb placed message received
  	socket.on( onWreckageDestroyed)	// wreckage destroyed message received
  	socket.on( onPlayerKilled)	// player killed message received
  	socket.on( onPowerpTaken)	// power ups taken message received
  	socket.on( onHelpAsked)		// help message received
  	socekt.on( onHelpGiven)		//  help given message received
}

// Socket connected
function onSocketConnected () {
  	print('Connected to the server')
  	emit('new player', { player.x, player.y })	// send local player data (x, y position) to server
}

function onSocketDisconnected () {
  	print('Disconnected from the server')
}

function onNewPlayer (playerData) {
  	playersActive.push(new Player(playerData))		// add the new player in the list of curren players
}

function onMovePlayer (playerData) {
	var movePlayer = new playersActive.find(playerData.id)
	movedPlayer.setX(playerData.X)				// update the new (X, Y) position of player
	movedPlayer.setY(playerData.Y)
}

function onBombPlaced (bomb) {
	bomb.attachToMap()	// add bomb to the map
}

function onWreckageDestroyed (wreckage) {
	bomb.detachFromMap()	// remove wreckage from the map/landscape
}

function onPlayerKilled (playerData) {
	playersActive.remove(playerData.id)	// remove the player form active players list
}

function onPowerupTaken (powerup){
	powerup.detachFromMap()		// remove powerup as it has been taken
}

function onHelpAsked (playerData) {
	Dialogueox( input Oxygen, input Flashlight)	// create dialogue box asking the player for supplies
	
}
