import * as Phaser from 'phaser'

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.play('fauna-idle-down')
  }
}
