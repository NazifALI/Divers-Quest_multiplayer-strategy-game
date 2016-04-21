
/* global Phaser RemotePlayer io */


var socket // Socket connection

var land
var flashlight;
var explosion;
var wreckage;
var player;
var sharks;
var shark1;
var shark2;
var oxygen;
var treasures;
var treasure;
var torpedoes;
var torpedoPowerUps;
var torpedoCollect;

var allPlayers
//var loop

var torpedoTime = 0;
var ammo = 4;

var currentSpeed = 0
var timer;
var loop;
//var oxygen;
var oxygenText;
var torpedoText;
var treasureText;
var opponentTreasureText;
var endingText;
var treasureFound = 0;
var opponentTreasureFound = 0;
var oxygenLevel = 100;
var cursors

var newGame ={
create:function () {
	socket = io.connect()
	mask = this.game.add.graphics(0,0);
	mask.beginFill(0xffffff);
	
	// Resize our game world to be a 1000 x 1000 square
	// Our tiled scrolling background
	land = this.game.add.tileSprite(0, 0, 1000, 1000, 'back');
	this.game.world.setBounds(0, 0, 2000, 2000);
	land.fixedToCamera = true;

	//timer
	timer = this.game.time.events;
	loop = timer.loop(Phaser.Timer.SECOND*2, OxygenDec, this);


	// The base of our player
	//var startX = Math.round(Math.random() * (1000) + 500)
	//var startY = Math.round(Math.random() * (600) + 400)
	//player = this.game.add.sprite(startX, startY, 'dude')
	player = this.game.add.sprite(100, 950, 'dude')
	player.anchor.setTo(0.5, 0.5)
	this.game.physics.enable(player, Phaser.Physics.ARCADE)
	player.body.collideWorldBounds=true;
	player.scale.setTo(0.4)
	player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7])
	// adding physics to player. This will force it to decelerate and limit its speed
	player.body.drag.x = 100;
	player.body.drag.y = 100;
	player.body.collideWorldBounds = true

	//adding treasure
	treasures = this.game.add.group();
	treasures.enableBody = true;
	treasures.physicsBodyType = Phaser.Physics.ARCADE;
	treasure = treasures.create(950,950,'treasure');
	treasure.anchor.setTo(0.5,0.5);
	treasure.body.immovable = false;
	treasure.scale.setTo(0.4);

	//adding oxygen power up
	oxygenPowerUps = this.game.add.group();
	oxygenPowerUps.enableBody = true;
	oxygenPowerUps.physicsBodyType = Phaser.Physics.ARCADE;
	oxygen = oxygenPowerUps.create(500,450,'oxygen');
	oxygen.anchor.setTo(0.5,0.5);
	oxygen.body.immovable = false;
	oxygen.scale.setTo(0.2);

	// torpedo power up
	torpedoPowerUps = this.game.add.group();
	torpedoPowerUps.enableBody = true;
	torpedoPowerUps.physicsBodyType = Phaser.Physics.ARCADE;
	torpedoCollect = torpedoPowerUps.create(100,800, 'torpedo' );
	torpedoCollect.anchor.setTo(0.5,0.5);
	torpedoCollect.body.immovable = false;
	torpedoCollect.scale.setTo(-0.3, 0.3);

	// adding wreckage
	wreckage = this.game.add.group();
	wreckage.enableBody = true;
	wreckage.physicsBodyType = Phaser.Physics.ARCADE;
	createWreckage();
	// var obstacle = wreckage.create(100,100,'wreckage');
	// var obstacle2 = wreckage.create(100,300, 'wreckage');
	// var obstacle3 = wreckage.create(450,200, 'wreckage')
	// obstacle.anchor.setTo(0.25,0.25);
	// obstacle.body.immovable = true;
	// obstacle2.anchor.setTo(0.25,0.25);
	// obstacle2.body.immovable = true;
	// obstacle3.anchor.setTo(0.25,0.25);
	// obstacle3.body.immovable = true;		
	
	//shark
	sharks = this.game.add.group();
	sharks.enableBody = true;
	sharks.physicsBodyType = Phaser.Physics.ARCADE;
	shark1 = sharks.create(200, 300, 'shark');
	shark1.body.velocity.x = 300;
	shark2 = sharks.create(300, 0, 'shark');
	shark2.body.velocity.y = 500;
	shark2.angle = 90;
	// shark = this.game.add.sprite(400, 500, 'shark');
	// shark.scale.setTo(1);
	// shark.anchor.setTo(0.25);
	// this.game.physics.enable(shark,Phaser.Physics.ARCADE)
	// shark.physicsBodyType = Phaser.Physics.ARCADE;
	// createSharks();

	//shark.body.collideWorldBounds = true;
	//shark.body.gravity.y = -200;
	//shark.body.bounce.set(1);
	
	// adding torpedo
	torpedoes = game.add.group();
	torpedoes.enableBody = true;
	torpedoes.physicsBodyType = Phaser.Physics.ARCADE;
	//torpedoes.createMultiple(30, 'torpedo');
	torpedoes.setAll('anchor.x', 1);
	torpedoes.setAll('anchor.y', 1);
	torpedoes.setAll('outOfBoundsKill', true);
	torpedoes.setAll('checkWorldBounds', true);
	
	//mask all objects
	
	wreckage.mask = mask; // to hide all wreckage
	land.mask=mask;
	treasure.mask = mask;
	sharks.mask = mask;
	oxygenPowerUps.mask = mask;
	torpedoPowerUps.mask = mask;
	torpedoes.mask = mask;
	
	// create player's vision
	mask.drawCircle(0,0,2000);

	// holds other players
	allPlayers = []

	player.bringToTop()

	this.game.camera.follow(player)

	cursors = this.game.input.keyboard.createCursorKeys()

	oxygenText = this.game.add.text(16, 16, 'Oxygen Level: 100%', {fintSize: '32px', fill: '#090'} );
	torpedoText = this.game.add.text(16, 50, 'Torpedoes Left: 4', {fintSize: '32px', fill: '#FF0'} );
	treasureText = this.game.add.text(16, 84, 'Treasures Found: ' + treasureFound + '/3', {fintSize: '32px', fill: '#FF0'} );
	opponentTreasureText = this.game.add.text(16, 118, 'Opponent Treasures: ' + opponentTreasureFound + '/3', {fintSize: '32px', fill: '#FF0'} );
	oxygenText.fixedToCamera=true;
	torpedoText.fixedToCamera=true;
	treasureText.fixedToCamera = true;
	oxygenText.fixedToCamera=true;
	torpedoText.fixedToCamera=true;
	opponentTreasureText.fixedToCamera = true;
	
	// Start listening for events
	setEventHandlers()
},

