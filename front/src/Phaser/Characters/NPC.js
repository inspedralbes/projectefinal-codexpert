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

  handleDamage(dir) {
    if (this.healthState === HealthState[1]) {
      return
    }
    this.body.velocity.x = dir.x
    this.body.velocity.y = dir.y

    // this.setTint(0xff0000)

    this.healthState = HealthState[1]
    this.damageTime = 0
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt)

    switch (this.healthState) {
      case HealthState[0]:
        this.body.velocity.x = 0
        this.body.velocity.y = 0
        break

      case HealthState[1]:
        this.damageTime += dt
        if (this.damageTime >= 100) {
          this.healthState = HealthState[0]
          this.setTint(0xffffff)
          this.damageTime = 0
        }
        break
    }
  }
}
