/**************************************************
** IMPORTING NODE.JS LIBRARIES
**************************************************/
var util = require("util"),	// Utility resources (logging, object inspection, etc)
	  io = require("socket.io"),  // Socket.IO
	  Player = require("./Player").Player;  // Player class defined by us

/**************************************************
** GAME VARIABLES
**************************************************/
var socket // Socket connection
var land
var player
var sharks
var wreckage
var treasure
var timer

/**************************************************
** GAME DEFINITION USING PHASER API
**************************************************/

// creating phaser game instance
var game = new Phaser.Game(800, // width in pixels
                          600,  // height in pixels
                          Phaser.AUTO,
                          { preload: preload, create: create, update: update, render: render }  // list of functions that define game state
)

// preload assets
function preload () {
  game.load.image('background', 'assets/backgound.png')
  game.load.image('shark', 'assets/shark.png)
  game.load.image('wreckage', 'assets/wreckage.png')
  game.load.image('treasure', 'assets/treasure.png')
  /* load other images as needed */
}
// create the game objects for play to begin
function create () {
  // listen for socket events on port number 20202
  socket = io.listen(20202)
  
  // list of active players connected to server
  players = []
  // starting position of our player
  var startX = Math.random() mod 800
  var startY = Math.random() mod 600
  cursors = game.input.keyboard.createCursorKeys()
  // Start listening for events
  setEventHandlers()
}
function update () {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
      game.physics.collide(player, enemies[i].player)
    }
  }
  if (cursors.left.isDown) {
  } else if (cursors.right.isDown) {
  }
  if (cursors.up.isDown) {
    // The speed we'll travel at
  } else {

  }
  
  socket.emit('move player', { x: player.x, y: player.y })
}


function render () {
}


var setEventHandlers = function () {
  // socket connected successfully
  socket.on('connect', onSocketConnected)

  // socket disconnected
  socket.on('disconnect', onSocketDisconnect)

  // new player message received
  socket.on('new player', onNewPlayer)

  // player move message received
  socket.on('move player', onMovePlayer)

  // player removed message received
  socket.on('remove player', onRemovePlayer)
}
