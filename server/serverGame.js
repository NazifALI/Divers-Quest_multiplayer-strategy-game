/**************************************************
** IMPORTING NODE.JS FUNCTIONALITIES
**************************************************/
var	util = require("util"),			// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),  		// Socket.IO. Socket.io simplifies the usage of websockets
	Player = require("./Player").Player;  	// Player object defined by us

/**************************************************
** GAME VARIABLES
**************************************************/
var socket	// Socket connection
var players 	// list of players connected

/**************************************************
** GAME INITIALISATION AND EVENTS
**************************************************/

// estabish connection and listen to events
function init () {
  	socket = io.listen(20202)	// listen for socket events on port number 20202
  	players = []			// list of active players connected to server
  	setEventHandlers()		// start listening for events
}

var setEventHandlers = function() {
	// if a socket connection is established then go to onSocketConnection function
	sockets.on( onSocketConnection(socket));
};

function onSocketConnection (clientSocket) {
  	print('New player has connected: ' + clientSocket.id)
  	clientSocket.on( onClientDisconnect)	// listen for client disconnected
  	clientSocket.on( onNewPlayer)		// listen for new player message
  	clientSocket.on( onMovePlayer)		// listen for move player message
  	clientSocket.on( onBombPlaced)		// listen for position of bomb placed message
  	clientSocket.on( onWreckageDestroyed)	// listen for wreckage destroyed message
  	clientSocket.on( onPlayerKilled)	// listen for player killed message
  	clientSocket.on( onPowerpTaken)		// listen for power ups taken message
  	clientSocket.on( onHelpAsked)		// listen for help message
  	clientSocekt.on( onHelpGiven)		// listen for help given message
  	clientSocket.on( onTreasureFound)	// listen for treasure found message
};

function onClientDisconnect (clientSocket) {
	print( 'Client %d Disconnected', clientSocket.id)
	players.remove(clientSocket.player.id)					// remove player from the active players list
	emit( 'remove player', players.find(player.id), allClientSockets)	// update all players on the removal of a player
}

function onNewPlayer (playerData) {
	var newPlayer = new Player(playerData.X, playerData.Y)	// initiate new player with given position
	emit( 'new player', newPlayer, allClientSockets)	// let all players know about the new player added
	players.push(newPlayer)					// put new player to active players list
}

function onMovePlayer (playerData) {
	var movedPlayer = players.find(playerData.id)		// find the moved player
	movedPlayer.setX(playerData.X)				// update the new (X, Y) position of player
	movedPlayer.setY(playerData.Y)
	emit('moved player', [movedPlayer.X, movedPlayer.Y], allClientSockets)
		// update screens of all player with the new position of player passed as list of (x,y) coordinates
}

function onBombPlaced (bomb) {
	emit('bomb placed', bomb, allClientSocekts)	// send the bomb object to all clients to show on their maps
}

function onWreckageDestroyed (wreckage) {
	emit('wreckage destroyed', wreckage, allClientSockets)	// remove destroyed wreckage from all clients' maps
}

function onPlayerKilled (playerData) {
	emit('player killed', playerData.id, allClientSockets)	// let all sockets know about the killed player
}

function onPowerupTaken (powerup){
	emit('powerup taken', powerup, allClientSockets)	// show all sockets that the power up is taken
}

function onHelpAsked (playerData) {
	emit('need help', playerData.id, allClientSockets)	// send the id of he player who asked for help
}

function onHelpGiven (supplies) {
	emit('help provided', [playerData.oxygen, playerData.flashlight], supplies.clientSocket.id)
		// oxygen and flashlight amount in the list given to the player recognised by the clientSocket id
}

function onTreasureFound (playerData){
	emit('game won', playerData.id, allClientSockets)	// let every player know the game is won
}
