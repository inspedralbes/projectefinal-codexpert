/* eslint-disable */
import * as Phaser from 'phaser'

import { debugDraw } from '../utils/debug'
// import Fauna from '../Characters/Fauna'
// import createCharacterAnims from '../anims/CharacterAnims'
import OverlapPoint from '../items/OverlapPoints'
// import { useNavigate } from 'react-router'

export default class Game extends Phaser.Scene {
  // navigate = useNavigate()
  fauna
  cursors

  constructor() {
    super('game')
    this.overlap = false
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const map = this.make.tilemap({ key: 'map-tiles' })

    const tileset = map.addTilesetImage('map-tiles', 'tiles', 16, 16)

    const groundLayer = map.createLayer('Ground', tileset, 0, 0)
    const wallsLayer = map.createLayer('Walls', tileset, 0, 0)
    const overlapObjectLayer = map.getObjectLayer('Overlap')
    
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

    const personajes = this.physics.add.staticGroup({
      classType: OverlapPoint
    })

    const config = {
      classType: Phaser.GameObjects.Sprite,
      defaultKey: null,
      defaultFrame: null,
      active: true,
      maxSize: undefined,
      runChildUpdate: false,
      createCallback: null,
      removeCallback: null,
      createMultipleCallback: null
    }

    const group = this.add.group(config)

    overlapObjectLayer.objects.forEach(objct => {
      console.log('object Layer Item: ', objct)
      const gameObj = personajes.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'fauna', undefined, false)
      gameObj.data = objct.properties
      console.log(gameObj)
      group.add(gameObj)
    })

    // console.log(group)

    wallsLayer.setCollisionByProperty({ collides: true })

    debugDraw(wallsLayer, this)

    this.fauna = this.add.sprite(400, 400, 'fauna')

    this.physics.add.existing(this.fauna)
    this.fauna.body.setSize(this.fauna.width * 0.47, this.fauna.height * 0.8)

    this.fauna.anims.play('fauna-idle-down')

    this.physics.add.overlap(this.fauna, group, this.handleOverlap, null, this)

    this.physics.add.collider(this.fauna, wallsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.fauna, groundLayer, this.handleCollision, null, this)

    this.cameras.main.startFollow(this.fauna, true)
  }

  handleCollision(colisionador, colisionado) {
    console.log('collide')
  }

  handleOverlap(colisionador, colisionado) {
    const overlapObjectData = colisionado.data
    this.overlapTmp = true

    if (!this.overlap) {
      this.overlap = true

      if (overlapObjectData[0].name === 'actionType') {
        console.log(overlapObjectData[0].value)
        window.postMessage({
          type: 'overlapped-msg',
          value: overlapObjectData[0].value
        }, '*')
      }

      // console.log('overlap')
      // console.log('colisionador: ', colisionador)
      console.log('colisionado: ', colisionado)
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, () => { console.log("callbakc working") }), 1000)

    }
  }

  checkOverlap(callback) {
    if (this.overlap) {
      if (!this.overlapTmp) {
        this.overlap = false
        callback();
        console.log("Overlap desactivado");
      }
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, callback), 1000)
    }//else

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