update: function () {

	this.game.physics.arcade.overlap(player, oxygenPowerUps, collectOxygen, null, this);
	this.game.physics.arcade.overlap(player, torpedoPowerUps, collecttorpedo, null, this);
	this.game.physics.arcade.overlap(player, treasures, winner, null, this);
	this.game.physics.arcade.collide(player, wreckage);
	game.physics.arcade.overlap(torpedoes, wreckage, destroyWreckage, null, this);
	game.physics.arcade.overlap(torpedoes, sharks, destroyShark, null, this);
	game.physics.arcade.overlap(player, sharks, sharkHurts, null, this);

	for (var i = 0; i < allPlayers.length; i++) {
		if (allPlayers[i].alive) {
			allPlayers[i].update();
		}
	}

	// for left and right movement. The nested if statements check if Spacebar is pressed. If so the diver swims faster
	if (cursors.left.isDown) {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			player.body.velocity.x = -200;
			player.scale.x = -0.4;
			player.animations.play('move', 100, false);
			oxygenLevel -= 0.01;
			oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';
		} else {
			player.body.velocity.x = -70;
			player.scale.x = -0.4;
			player.animations.play('move', 10, false);
		}
	} else if (cursors.right.isDown) {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			player.body.velocity.x = 200;
			player.scale.x = 0.4;
			player.animations.play('move', 100, false);
			oxygenLevel -= 0.01;
			oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';
		} else {
			player.body.velocity.x = 70;
			player.scale.x = 0.4;
			player.animations.play('move', 10, false);
		}
	}

	// for up and down movement. The nested if statements check if Spacebar is pressed. If so the diver swims faster
	if (cursors.up.isDown) {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			player.body.velocity.y = -150;
			player.animations.play('move', 100, false);
			oxygenLevel -= 0.01;
			oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';	
		} else {
			player.body.velocity.y = -70;
			player.animations.play('move', 10, false);
		}
	} else if (cursors.down.isDown) {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			player.body.velocity.y = 150;
			player.animations.play('move', 100, false);
			oxygenLevel -= 0.01;
			oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';
		} else{
			player.body.velocity.y= 70;
			player.animations.play('move', 10, false);
		}
	}

	// if left mouse button is pressed
	if(game.input.activePointer.isDown){
		torpedoText.text = 'Torpedoes Left: ' + ammo;
		if(game.time.now > torpedoTime && ammo > 0){
			// create a torpedo and fire in the direction of pointer
			var torpedo = torpedoes.create(0,0,'torpedo');
			torpedo.scale.setTo(-0.3, 0.3);
			torpedo.reset(player.x, player.y);
			torpedo.anchor.setTo(0.5,0.5);
			torpedo.rotation = game.physics.arcade.angleToPointer(torpedo);
			torpedo.body.velocity.x = 200 * Math.cos(torpedo.angle / 180 * Math.PI);
			torpedo.body.velocity.y = 200 * Math.sin(torpedo.angle / 180 * Math.PI);
			torpedoTime = game.time.now + 500;
			ammo -= 1;
		}
	}
	
	// mask changes with position
	if (player.scale.x < 0){
		mask.x = player.x-60;
	} else {
		mask.x = player.x+60;
	}
	mask.y = player.y;

	land.tilePosition.x = -this.game.camera.x
	land.tilePosition.y = -this.game.camera.y

	//mask.x=player.x;
	//mask.y=player.y;

	// check if oxygen level never falls below 0
	if (oxygenLevel <= 0 ){
		 this.game.add.text(game.camera.x +300, game.camera.y + 300, 'You Lose!', {fontSize: '48px', fill: '#F30'});
		 player.kill();
		 this.game.paused = true;
	}
	
	// create shark1's movement
	moveSharks();
	
	// constantly send the player's position
	socket.emit('move player', { x: player.x, y: player.y })
}

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
	
	socket.on('oxygen collected', onOxygenCollected);
	
	socket.on('torpedo collected', onTorpedoCollected);
	
	socket.on('treasure found', onTreasureFound);
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

