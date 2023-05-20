import * as Phaser from 'phaser'

// 0 --> IDLE
// 1 --> DAMAGE
const HealthState = [0, 1]

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  healthState = HealthState[0]
  damageTime = 0

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.npcTexture = texture

    scene.physics.add.existing(this)
    // scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileColission, this)
    this.body.setSize(this.width * 0.3, this.height * 0.3)
    this.body.offset.y = 22

    this.play(`${this.npcTexture}-idle-down`)
    this.setDepth(0)
  }
}
