//client side of game with phaser

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
var game = new Phaser.Game(800, // width of game screen in pixels
			  600,  // height of game screen in pixels
                          Phaser.AUTO,
                          { preload, create, update, render }  // list of functions that define game state
)

// preload assets
function preload () {
 	game.loadImage('background', 'assets/backgound.png')
 	game.loadImage('shark', 'assets/shark.png)
 	game.loadImage('wreckage', 'assets/wreckage.png')
 	game.loadImage('treasure', 'assets/treasure.png')
 	/* load other images as needed */
}


// create the game objects for play to begin
function create () {
  	// Initialise socket connection
	socket = io.connect("http://localhost", {port: 20202, transports: ["websocket"]});
  
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
