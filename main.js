var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameDiv');
//var game = new Phaser.Game(800, 600, Phaser.CANVAS, {preload: preload, create: create, update: update} );

var oceanfloor;
var flashlight;
var explosion;
var diver;

var mainState = {
	preload:function(){
		game.load.image('background', "assets/background.png");
		game.load.image('diver', 'assets/diver.jpg');
		game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64);
	},
	
	create:function(){
		// adding backgound image
		oceanfloor = game.add.tileSprite(0,0,800,600, 'background');
		
		// adding diver's movement
		diver = game.add.sprite( game.world.centerX, game.world.centerY, 'diver');
		diver.anchor.setTo(0.5, 0.5);
		diver.scale.setTo(0.15, 0.15);
		game.physics.enable(diver, Phaser.Physics.ARCADE);
		diver.body.drag.x = 100;
		diver.body.drag.y = 100;
		
		// bomb explosion
		explosion = game.add.sprite(diver.x, diver.y, 'kaboom');
		explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
	},
	
	update:function(){
		if (game.input.keyboard.isDown(Phaser.Keyboard.B)){
			explosion.reset(diver.x-200, diver.y+200);
			explosion.animations.play('explode', 40, false);
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			diver.body.velocity.x = -70;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			diver.body.velocity.x = 70;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			diver.body.velocity.y = -70;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			diver.body.velocity.y = 70
		}
	}
}

game.state.add('mainState', mainState);
game.state.start('mainState');
