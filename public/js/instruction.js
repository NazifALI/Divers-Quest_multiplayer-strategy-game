var instruction = function(game){}

instruction.prototype= {
	create :function(){
		
		this.game.add.tileSprite(0,0,1000,1000,'back');
		var text1 = this.game.add.text(340, 10, 'INSTRUCTIONS', {fintSize: '40px', fill: '#FF0'});
		var leftArrow =this.game.add.sprite(360,150, "arrow");
		leftArrow.anchor.setTo(0.5);
		leftArrow.scale.setTo(0.4,0.4);
		var textLeft = this.game.add.text(450, 150, 'move right', {fintSize: '20px', fill: '#FF0'});
		textLeft.anchor.setTo(0.5);
		var rightArrow =this.game.add.sprite(360,100, "arrow");
		rightArrow.anchor.setTo(0.5);
		rightArrow.scale.setTo(-0.4,0.4);
		var textRight = this.game.add.text(450, 100, 'move left', {fintSize: '20px', fill: '#FF0'});
		textRight.anchor.setTo(0.5);
		var downArrow =this.game.add.sprite(360,250, "arrow");
		downArrow.anchor.setTo(0.5);
		downArrow.scale.setTo(0.4,0.4);
		downArrow.angle=90;
		var textDown = this.game.add.text(452, 250, 'move down', {fintSize: '20px', fill: '#FF0'});
		textDown.anchor.setTo(0.5);
		var upArrow =this.game.add.sprite(360,200, "arrow");
		upArrow.anchor.setTo(0.5);
		upArrow.scale.setTo(0.4,0.4);
		upArrow.angle= -90;
		var textUp = this.game.add.text(452, 200, 'move up', {fintSize: '20px', fill: '#FF0'});
		textUp.anchor.setTo(0.5);
		
		var mouse= this.game.add.sprite(520, 330, 'leftmouse');
		mouse.anchor.setTo(0.5);
		mouse.scale.setTo(0.4);
		var textMouse = this.game.add.text(520, 380, 'fire torpedoes', {fintSize: '20px', fill: '#FF0'});
		textMouse.anchor.setTo(0.5);
		
		var bar= this.game.add.sprite(300, 330, 'spacebar');
		bar.anchor.setTo(0.5);
	    bar.scale.setTo(0.5);
		var textBar = this.game.add.text(300, 380, 'swim faster', {fintSize: '20px', fill: '#FF0'});
		textBar.anchor.setTo(0.5);
		
		this.game.add.button(10, 500, "backButton",this.backButton, this);
	},
	backButton:function(){
		this.game.state.start("GameTitle");
	}
}