function onOxygenCollected(data) {//data) {
	console.log("Server has talked back!!");
	oxygen.kill();
	
	// create new oxygen tank
	//>>>> can add time here
	oxygen = oxygenPowerUps.create(data.x,data.y,'oxygen');
	oxygen.anchor.setTo(0.5,0.5);
	oxygen.body.immovable = false;
	oxygen.scale.setTo(0.2);
	
}

function onTorpedoCollected(data) {
	console.log("Server has talked back!!");
	torpedoCollect.kill();
	
	// create new oxygen tank
	//>>>> can add time here
	torpedoCollect = torpedoPowerUps.create(data.x, data.y, 'torpedo' );
	torpedoCollect.anchor.setTo(0.5,0.5);
	torpedoCollect.body.immovable = false;
	torpedoCollect.scale.setTo(-0.3, 0.3);
}

function onTreasureFound(data) {
	console.log("other player has found a treasure " + data.score);
	opponentTreasureFound = data.score;
	opponentTreasureText.text = 'Opponent Treasures: ' + opponentTreasureFound + '/3';
	//treasure.kill();

	if(opponentTreasureFound== 2){
		treasure.kill();
		//this.game.add.text(player.x, player.y, 'You Lose!', {fontSize: '48px', fill: '#F30'});
		endingText = game.add.text((game.camera.x + game.camera.width) / 2, (game.camera.y + game.camera.height) / 2, 'YOU LOSE!', {fontSize: '100px', fill: '#F30'} );
		game.paused = true;
	}
	else if(opponentTreasureFound == 1 && treasureFound < 1){
		//spawn new treasure by simply reseting the coordinates
		treasure.reset(950, 50);
	}
	else if (opponentTreasureFound == 1 && treasureFound == 1) {
		treasure.reset(50, 50);
	}
	
}

function render () {
}


function sharkHurts(player, shark) {
	oxygenLevel -= 0.15;
	oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';
	
	explosion = game.add.sprite(player.x, player.y, 'kaboom');
	explosion.mask = mask;
	explosion.scale.setTo(.5);
	explosion.tint = 0xff0000;
	explosion.animations.add('explode', [21,22,23,24])
	explosion.reset(player.x, player.y);
	explosion.animations.play('explode', 40, false);
}

