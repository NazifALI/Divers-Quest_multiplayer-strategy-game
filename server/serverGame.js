/**************************************************
** IMPORTING NODE.JS FUNCTIONALITIES
**************************************************/
var	util = require("util"),			// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),  		// Socket.IO. Socket.io simplifies the usage of websockets
	Player = require("./Player").Player;  	// Player class defined by us

/**************************************************
** GAME VARIABLES
**************************************************/
var socket // Socket connection
var player

/**************************************************
** GAME INITIALISATION
**************************************************/

// estabish connection and listen to events
function init () {
  	socket = io.listen(20202)	// listen for socket events on port number 20202
  	players = []			// list of active players connected to server
  	setEventHandlers()		// Start listening for events
}

var setEventHandlers = function() {
	// if a socket connection is established then go to onSocketConnection function
	sockets.on( onSocketConnection(socket));
};

function onSocketConnection (clientSocket) {
  	print('New player has connected: ' + clientSocket.id)
  	clientSocket.on( onClientDisconnect)	// Listen message for client disconnected
  	clientSocket.on( onNewPlayer)		// Listen message for new player message
  	clientSocket.on( onMovePlayer)		// Listen message for move player message
};

function onClientDisconnect (clientSocket) {
	print( 'Client %d Disconnected', clientSocket.id)
	players.remove(clientSocket.id)					// remove player from the active players list
	clientSocket.broadcast( 'remove player', allClientSockets)	// update all players on the removal of a player
}

function onNewPlayer (playerData) {
	var newPlayer = new Player(playerData.X, playerData.Y)	//initiate new player with given position
	clientSocket.broadcast( 'new player', allClientSockets)	// let all players know about the new player added
	players.push(newPlayer)					//put new player to active players list
}

function onMovePlayer (playerData) {
	var movedPlayer = players.find(playerData.id)	// find the moved player
	movedPlayer.setX(playerData.X)			// update the new (X, Y) position of player
	movedPlayer.setY(playerData.Y)
	broadcast('moved player', allClientSockets)	// update screens of all player with the new position of player
}
