var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
		this.game.add.tileSprite(0,0,1000,1000,'back');
		var gameTitle = this.game.add.sprite(450,160,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(460,320,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("newgame");
	}
}