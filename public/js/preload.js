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
		this.game.load.image('torpedo', 'assets/torpedo.png');
		this.game.load.image('enemy', 'assets/dude.png');
		this.game.load.image('rock', 'assets/Rock.png');
		this.game.load.image('rock2', 'assets/Rock2.png');
		this.game.load.image('instruction', 'assets/button.png');
		this.game.load.image('arrow', 'assets/arrow.png');
		this.game.load.image('backButton', 'assets/backButton.png');
		this.game.load.image('leftmouse','assets/leftmouse.png')
		this.game.load.image('spacebar','assets/spacebar.png')
        this.game.load.spritesheet('dude', 'assets/diversprite.png', 256, 256);
        this.game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64);
        this.game.load.audio('song', ['assets/audio/ComeAndFindMeBMix.mp3', 'assets/audio/ComeAndFindMeBMix.ogg']);
        this.game.load.audio('o2music', ['assets/audio/o2powerup.mp3', 'assets/audio/o2powerup.ogg']);
        this.game.load.audio('explosionSound', ['assets/audio/explosion.mp3', 'assets/audio/explosion.ogg']);
        this.game.load.audio('pain', ['assets/audio/pain.mp3', 'assets/audio/pain.ogg']);
        this.game.load.audio('punch', ['assets/audio/punch.mp3', 'assets/audio/punch.ogg']);
        this.game.load.audio('empty', ['assets/audio/empty.mp3', 'assets/audio/empty.ogg']);
        this.game.load.audio('heartbeat', ['assets/audio/heartbeat.mp3', 'assets/audio/heartbeat.ogg']);
        this.game.load.audio('gunReload', ['assets/audio/gunReload.mp3', 'assets/audio/gunReload.ogg']);
        this.game.load.audio('treasureCollect', ['assets/audio/treasureCollect.mp3', 'assets/audio/treasureCollect.ogg']);

	},
  	create: function(){
		this.game.state.start("GameTitle");
	}
}
