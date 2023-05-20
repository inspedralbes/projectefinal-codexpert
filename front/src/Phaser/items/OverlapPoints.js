import * as Phaser from 'phaser'

export default class OverlapPoint extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.play('strawberry-idle-down')
  }
}
