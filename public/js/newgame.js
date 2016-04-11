/* global Phaser RemotePlayer io */

var socket // Socket connection

var land
var flashlight;
var explosion;
var wreckage;
var player

var enemies
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

var newGame= {   
  create: function () {
  socket = io.connect()
  mask = this.game.add.graphics(0,0);
  mask.beginFill(0xffffff)
 
  // Resize our game world to be a 2000 x 2000 square
 

  // Our tiled scrolling background
  land = this.game.add.tileSprite(0, 0, 1000, 1000, 'back')
  this.game.world.setBounds(0, 0, 1000, 1000)
  land.fixedToCamera = true
 // land.mask=mask;
  
  //timer
  timer = this.game.time.events;
  loop = timer.loop(Phaser.Timer.SECOND, OxygenDec, this);
  loop = timer.loop(Phaser.Timer.SECOND, PowerDec, this);
  
  // The base of our player
  var startX = Math.round(Math.random() * (1000) + 500)
  var startY = Math.round(Math.random() * (600) + 400)
  player = this.game.add.sprite(startX, startY, 'dude')
  player.anchor.setTo(0.5, 0.5)
  this.game.physics.enable(player, Phaser.Physics.ARCADE)
  player.body.collideWorldBounds=true;

  //adding treasure
	treasures = this.game.add.group();
	treasures.enableBody = true;
	treasures.physicsBodyType = Phaser.Physics.ARCADE;
	var treasure = treasures.create(200,100,'treasure');
	treasure.anchor.setTo(0.5,0.5);
	treasure.body.immovable = false;
	treasure.scale.x = 0.4;
	treasure.scale.y = 0.4;
	
 // adding oxygen power up
		oxygenPowerUps = this.game.add.group();
		oxygenPowerUps.enableBody = true;
		oxygenPowerUps.physicsBodyType = Phaser.Physics.ARCADE;
		var oxygen = oxygenPowerUps.create(500,450,'oxygen');
		oxygen.anchor.setTo(0.5,0.5);
		oxygen.body.immovable = false;
		oxygen.scale.x = 0.2;
		oxygen.scale.y = 0.2;
  //shark1
  shark = this.game.add.sprite(250, 500, 'shark');
		shark.anchor.setTo(0.5);
		shark.scale.setTo(1.5,1.4);
		this.game.physics.enable([shark],Phaser.Physics.ARCADE)
		shark.physicsBodyType = Phaser.Physics.ARCADE;

	    shark.body.collideWorldBounds = true;
	    shark.body.gravity.y = -200;
	    shark.body.bounce.set(1,1);
		//shark.mask = mask;

  // adding wreckage
		wreckage = this.game.add.group();
		wreckage.enableBody = true;
		wreckage.physicsBodyType = Phaser.Physics.ARCADE;
		var obstacle = wreckage.create(100,100,'wreckageCode');
		var obstacle2 = wreckage.create(100,300, 'wreckageCode');
		var obstacle3 = wreckage.create(450,200, 'wreckageCode')
		var obstacle4 = wreckage.create(450,250, 'wreckageCode')
		var obstacle5 = wreckage.create(450,10, 'wreckageCode')
		obstacle.anchor.setTo(0.5,0.5);
		obstacle.body.immovable = true;
		obstacle2.anchor.setTo(0.5,0.5);
		obstacle2.body.immovable = true;
		obstacle3.anchor.setTo(0.5,0.5);
		obstacle3.body.immovable = true;		
		obstacle4.body.immovable= true;
		obstacle5.body.immovable = true;
  // treasures.mask= mask;
   mask.drawCircle(0,0,120)
  
  this.game.physics.enable(player, Phaser.Physics.ARCADE)
  // This will force it to decelerate and limit its speed
  player.body.drag.x= 100;
  player.body.drag.y= 100;
  
  player.body.collideWorldBounds = true

  // Create some baddies to waste :)
  enemies = []

  player.bringToTop()

  this.game.camera.follow(player)
  cursors = this.game.input.keyboard.createCursorKeys()

  oxygenText = this.game.add.text(16, 16, 'Oxygen Level: 100%', {fintSize: '32px', fill: '#090'} );
		powerText = this.game.add.text(16, 50, 'Power Level: 100%', {fintSize: '32px', fill: '#FF0'} );
	oxygenText.fixedToCamera=true;
   powerText.fixedToCamera=true;	
  // Start listening for events
 setEventHandlers()
},

  update: function() {
	this.game.physics.arcade.overlap(player, oxygenPowerUps, collectOxygen, null, this);
	//game.physics.arcade.overlap(player, powerPowerUp, collectPower, null, this);
	this.game.physics.arcade.overlap(player, treasures, winner, null, this);
	this.game.physics.arcade.collide(player, wreckage);

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
    }
  }
  if(oxygenLevel <= 0){
			timer.pause;
			endingText = this.game.add.text(player.x, player.y, 'YOU LOSE!', {fontSize: '130px', fill: '#090'} );
			endingText.anchor.setTo(0.5,0.5);
			this.game.paused = true;
			//this.game.state.start("GameOver",true,false);
		}

  if (this.game.input.keyboard.isDown(Phaser.Keyboard.B)){
			// add explosion
			if( player.scale.x > 0 ) {
				explosion = this.game.add.sprite(player.x-100, player.y-50, 'kaboomCode');
			} else {
				explosion = this.game.add.sprite(player.x+30, player.y-50, 'kaboomCode');
			}
			explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
			explosion.animations.play('explode', 40, false);
		} 		
  if (cursors.left.isDown) {
    player.angle -= 4
	player.body.velocity.x = -70;
  } else if (cursors.right.isDown) {
    player.angle += 4
	player.body.velocity.x = 70;
  }

  if (cursors.up.isDown) {
    // The speed we'll travel at
    currentSpeed = 300
	player.body.velocity.y = -70;
  } else {
    if (cursors.down.isDown) {
      currentSpeed -= 4
	  player.body.velocity.y= 70;
    }
  }

  land.tilePosition.x = -this.game.camera.x
  land.tilePosition.y = -this.game.camera.y

  mask.x=player.x;
  mask.y=player.y;

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
}


function onUpdateState(data)
{
	this.game= data;
}

// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')

  // Reset enemies on reconnect
  enemies.forEach(function (enemy) {
    enemy.player.kill()
  })
  enemies = []

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
  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y))
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
  enemies.splice(enemies.indexOf(removePlayer), 1)
}


function render () {
}

function checkOverlap(shark, diver){
	var boundsA = shark.getBounds();
	var boundsB = diver.getBounds();
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

function collectOxygen ( diver, oxygen) {
	oxygen.kill();
	oxygenLevel = 100;
	oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
}
function collectPower ( diver, power) {
	power.kill();
	powerLevel = 100;
	powerText.text = 'Power Level: ' + powerLevel + '%';
}

function winner(diver, treasure){
	endingText = game.add.text(0, 300, 'YOU WIN!', {fontSize: '150px', fill: '#090'} );
	game.paused = true;
	}

// Find player by ID
function playerById (id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i]
    }
  }

  return false
}