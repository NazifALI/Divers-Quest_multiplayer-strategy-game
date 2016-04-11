var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'gameDiv');
//var game = new Phaser.Game(800, 600, Phaser.CANVAS, {preload: preload, create: create, update: update} );

var oceanfloor;
var flashlight;
var explosion;
var diver;
var wreckage;
var shark;
var shark2;
var text;

var timer;
var loop;
var oxygenLevel = 100;
var oxygenText;
var powerLevel = 100;
var powerText;
var endingText;


var mainState = {
	preload:function(){
		game.load.image('backgroundCode', 'assets/background.png');
		game.load.image('diverCode', 'assets/diver.jpg');
		game.load.image('wreckageCode', 'assets/wreckage.png');
		game.load.image('treasure', 'assets/treasure.png');
		game.load.image('oxygen', 'assets/oxygen.png');
		game.load.spritesheet('kaboomCode', 'assets/explosion.png', 64, 64);
		game.load.image('shark', 'assets/Shark.png');
		game.load.image('shark2', 'assets/Shark.png');
		game.load.image('power', 'assets/Power.png');
	},
	
	create:function(){
		mask = game.add.graphics(0,0);
		mask.beginFill(0xffffff);
		
		// timer
		timer = game.time.events;
		loop = timer.loop(Phaser.Timer.SECOND, OxygenDec, this);
		loop = timer.loop(Phaser.Timer.SECOND, PowerDec, this);

		// adding 
		oceanfloor = game.add.tileSprite(0,0,1200,800, 'backgroundCode');
		
		//adding treasure
		treasures = game.add.group();
		treasures.enableBody = true;
		treasures.physicsBodyType = Phaser.Physics.ARCADE;
		var treasure = treasures.create(game.rnd.integerInRange(0, 800),game.rnd.integerInRange(10, 600),'treasure');
		treasure.anchor.setTo(0.5,0.5);
		treasure.body.immovable = false;
		treasure.scale.x = 0.4;
		treasure.scale.y = 0.4;
		
		// adding oxygen power up
		oxygenPowerUps = game.add.group();
		oxygenPowerUps.enableBody = true;
		oxygenPowerUps.physicsBodyType = Phaser.Physics.ARCADE;
		var oxygen = oxygenPowerUps.create(game.rnd.integerInRange(0, 1200),game.rnd.integerInRange(450, 780),'oxygen');
		oxygen.anchor.setTo(0.5,0.5);
		oxygen.body.immovable = false;
		oxygen.scale.x = 0.2;
		oxygen.scale.y = 0.2;
		
		//power power up
		powerPowerUp = game.add.group();
		powerPowerUp.enableBody = true;
		powerPowerUp.physicsBodyType = Phaser.Physics.ARCADE;
		var power = powerPowerUp.create(game.rnd.integerInRange(0, 1200),game.rnd.integerInRange(450, 780),'power');
		power.anchor.setTo(0.5);
		power.body.immovable = false;
		power.scale.x = .2;
		power.scale.y = .2;
		
		// adding wreckage
		wreckage = game.add.group();
		wreckage.enableBody = true;
		wreckage.physicsBodyType = Phaser.Physics.ARCADE;
		var obstacle = wreckage.create(100,100,'wreckageCode');
		var obstacle2 = wreckage.create(100,300, 'wreckageCode');
		var obstacle3 = wreckage.create(450,200, 'wreckageCode')
		obstacle.anchor.setTo(0.5,0.5);
		obstacle.body.immovable = true;
		obstacle2.anchor.setTo(0.5,0.5);
		obstacle2.body.immovable = true;
		obstacle3.anchor.setTo(0.5,0.5);
		obstacle3.body.immovable = true;
		
		obstacle.mask=mask;
		obstacle2.mask=mask;
		obstacle3.mask=mask;
		oceanfloor.mask = mask;
		treasures.mask = mask;
		oxygenPowerUps.mask = mask;
		powerPowerUp.mask = mask;
		
		// make vision
		mask.drawCircle(0,0,200);
		
		
		// adding diver's movement
		diver = game.add.sprite( game.world.centerX+550, game.world.centerY-380, 'diverCode');
		diver.anchor.setTo(0.5, 0.5);
		diver.scale.setTo(0.15, 0.15);
		game.physics.enable(diver, Phaser.Physics.ARCADE);
		diver.body.drag.x = 100;
		diver.body.drag.y = 100;
		diver.body.collideWorldBounds = true;

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 0;

		// shark 1
		shark = game.add.sprite(game.rnd.integerInRange(0,900), 500, 'shark');
		shark.anchor.setTo(0.5);
		shark.scale.setTo(.17);
		
		game.physics.enable([ shark], Phaser.Physics.ARCADE);

	    shark.body.collideWorldBounds = true;
	    shark.body.gravity.y = -200;
	    shark.body.bounce.set(1);
		shark.mask = mask;
		
		// shark 2
		shark2 = game.add.sprite(game.rnd.integerInRange(0, 800), 600, 'shark');
		shark2.anchor.setTo(-1*game.rnd.integerInRange(25, 80)/100);
		shark2.scale.setTo(.17);
		
		game.physics.enable([ shark2], Phaser.Physics.ARCADE);
		shark2.pivot.x = 100;
	    shark2.body.collideWorldBounds = true;
	    //shark2.body.gravity.x = -200;
	    //shark2.body.bounce.set(1);
		shark2.mask = mask;
		
		// sharks = game.add.group();
		// sharks.enableBody = true;
		// sharks.physicsBodyType = Phaser.Physics.ARCADE;
		// sharks.setALL("collideWorldBounds");
		// var shark = sharks.create(100,200,'treasure');
		// shark.anchor.setTo(0.5,0.5);
		// shark.body.immovable = false;
		// shark.scale.x = 0.4;
		// shark.scale.y = 0.4;
		
	   // shark.mask = mask;

		// bomb explosion
		//explosion = game.add.sprite(diver.x, diver.y, 'kaboomCode');
		//explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
		
		oxygenText = game.add.text(16, 16, 'Oxygen Level: 100%', {fintSize: '32px', fill: '#090'} );
		powerText = game.add.text(16, 50, 'Power Level: 100%', {fintSize: '32px', fill: '#FF0'} );

		//text = game.add.text(16, 16, 'Overlapping: false', { fill: '#ffffff' });
	},
	
	update:function(){
		game.physics.arcade.overlap(diver, oxygenPowerUps, collectOxygen, null, this);
		game.physics.arcade.overlap(diver, powerPowerUp, collectPower, null, this);
		game.physics.arcade.overlap(diver, treasures, winner, null, this);
		
		if(oxygenLevel <= 0){
			timer.pause;
			endingText = game.add.text(0, 300, 'YOU LOSE!', {fontSize: '130px', fill: '#090'} );
			game.paused = true;
		}
		
		/*if (powerLevel < 90 ){
			
			mask.drawCircle(0,0,0);
			
		}*/

		if (game.input.keyboard.isDown(Phaser.Keyboard.B)){
			// add explosion
			if( diver.scale.x > 0 ) {
				explosion = game.add.sprite(diver.x-100, diver.y-50, 'kaboomCode');
			} else {
				explosion = game.add.sprite(diver.x+30, diver.y-50, 'kaboomCode');
			}
			explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
			explosion.animations.play('explode', 40, false);
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			diver.body.velocity.x = -70;
			diver.scale.x = 0.15;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			diver.body.velocity.x = 70;
			diver.scale.x = -0.15;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			diver.body.velocity.y = -70;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			diver.body.velocity.y = 70
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			diver.body.velocity.x = -200;
			diver.scale.x = 0.15;
			oxygenLevel -= .15;
			oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			diver.body.velocity.x = 200;
			diver.scale.x = -0.15;
			oxygenLevel -= .15;
			oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			diver.body.velocity.y = -150;
			oxygenLevel -= .15;
			oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)&&game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			diver.body.velocity.y = 150;
			oxygenLevel -= .15;
			oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
		}
		if( diver.scale.x > 0){
			mask.x = diver.x-50;
		} else {
			mask.x = diver.x+50;
		}
		mask.y = diver.y;
		//game.physics.arcade.overlap(diver, wreckage, diverHitWreckage, null, this);
		game.physics.arcade.collide(diver, wreckage);

		if (checkOverlap(shark, diver)){
			oxygenLevel -= .25;
			oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
		}
		else{
			null;
		}
		if (checkOverlap(shark2, diver)){
			oxygenLevel -= .25;
			oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
		}
		else{
			null;
		}
		
		shark2.rotation -=0.05;
	}
}

// function diverHitWreckage(diver, obstacle){
	// //obstacle.kill();
	// //diver.velocity.
// }

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

game.state.add('mainState', mainState);
game.state.start('mainState');