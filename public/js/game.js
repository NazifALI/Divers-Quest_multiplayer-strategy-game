
/* global Phaser RemotePlayer io */

var game = new Phaser.Game(800, 600, Phaser.CANVAS,' ', { preload: preload, create: create, update: update, render: render })

function preload () {
	  game.load.image('background','assets/back.png')
	  game.load.image('treasure', 'assets/Treasure.png');
	  game.load.image('shark', 'assets/shark.png')
	  game.load.image('oxygen', 'assets/oxygen.png')
	  game.load.image('wreckage', 'assets/Wreckage.png');
	  game.load.spritesheet('dude', 'assets/diversprite.png', 256, 256)
	  game.load.spritesheet('enemy', 'assets/dude.png', 64, 64)
	  game.load.spritesheet('kaboomCode', 'assets/explosion.png', 64, 64);
}

var socket // Socket connection

var land
var flashlight;
var explosion;
var wreckage;
var player

var allPlayers
var loop

var currentSpeed = 0
var timer;
var loop;
var oxygenLevel = 100;
var oxygenText;
var powerLevel = 100;
var powerText;
var endingText;
var cursors

function create () {
	socket = io.connect()
	mask = game.add.graphics(0,0);
	mask.beginFill(0xffffff)

	// Resize our game world to be a 1000 x 1000 square


	// Our tiled scrolling background
	land = game.add.tileSprite(0, 0, 1000, 1000, 'background')
	game.world.setBounds(0, 0, 1000, 1000)
	land.fixedToCamera = true


	//timer
	timer = game.time.events;
	loop = timer.loop(Phaser.Timer.SECOND, OxygenDec, this);
	loop = timer.loop(Phaser.Timer.SECOND, PowerDec, this);

	// The base of our player
	var startX = Math.round(Math.random() * (1000) - 500)
	var startY = Math.round(Math.random() * (1000) - 500)
	player = game.add.sprite(startX, startY, 'dude')
	player.anchor.setTo(0.5, 0.5)
	game.physics.enable(player, Phaser.Physics.ARCADE)
	player.body.collideWorldBounds=true;
	player.scale.setTo(0.4)
	player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7])

	//adding treasure
	treasures = game.add.group();
	treasures.enableBody = true;
	treasures.physicsBodyType = Phaser.Physics.ARCADE;
	var treasure = treasures.create(200,500,'treasure');
	treasure.anchor.setTo(0.5,0.5);
	treasure.body.immovable = false;
	treasure.scale.x = 0.4;
	treasure.scale.y = 0.4;

	// adding oxygen power up
	oxygenPowerUps = game.add.group();
	oxygenPowerUps.enableBody = true;
	oxygenPowerUps.physicsBodyType = Phaser.Physics.ARCADE;
	var oxygen = oxygenPowerUps.create(500,450,'oxygen');
	oxygen.anchor.setTo(0.5,0.5);
	oxygen.body.immovable = false;
	oxygen.scale.x = 0.2;
	oxygen.scale.y = 0.2;

	// power power up
	powerPowerUp = game.add.group();

	//shark1
	shark = game.add.sprite(400, 500, 'shark');
	shark.anchor.setTo(0.5);
	shark.scale.setTo(1.5,1.4);
	game.physics.enable([shark],Phaser.Physics.ARCADE)
	shark.physicsBodyType = Phaser.Physics.ARCADE;

	shark.body.collideWorldBounds = true;
	shark.body.gravity.y = -200;
	shark.body.bounce.set(1);

	// adding wreckage
	wreckage = game.add.group();
	wreckage.enableBody = true;
	wreckage.physicsBodyType = Phaser.Physics.ARCADE;
	var obstacle = wreckage.create(100,100,'wreckage');
	var obstacle2 = wreckage.create(100,300, 'wreckage');
	var obstacle3 = wreckage.create(450,200, 'wreckage')
	obstacle.anchor.setTo(0.5,0.5);
	obstacle.body.immovable = true;
	obstacle2.anchor.setTo(0.5,0.5);
	obstacle2.body.immovable = true;
	obstacle3.anchor.setTo(0.5,0.5);
	obstacle3.body.immovable = true;		
	
	//mask all objects
	obstacle.mask = mask;
	obstacle2.mask = mask;
	obstacle3.mask = mask;
	land.mask=mask;
	treasure.mask = mask;
	shark.mask = mask;
	oxygen.mask = mask;
	
	// create player's vision
	mask.drawCircle(0,0,200)

	game.physics.enable(player, Phaser.Physics.ARCADE)
	// This will force it to decelerate and limit its speed
	player.body.drag.x= 100;
	player.body.drag.y= 100;
	player.body.collideWorldBounds = true

	// holds other players
	allPlayers = []

	player.bringToTop()

	game.camera.follow(player)

	cursors = game.input.keyboard.createCursorKeys()

	oxygenText = game.add.text(16, 16, 'Oxygen Level: 100%', {fintSize: '32px', fill: '#090'} );
	powerText = game.add.text(16, 50, 'Power Level: 100%', {fintSize: '32px', fill: '#FF0'} );
	oxygenText.fixedToCamera=true;
	powerText.fixedToCamera=true;
	
	// Start listening for events
	setEventHandlers()
}

