var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameDiv');
//var game = new Phaser.Game(800, 600, Phaser.CANVAS, {preload: preload, create: create, update: update} );

var oceanfloor;
var flashlight;
var explosion;
var diver;
var wreckage;

var oxygenLevel = 100;
var oxygenText;
var endingText;


var mainState = {
	preload:function(){
		game.load.image('backgroundCode', 'assets/background.png');
		game.load.image('diverCode', 'assets/diver.jpg');
		game.load.image('wreckageCode', 'assets/wreckage.png');
		game.load.image('treasure', 'assets/treasure.png');
		game.load.image('oxygen', 'assets/oxygen.png');
		game.load.spritesheet('kaboomCode', 'assets/explosion.png', 64, 64);
	},
	
	create:function(){
		mask = game.add.graphics(0,0);
		mask.beginFill(0xffffff);
		
		// adding 
		oceanfloor = game.add.tileSprite(0,0,800,600, 'backgroundCode');
		
		//adding treasure
		treasures = game.add.group();
		treasures.enableBody = true;
		treasures.physicsBodyType = Phaser.Physics.ARCADE;
		var treasure = treasures.create(400,500,'treasure');
		treasure.anchor.setTo(0.5,0.5);
		treasure.body.immovable = false;
		treasure.scale.x = 0.4;
		treasure.scale.y = 0.4;
		
		// adding oxygen power up
		oxygenPowerUps = game.add.group();
		oxygenPowerUps.enableBody = true;
		oxygenPowerUps.physicsBodyType = Phaser.Physics.ARCADE;
		var oxygen = oxygenPowerUps.create(500,300,'oxygen');
		oxygen.anchor.setTo(0.5,0.5);
		oxygen.body.immovable = false;
		oxygen.scale.x = 0.2;
		oxygen.scale.y = 0.2;
		
		// adding wreckage
		wreckage = game.add.group();
		wreckage.enableBody = true;
		wreckage.physicsBodyType = Phaser.Physics.ARCADE;
		var obstacle = wreckage.create(100,100,'wreckageCode');
		obstacle.anchor.setTo(0.5,0.5);
		obstacle.body.immovable = true;
		
		obstacle.mask=mask;
		oceanfloor.mask = mask;
		treasures.mask = mask;
		oxygenPowerUps.mask = mask;
		
		// make vision
		mask.drawCircle(0,0,120);
		
		// adding diver's movement
		diver = game.add.sprite( game.world.centerX, game.world.centerY, 'diverCode');
		diver.anchor.setTo(0.5, 0.5);
		diver.scale.setTo(0.15, 0.15);
		game.physics.enable(diver, Phaser.Physics.ARCADE);
		diver.body.drag.x = 100;
		diver.body.drag.y = 100;
		diver.body.collideWorldBounds = true;
		
		// bomb explosion
		explosion = game.add.sprite(diver.x, diver.y, 'kaboomCode');
		explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
		
		oxygenText = game.add.text(16, 16, 'Oxygen Level 100%', {fintSize: '32px', fill: '#090'} );
	},
	
	update:function(){
		game.physics.arcade.overlap(diver, oxygenPowerUps, collectOxygen, null, this);
		game.physics.arcade.overlap(diver, treasures, winner, null, this);
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.B)){
			explosion.reset(diver.x-100, diver.y-50);
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
		mask.x = diver.x;
		mask.y = diver.y;
		//game.physics.arcade.overlap(diver, wreckage, diverHitWreckage, null, this);
		game.physics.arcade.collide(diver, wreckage);
	}
}

// function diverHitWreckage(diver, obstacle){
	// //obstacle.kill();
	// //diver.velocity.
// }

function collectOxygen ( diver, oxygen) {
	oxygen.kill();
	oxygenLevel += 30;
	oxygenText.text = 'Oxygen Level: ' + oxygenLevel + '%';
}

function winner(diver, treasure){
	endingText = game.add.text(400, 300, 'YOU WIN!', {fintSize: '40px', fill: '#090'} );
	//game.world.bringToTop(mask);
}

game.state.add('mainState', mainState);
game.state.start('mainState');
