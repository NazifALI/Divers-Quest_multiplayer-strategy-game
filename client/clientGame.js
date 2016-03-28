/*
Pseudocode for client side of game implemented using Phaser API Framework.
The arguments of the event handler functions and emit() function clearly shows which data
is being passed to the server and received from ther server.
*/

/**************************************************
** GAME VARIABLES
**************************************************/
var socket // Socket connection
var player
var bomb
var wreckage = []	// list of wreckage sites on the map
var powerup
var treasure
var shark
var timer

/**************************************************
** GAME DEFINITION USING PHASER API
**************************************************/

// creating phaser game instance
var game = new Phaser.Game(800, // width of game screen in pixels
			  600,  // height of game screen in pixels
                          { preload, create, update }  // list of functions that define game state
)

// preload assets
function preload () {
 	game.loadImage('background', 'assets/backgound.png')
 	game.loadImage('shark', 'assets/shark.png')
 	game.loadImage('bomb', 'assets/wreckage.png')
 	game.loadImage('treasure', 'assets/treasure.png')
 	/* load other images as needed */
}

// create the game objects for play to begin
function create () {
	socket = io.connect( port = 20202 )	// initialise socket connection at port 20202
  	playersActive = []			// list of active players connected to server
  	// starting position of our player set
  	setEventHandlers()			// start listening for events
}

// to send event to server
function update () {
  	for (i range (0, playersActive.length)){
  		playersActive[i].update()	// update the state and position of each player in the game
  	}
  	if( key.UPARROW.pressed() || key.DOWNARROW.pressed() || key.RIGHTARROW.pressed() || key.LEFTARROW.pressed()){
  		player.update(X, Y)	// if up, down, right or left keys are pressed, update the player's positon
  		emit('move player', [player.X, player.Y, player.id))	// send new position to the server
  	}
  	if( key.B.pressed()){		// if bomb is placed then attach it to map and send its position to server
  		bomb.attachToMap()
  		emit('bomb placed', (bomb.X, bomb.Y))
  		timer.wait(bomb.explodeTime)	// wait for the bomb to explode
  		emit('wreckage destroyed', wreckage)	// send the destroyed wreckage to server
  	}
  	if( key.CTRL.pressed() && key.S.pressed()){
  		emit('need help', player.id)	// send the player id if it asks for help
  	}
  	if( player.position() == powerup.position){	// if player is in the same position as the powerup
  		player.oxygen += powerup.OxygenUp	// increase oxygen tank level
  		player.flashlight += powerup.Flashlight	// increase flashlight level
  		emit('powerup taken', powerup)		// let the server know that powerup is taken
  	}
  	if(!player.isalive()){				// if player dies because of lossing oxygen, flashlight, bomb etc
  		emit('player killed', player.id)	// let the server know the player is dead
  	}
  	if( help given){		// if the player is helping someone
  		emit('help provided', [player.oxygenAmount, player.flashlightAmount])
  	}
  	if ( player.position() == treasure.position()){
  		emit('game won', player.id)	// if player is on the place of treasure, let others know that he won
  	}
}


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
  	socekt.on( onHelpGiven)		// help given message received
  	socket.on( onTreasureFound)	// treasure found message received
  	socket.on( onSharkKilled)        //shark kills by bomb
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
  	playersActive.push(new Player(playerData))	// add the new player in the list of curren players
}

function onMovePlayer (playerData) {
	var movePlayer = new playersActive.find(playerData.id)
	movedPlayer.setX(playerData.X)		// update the new (X, Y) position of player
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

funciton onTreasureFound (playerData){
	GameoverScren.show()
}

function onSharkKilled(data)
{
     shark.kill();
}
