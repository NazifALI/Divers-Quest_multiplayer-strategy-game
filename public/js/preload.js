var preload = function(game){}

preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(160,240,"loading");
          loadingBar.anchor.setTo(0.5,0.5);
          this.load.setPreloadSprite(loadingBar);
		this.game.load.spritesheet("numbers","assets/numbers.png",100,100);
		this.game.load.image("gametitle","assets/logo.png");
		this.game.load.image("play","assets/play.png");
		this.game.load.image("higher","assets/higher.png");
		this.game.load.image("lower","assets/lower.png");
		this.game.load.image("gameover","assets/gameover.png");
		this.game.load.image('earth', 'assets/light_sand.png')
        this.game.load.image('see', 'assets/sea.jpg')
        this.game.load.image('earth2', 'assets/dark_grass.png')
        this.game.load.image('back','assets/back.png')
        this.game.load.image('treasure', 'assets/treasure.png');
        this.game.load.image('shark', 'assets/shark.png')
        this.game.load.image('oxygen', 'assets/oxygen.png')
        this.game.load.image('wreckageCode', 'assets/Wreckage.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 64, 64)
        this.game.load.spritesheet('enemy', 'assets/dude.png', 64, 64)
        this.game.load.spritesheet('kaboomCode', 'assets/explosion.png', 64, 64);
		
	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}