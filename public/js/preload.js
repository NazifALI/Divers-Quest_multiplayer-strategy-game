var preload = function(game){}

preload.prototype = {
	preload: function(){ 
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
		this.game.load.image("gametitle","assets/logo.png");
		this.game.load.image("play","assets/play.png");
		this.game.load.image("gameover","assets/gameover.png");
        this.game.load.image('see', 'assets/sea.jpg')
        this.game.load.image('earth2', 'assets/dark_grass.png')
        this.game.load.image('back','assets/back.png')
        this.game.load.image('treasure', 'assets/treasure.png');
        this.game.load.image('shark', 'assets/shark.png')
        this.game.load.image('oxygen', 'assets/oxygen.png')
        this.game.load.image('wreckage', 'assets/wreckage.png')
		game.load.image('torpedo', 'assets/torpedo.png');
		this.game.load.image('enemy', 'assets/dude.png');
		this.game.load.image('rock', 'assets/Rock.png');
		this.game.load.image('rock2', 'assets/Rock2.png');
        //this.game.load.spritesheet('enemy', 'assets/dude.png', 64, 64)
        this.game.load.spritesheet('dude', 'assets/diversprite.png', 256, 256)
        this.game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64);
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}
