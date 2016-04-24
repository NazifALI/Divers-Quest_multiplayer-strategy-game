/* global game */

var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY
 // mask = game.add.graphics(0,0);
 // mask.beginFill(0xffffff);
  this.game = game
  this.health = 3
  this.player = player
  this.alive = true
  
  this.player = game.add.sprite(x, y,'dude');
  this.player.anchor.setTo(0.5, 0.5)
  this.player.scale.setTo(0.4);

  this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7])
 // this.player.animations.add('stop', [3], 20, true)

  this.player.anchor.setTo(0.5, 0.5)

  this.player.name = index.toString()
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE)
  //this.player.body.immovable = true
  this.player.body.collideWorldBounds = true
  this.player.mask=mask; 
  //this.player.angle = game.rnd.angle()

  this.lastPosition = { x: x, y: y }
}

RemotePlayer.prototype.update = function () {
  if (this.lastPosition.x != this.player.x || this.lastPosition.y != this.player.y)
  {
	  this.player.play('move',100,false);
  }	  

  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
  mask.x=this.player.x;
  mask.y=this.player.y;
}

window.RemotePlayer = RemotePlayer
