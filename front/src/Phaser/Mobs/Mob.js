import * as Phaser from 'phaser'

const movements = [0, 1, 2, 3]
export default class Mob extends Phaser.Physics.Arcade.Sprite {
  direction = movements[3]
  moveEvent
  mobTexture
  timeWithoutSleeping
  canSleep = true

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.mobTexture = texture

    this.createAnims()

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
    let newDirection = Phaser.Math.Between(0, 4)

    while (newDirection === this.direction) {
      newDirection = Phaser.Math.Between(0, 4)
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

  preUpdate(t, dt) {
    super.preUpdate(t, dt)

    const speed = 20
    if (!(this.direction > 3)) {
      this.moveEvent.delay = Math.random() * 4000 + 1500
    }

    if (this.timeWithoutSleeping > 10) {
      this.canSleep = true
    }

    switch (this.direction) {
      case movements[0]:
        this.anims.play(`${this.mobTexture}-walk-back`, true)
        this.body.velocity.x = 0
        this.body.velocity.y = -speed
        break

      case movements[1]:
        this.anims.play(`${this.mobTexture}-walk-front`, true)
        this.body.velocity.x = 0
        this.body.velocity.y = speed
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

          // this.body.offset.x = 0
          this.moveEvent.delay = 5000
          this.canSleep = false
          this.timeWithoutSleeping = 0
        }
        break
    }
  }

  createAnims() {
    this.anims.create({
      key: `${this.mobTexture}-walk-back`,
      frames: this.anims.generateFrameNames(this.mobTexture, { start: 1, end: 4, prefix: 'walk-back-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${this.mobTexture}-walk-front`,
      frames: this.anims.generateFrameNames(this.mobTexture, { start: 1, end: 4, prefix: 'walk-front-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${this.mobTexture}-walk-left`,
      frames: this.anims.generateFrameNames(this.mobTexture, { start: 1, end: 4, prefix: 'walk-left-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${this.mobTexture}-walk-right`,
      frames: this.anims.generateFrameNames(this.mobTexture, { start: 1, end: 4, prefix: 'walk-right-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${this.mobTexture}-sleep`,
      frames: this.anims.generateFrameNames(this.mobTexture, { start: 1, end: 4, prefix: 'sleep-', suffix: '.png' }),
      repeat: -1,
      frameRate: 3
    })
  }
}
