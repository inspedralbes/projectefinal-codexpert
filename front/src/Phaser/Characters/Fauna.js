import * as Phaser from 'phaser'

export default class Fauna extends Phaser.Physics.Arcade.Sprite {
  damageTime = 0

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    this.anims.play('fauna-idle-down')
  }

  update(cursors) {
    if (!cursors) {
      return
    }

    const speed = 100

    if (cursors.left?.isDown) {
      this.anims.play('fauna-run-side', true)
      this.setVelocity(-speed, 0)

      this.scaleX = -1
      this.body.offset.x = 24
    } else if (cursors.right?.isDown) {
      this.anims.play('fauna-run-side', true)
      this.setVelocity(speed, 0)

      this.scaleX = 1
      this.body.offset.x = 8
    } else if (cursors.up?.isDown) {
      this.anims.play('fauna-run-up', true)
      this.setVelocity(0, -speed)
    } else if (cursors.down?.isDown) {
      this.anims.play('fauna-run-down', true)
      this.setVelocity(0, speed)
    } else {
      const parts = this.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.anims.play(parts.join('-'))
      this.setVelocity(0, 0)
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('fauna', function (x, y, texture, frame) {
  const sprite = new Fauna(this.scene, x, y, texture, frame)

  this.displayList.add(sprite)
  this.updateList.add(sprite)

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

  sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

  return sprite
})
