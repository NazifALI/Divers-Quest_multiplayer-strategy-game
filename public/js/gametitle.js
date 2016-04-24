var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
		this.game.add.tileSprite(0,0,1000,1000,'back');
		var gameTitle = this.game.add.sprite(450,160,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(440,320,"play",this.playTheGame,this);
		var instruction = this.game.add.button(400, 350,"instruction", this.showInstructions, this);
		//var back = this.game.add.button();
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("newgame");
	},
	
	showInstructions:function(){
		this.game.state.start("instruction");
	}
}