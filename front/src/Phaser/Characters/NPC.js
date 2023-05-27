import * as Phaser from 'phaser'

// 0 --> IDLE
// 1 --> MOVING
const STATE = [0, 1]

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  state = STATE[0]
  movingTime = 0
  scene

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)
    this.scene = scene

    this.npcTexture = texture

    this.scene.physics.add.existing(this)
    this.body.setSize(this.width * 0.3, this.height * 0.3)
    this.body.offset.y = 22

    this.play(`${this.npcTexture}-idle-down`)
    this.setDepth(0)
  }

  handleDamage(dir) {
    if (this.state === STATE[1]) {
      return
    }
    this.body.velocity.x = dir.x
    this.body.velocity.y = dir.y

    this.state = STATE[1]
    this.damageTime = 0
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt)

    switch (this.state) {
      case STATE[0]:
        this.body.velocity.x = 0
        this.body.velocity.y = 0
        break

      case STATE[1]:
        this.movingTime += dt
        if (this.movingTime >= 25) {
          this.state = STATE[0]
          this.setTint(0xffffff)
          this.movingTime = 0
        }
        break
    }
  }
}
