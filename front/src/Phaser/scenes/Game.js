import * as Phaser from 'phaser'

import { debugDraw } from '../utils/debug'
// import Fauna from '../Characters/Fauna'
// import createCharacterAnims from '../anims/CharacterAnims'
import OverlapPoint from '../items/OverlapPoints'

export default class Game extends Phaser.Scene {
  fauna
  cursors

  constructor() {
    super('game')
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    // createCharacterAnims(this.anims)

    const map = this.make.tilemap({ key: 'map-tiles' })

    const tileset = map.addTilesetImage('map-tiles', 'tiles', 16, 16)

    map.createLayer('Ground', tileset, 0, 0)
    const wallsLayer = map.createLayer('Walls', tileset, 0, 0)
    // const overlapLayer = map.createLayer('Overlap', tileset, 0, 0)

    this.anims.create({
      key: 'fauna-idle-down',
      frames: [
        { key: 'fauna', frame: 'walk-down-3.png' }
      ]
    })

    this.anims.create({
      key: 'fauna-idle-up',
      frames: [
        { key: 'fauna', frame: 'walk-up-3.png' }
      ]
    })

    this.anims.create({
      key: 'fauna-idle-side',
      frames: [
        { key: 'fauna', frame: 'walk-side-3.png' }
      ]
    })

    this.anims.create({
      key: 'fauna-run-down',
      frames: this.anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })

    this.anims.create({
      key: 'fauna-run-up',
      frames: this.anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })

    this.anims.create({
      key: 'fauna-run-side',
      frames: this.anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
      repeat: -1,
      frameRate: 15
    })

    const chests = this.physics.add.staticGroup({
      classType: OverlapPoint
    })

    const overlapObjectLayer = map.getObjectLayer('Overlap')
    console.log(overlapObjectLayer.objects)

    overlapObjectLayer.objects.forEach(objct => {
      chests.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'fauna')
    })
    console.log(overlapObjectLayer.objects)

    wallsLayer.setCollisionByProperty({ collides: true })

    debugDraw(wallsLayer, this)

    this.fauna = this.add.sprite(400, 400, 'fauna')

    this.physics.add.existing(this.fauna)
    this.fauna.body.setSize(this.fauna.width * 0.47, this.fauna.height * 0.8)

    this.fauna.anims.play('fauna-idle-down')

    // this.physics.add.collider(this.fauna, wallsLayer)
    this.physics.add.overlap(this.fauna, overlapObjectLayer, this.handleOverlap, null, this)

    this.physics.add.collider(
      this.fauna,
      wallsLayer,
      this.handleCollision,
      null,
      this
    )

    this.cameras.main.startFollow(this.fauna, true)
  }

  handleCollision(obj1, obj2) {
    console.log('collide')
  }

  handleOverlap(obj1, obj2) {
    console.log('overlap')
  }

  update(t, dt) {
    if (!this.cursors || !this.fauna) {
      return
    }

    const speed = 500

    if (this.cursors.left?.isDown) {
      this.fauna.anims.play('fauna-run-side', true)

      this.fauna.body.velocity.x = -speed
      this.fauna.body.velocity.y = 0

      this.fauna.scaleX = -1
      this.fauna.body.offset.x = 24
    } else if (this.cursors.right?.isDown) {
      this.fauna.anims.play('fauna-run-side', true)

      this.fauna.body.velocity.x = speed
      this.fauna.body.velocity.y = 0

      this.fauna.scaleX = 1
      this.fauna.body.offset.x = 8
    } else if (this.cursors.up?.isDown) {
      this.fauna.anims.play('fauna-run-up', true)

      this.fauna.body.velocity.x = 0
      this.fauna.body.velocity.y = -speed
    } else if (this.cursors.down?.isDown) {
      this.fauna.anims.play('fauna-run-down', true)

      this.fauna.body.velocity.x = 0
      this.fauna.body.velocity.y = speed
    } else {
      const parts = this.fauna.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.fauna.play(parts.join('-'))

      this.fauna.body.velocity.x = 0
      this.fauna.body.velocity.y = 0
    }
  }
}
