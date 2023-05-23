import * as Phaser from 'phaser'

// 0 --> IDLE
// 1 --> DAMAGE
const STATE = [0, 1]

// 0 --> Back
// 1 --> Front
// 2 --> Left
// 3 --> Right
const movements = [0, 1, 2, 3]
export default class Mob extends Phaser.Physics.Arcade.Sprite {
  direction = movements[3]
  moveEvent
  mobTexture
  timeWithoutSleeping
  canSleep = true
  state = STATE[0]
  movingTime = 0

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.mobTexture = texture

    scene.physics.add.existing(this)
    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileColission, this)
    this.body.setSize(this.width * 0.7, this.height * 0.7)
    this.body.offset.y = 5

    this.play(`${this.mobTexture}-sleep`)

    this.moveEvent = scene.time.addEvent({
      delay: Math.random() * 4000 + 1500,
      callback: () => {
        this.direction = this.randomDirection(this.direction)
        if (!this.canSleep) {
          this.timeWithoutSleeping++
        }
      },
      loop: true
    })
  }

  randomDirection() {
    let newDirection = Phaser.Math.Between(0, movements.length + 1)

    while (newDirection === this.direction) {
      newDirection = Phaser.Math.Between(0, movements.length + 1)
    }

    return newDirection
  }

  destroy(fromScene) {
    this.moveEvent.destroy()

    super.destroy(fromScene)
  }

  handleTileColission(go, tile) {
    if (go !== this) {
      return
    }
    this.direction = this.randomDirection(this.direction)
  }

  handleDamage(dir) {
    if (this.state === STATE[1]) {
      return
    }
    if (this.anims.currentAnim.key === `${this.mobTexture}-sleep`) {
      this.direction = this.randomDirection(this.direction)
    }
    this.body.velocity.x = dir.x
    this.body.velocity.y = dir.y

    this.state = STATE[1]
    this.damageTime = 0
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt)

    const speed = 20
    if (!(this.direction > 3)) {
      this.moveEvent.delay = Math.random() * 4000 + 1500
    }

    if (this.timeWithoutSleeping > 10) {
      this.canSleep = true
    }

    switch (this.state) {
      case STATE[0]:
        this.body.velocity.x = 0
        this.body.velocity.y = 0
        break

      case STATE[1]:
        this.movingTime += dt
        if (this.movingTime >= 100) {
          this.state = STATE[0]
          this.setTint(0xffffff)
          this.movingTime = 0
        }
        break
    }

    switch (this.direction) {
      case movements[0]:
        this.anims.play(`${this.mobTexture}-walk-back`, true)
        this.body.velocity.x = 0
        this.body.velocity.y = -speed
        this.body.offset.y = 6
        break

      case movements[1]:
        this.anims.play(`${this.mobTexture}-walk-front`, true)
        this.body.velocity.x = 0
        this.body.velocity.y = speed
        this.body.offset.y = 6
        break

      case movements[2]:
        this.anims.play(`${this.mobTexture}-walk-left`, true)
        this.body.velocity.x = -speed
        this.body.velocity.y = 0

        this.body.offset.x = 3
        break

      case movements[3]:
        this.anims.play(`${this.mobTexture}-walk-right`, true)
        this.body.velocity.x = speed
        this.body.velocity.y = 0

        this.body.offset.x = 3
        break

      default:
        if (this.canSleep) {
          this.anims.play(`${this.mobTexture}-sleep`, true)
          this.body.velocity.x = 0
          this.body.velocity.y = 0

          this.moveEvent.delay = 5000
          this.canSleep = false
          this.timeWithoutSleeping = 0
        }
        break
    }
  }
}