function OxygenDec() {
	oxygenLevel -= 0.5;
	oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';
}

function collectOxygen ( player, oxygen) {
	console.log("OxygenID: %d", oxygen.ID);
	
	// Send local player data to the game serve
	socket.emit('oxygen collected');
	
	oxygen.kill();
	oxygenLevel = 100;
	oxygenText.text = 'Oxygen Level: ' + Math.round(oxygenLevel * 100) / 100 + '%';
}

function collecttorpedo ( player, torpedoCollect) {
	// let other players know that torpedo has been collected
	socket.emit('torpedo collected');
	
	torpedoCollect.kill();
	ammo += 2;
	torpedoText.text = 'Torpedoes Left: ' + ammo;
}

function winner(player, treasure){
	treasureFound += 1;
	
	//let server know that the treasure has been found
	socket.emit('treasure found', {score: treasureFound} );
	
	treasureText.text =  'Treasures Found: ' + treasureFound + '/3';
	
	if(treasureFound == 2){
		treasure.kill();
		endingText = game.add.text(game.camera.x + 300, game.camera.y +300, 'YOU WIN!', {fontSize: '48px', fill: '#090'} );
		game.paused = true;
	}
	else if(treasureFound == 1 && opponentTreasureFound < 1){
		//spawn new treasure by simply reseting the coordinates
		treasure.reset(950, 50);
	}
	else if(treasureFound == 1 && opponentTreasureFound == 1){
		//spawn new treasure by simply reseting the coordinates
		treasure.reset(50, 50);
	}
}

function destroyWreckage( torpedo, obstacle){
	console.log(torpedo.x);
	console.log(torpedo.y);
	torpedo.kill();
	obstacle.kill();
	
	//adding explosion
	explosion = game.add.sprite(player.x, player.y, 'kaboom');
	explosion.scale.setTo(2);
	explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
	explosion.reset(obstacle.x, obstacle.y);
	explosion.animations.play('explode', 30, false);
}

function destroyShark( torpedo, shark){
	console.log(torpedo.x);
	console.log(torpedo.y);
	torpedo.kill();
	shark.kill();
	
	//adding explosion
	explosion = game.add.sprite(player.x, player.y, 'kaboom');
	explosion.anchor.setTo(0.5);
	explosion.scale.setTo(2);
	explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	explosion.reset(shark.x, shark.y);
	explosion.animations.play('explode', 30, false);
}

function createWreckage() {
	// wreckage beside first treasure
	for(var x=0; x < 4; x++) {
		var obstacle = wreckage.create( 950 - 70*x , 750, 'wreckage');
		obstacle.anchor.setTo(0.25,0.25);
		obstacle.body.immovable = true;
	}
	for(var y=0; y < 3; y++) {
		var obstacle = wreckage.create( 800, 950 - 70*y, 'wreckage');
		obstacle.anchor.setTo(0.25,0.25);
		obstacle.body.immovable = true;
	}
	// create wreckage randomly on map within the 700 by 700 box
	for( var i=0; i<60; i++) {
		var X = 2000;
		var Y = 200;
		var size = 1;
		var obstacle;
		
		while (X > 1400) {
			X = Math.round(Math.random()*2000);
		}
		while (Y > 2000 || Y < 600) {
			Y = Math.round(Math.random()*2000);
		}
		// create rocks of different sizes
		while (size > 0.1 || size < 0.07) {
			size = Math.random();
		}
		console.log(size);
		if( Math.round(Math.random()) ) {
			obstacle = wreckage.create( X, Y, 'rock');
		} else {
			obstacle = wreckage.create( X, Y, 'rock2');
		}
		obstacle.scale.setTo(size);
		obstacle.anchor.setTo(0.5);
		obstacle.body.immovable = true;
	}	
}

function moveSharks() {
	if (shark1.x < 200) {
		shark1.x = 205;
		shark1.body.velocity.x *= -1;
		shark1.scale.x *= -1;
	}
	if (shark1.x > 1000) {
		shark1.x = 990;
		shark1.body.velocity.x *= -1;
		shark1.scale.x *= -1;
	}
	
	if(shark2.y > 1000) {
		shark2.y = 990;
		shark2.body.velocity.y *= -1;
		shark2.angle = -90;
	}
	if(shark2.y < 0) {
		shark2.y = 10;
		shark2.body.velocity.y *= -1;
		shark2.angle = 90;
	}
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