var setEventHandlers = function () {
	// Socket connection successful
	socket.on('connect', onSocketConnected)

	// Socket disconnection
	socket.on('disconnect', onSocketDisconnect)

	// New player message received
	socket.on('new player', onNewPlayer)

	// Player move message received
	socket.on('move player', onMovePlayer)

	// Player removed message received
	socket.on('remove player', onRemovePlayer)

	socket.on('update state', onUpdateState)
}


function onUpdateState(data) {
	this.game= data;
}

// Socket connected
function onSocketConnected () {
	console.log('Connected to socket server')

	// Reset allPlayers on reconnect
	allPlayers.forEach( function (enemy) {enemy.player.kill()} )
	allPlayers = []

	// Send local player data to the game server
	socket.emit('new player', { x: player.x, y: player.y })
}

// Socket disconnected
function onSocketDisconnect () {
	console.log('Disconnected from socket server')
}

// New player
function onNewPlayer (data) {
	console.log('New player connected:', data.id)

	// Avoid possible duplicate players
	var duplicate = playerById(data.id)
	if (duplicate) {
		console.log('Duplicate player!')
		return
	}

	// Add new player to the remote players array
	allPlayers.push(new RemotePlayer(data.id, game, player, data.x, data.y))
}

// Move player
function onMovePlayer (data) {
	var movePlayer = playerById(data.id)

	// Player not found
	if (!movePlayer) {
		console.log('Player not found: ', data.id)
		return
	}

	// Update player position
	movePlayer.player.x = data.x
	movePlayer.player.y = data.y
}

// Remove player
function onRemovePlayer (data) {
	var removePlayer = playerById(data.id)

	// Player not found
	if (!removePlayer) {
		console.log('Player not found: ', data.id)
		return
	}

	removePlayer.player.kill()

	// Remove player from array
	allPlayers.splice(allPlayers.indexOf(removePlayer), 1)
}

function update () {

	game.physics.arcade.overlap(player, oxygenPowerUps, collectOxygen, null, this);
	game.physics.arcade.overlap(player, powerPowerUp, collectPower, null, this);
	game.physics.arcade.overlap(player, treasures, winner, null, this);
	game.physics.arcade.collide(player, wreckage);

	if (checkOverlap(shark, player)){
		oxygenLevel -= .25;
		oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
	}

	//socket.emit('update state', {this.game});
	for (var i = 0; i < allPlayers.length; i++) {
		if (allPlayers[i].alive) {
			allPlayers[i].update()
		}
	}

	if (cursors.left.isDown) {
		player.body.velocity.x = -70;
		player.scale.x = -0.4;
		player.animations.play('move', 10, false);
	} else if (cursors.right.isDown) {
		player.body.velocity.x = 70;
		player.scale.x = 0.4;
		player.animations.play('move', 10, false);
	}

	if (cursors.up.isDown) {
		player.body.velocity.y = -70;
		//player.animations.play('move', 10, false);
	} else
	if (cursors.down.isDown) {
		player.body.velocity.y= 70;
		//player.animations.play('move', 10, false);
	}

	if (player.scale.x > 0){
		mask.x = player.x-50;
	} else {
		mask.x = player.x+50;
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		player.body.velocity.x = -200;
		player.scale.x = -0.4;
		//player.animations.play('move', 100, false);
		oxygenLevel -= 0.15;
		oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		player.body.velocity.x = 200;
		player.scale.x = 0.4;
		//player.animations.play('move', 100, false);
		oxygenLevel -= 0.15;
		oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.UP)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		player.body.velocity.y = -150;
		oxygenLevel -= 0.15;
		oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		player.body.velocity.y = 150;
		oxygenLevel -= 0.15;
		oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
	}
	
	mask.y = player.y;

	land.tilePosition.x = -game.camera.x
	land.tilePosition.y = -game.camera.y

	mask.x=player.x;
	mask.y=player.y;

	socket.emit('move player', { x: player.x, y: player.y })

	if (oxygenLevel <= 0 || powerLevel == 0){
		 game.add.text(player.x, player.y, 'You Lose!', {fontSize: '48px', fill: '#F30'});
		 player.kill();
		 game.paused = true;
	}
}

function render () {
}

function checkOverlap(shark, player){
	var boundsA = shark.getBounds();
	var boundsB = player.getBounds();
	return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function OxygenDec() {
	oxygenLevel -= 2;
	oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
}
function PowerDec() {
	powerLevel -= 1;
	powerText.text = 'Power Level: ' + powerLevel + '%';
}

function collectOxygen ( player, oxygen) {
	oxygen.kill();
	oxygenLevel = 100;
	oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
}
function collectPower ( player, power) {
	power.kill();
	powerLevel = 100;
	powerText.text = 'Power Level: ' + powerLevel + '%';
}

function winner(player, treasure){
	endingText = game.add.text(0, 300, 'YOU WIN!', {fontSize: '150px', fill: '#090'} );
	treasure.kill();
	game.paused = true;
}

// Find player by ID
function playerById (id) {
	for (var i = 0; i < allPlayers.length; i++) {
		if (allPlayers[i].player.name === id) {
			return allPlayers[i]
		}
	}

	return false
}