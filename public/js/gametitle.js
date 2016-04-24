var gameTitle = function(game){}

gameTitle.prototype = {
  	create: function(){
		var gameTitle;
		var playButton;
		var instruction;
		this.game.add.tileSprite(0,0,1000,1000,'back');
		gameTitle = this.game.add.sprite(game.world.centerX, game.world.centerY - 150,"gametitle");
		playButton = this.game.add.button(game.world.centerX, game.world.centerY + 30,"play",this.playTheGame,this);
		instruction = this.game.add.button(game.world.centerX, game.world.centerY + 90,"instruction", this.showInstructions, this);
		//var back = this.game.add.button();
		gameTitle.anchor.setTo(0.5,0.5);
		playButton.anchor.setTo(0.5,0.5);
		instruction.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("newgame");
	},
	
	showInstructions:function(){
		this.game.state.start("instruction");
	}
}