/* global game */

var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY

  this.game = game
  this.health = 3
  this.player = player
  this.alive = true

  this.player = game.add.sprite(x, y, 'enemy')

  this.player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
  this.player.animations.add('stop', [3], 20, true)

  this.player.anchor.setTo(0.5, 0.5)

  this.player.name = index.toString()
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE)
  //this.player.body.immovable = true
  this.player.body.collideWorldBounds = true

  this.player.angle = game.rnd.angle()

  this.lastPosition = { x: x, y: y }
}

RemotePlayer.prototype.update = function () {
 

  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
}

window.RemotePlayer = RemotePlayer
