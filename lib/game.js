var util = require('util')
var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')

var Player = require('./Player')

var port = process.env.PORT || 20202

/* ************************************************
** GAME VARIABLES
************************************************ */
var socket	// Socket controller
var players	// Array of connected players
var gamestate

/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err
  }

  init()
})

function init () {
	// Create an empty array to store players
	players = []

	// Attach Socket.IO to server
	socket = io.listen(server)

	// Start listening for events
	setEventHandlers()
}

/* ************************************************
** GAME EVENT HANDLERS
************************************************ */
var setEventHandlers = function () {
  // Socket.IO
	socket.sockets.on('connection', onSocketConnection)
}

// New socket connection
function onSocketConnection (client) {
	util.log('New player has connected: ' + client.id)

	// Listen for client disconnected
	client.on('disconnect', onClientDisconnect)

	// Listen for new player message
	client.on('new player', onNewPlayer)

	// Listen for move player message
	client.on('move player', onMovePlayer)

	client.on('update state', onUpdateState);

	client.on('oxygen collected', onOxygenCollected);
	
	client.on('torpedo collected', onTorpedoCollected);
	
	client.on('treasure found', onTreasureFound);
	client.on('shark killed', SharkKilled);
}
function SharkKilled(obj)
{
	util.log('shark killed');
	this.broadcast.emit('shark killed', {name:obj.name});
}

function onUpdateState(data){
	this.gamestate= data;
}

// Socket client has disconnected
function onClientDisconnect () {
	util.log('Player has disconnected: ' + this.id)

	var removePlayer = playerById(this.id)

	// Player not found
	if (!removePlayer) {
		util.log('Player not found: ' + this.id)
		return
	}

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1)

	// Broadcast removed player to connected socket clients
	this.broadcast.emit('remove player', {id: this.id})
}

// New player has joined
function onNewPlayer (data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y)
	newPlayer.id = this.id

	// Broadcast new player to connected socket clients
	this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

	// Send existing players to the new player
	var i, existingPlayer
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i]
		this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()})
	}
	this.broadcast.emit('update state', {game: gamestate})

	// Add new player to the players array
	players.push(newPlayer)
}

// Player has moved
function onMovePlayer (data) {
	// Find player in array
	var movePlayer = playerById(this.id)

	// Player not found
	if (!movePlayer) {
		util.log('Player not found: ' + this.id)
		return
	}

	// Update player position
	movePlayer.setX(data.x)
	movePlayer.setY(data.y)

	// Broadcast updated position to connected socket clients
	this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}

function onOxygenCollected() { //oxygenData) {
	util.log("Oxygen is indeed collected");
	// create coordinates for new location and send it.
	var posX = 1000;
	var posY = 1000;
	while ( posX > 700 && posY > 700) {
		posX = Math.round(Math.random()*1000);
		posY = Math.round(Math.random()*1000);
	}
	this.emit('oxygen collected', {x: posX, y: posY});
	this.broadcast.emit('oxygen collected', {x: posX, y: posY})//, {x:oxygenData.x, y:oxygenData.y});
}

function onTorpedoCollected() {
	util.log("Torpedo is indeed collected");
	// create coordinates for new location of torpedo powerup and send it.
	var posX = 1000;
	var posY = 1000;
	while ( posX > 700 && posY > 700) {
		posX = Math.round(Math.random()*1000);
		posY = Math.round(Math.random()*1000);
	}
	this.emit('torpedo collected', {x: posX, y: posY});
	this.broadcast.emit('torpedo collected', {x: posX, y: posY});
}

function onTreasureFound(data) {
	util.log("Treasure score is " + data.score);
	this.broadcast.emit('treasure found', {score: data.score, x: data.x, y: data.y} );//, {x:oxygenData.x, y:oxygenData.y});
}

/* ************************************************
** GAME HELPER FUNCTIONS
************************************************ */
// Find player by ID
function playerById (id) {
  var i
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }

  return false
}
