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
  cursor
  keys

  constructor() {
    super('game')
    this.overlap = false
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
      'interactE': Phaser.Input.Keyboard.KeyCodes.E,
      'interactEnter': Phaser.Input.Keyboard.KeyCodes.ENTER,
    })
  }

  create() {
    const map = this.make.tilemap({ key: 'map' })

    // const tileset = map.addTilesetImage('map-tiles', 'tiles', 16, 16)
    const buildingsTileset = map.addTilesetImage('cozy-buildings', 'cozy-buildings', 16, 16)
    const tileset = map.addTilesetImage('cozy-tileset', 'cozy-tileset', 16, 16)
    const cropsTileset = map.addTilesetImage('crops', 'crops', 16, 16)

    const groundLayer = map.createLayer('Ground', tileset, 0, 0)
    const groundCollisionsLayer = map.createLayer('Ground-collisions', tileset, 0, 0)
    const cropsLayer = map.createLayer('Crops', cropsTileset, 0, 0)
    const buildingsLayer = map.createLayer('Buildings', buildingsTileset, 0, 0)
    const aboveBuildingsLayer = map.createLayer('Above-buildings', buildingsTileset, 0, 0)
    const aboveGroundLayer = map.createLayer('Above-ground', tileset, 0, 0)

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

    const puntosDeOverlap = this.physics.add.staticGroup({
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
      const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'fauna', undefined, false)
      gameObj.data = objct.properties
      group.add(gameObj)
    })

    buildingsLayer.setCollisionByProperty({ collides: true })
    groundLayer.setCollisionByProperty({ collides: true })
    cropsLayer.setCollisionByProperty({ collides: true })
    groundCollisionsLayer.setCollisionByProperty({ collides: true })
    aboveBuildingsLayer.setDepth(2)
    aboveGroundLayer.setDepth(1)

    // debugDraw(buildingsLayer, this)

    this.fauna = this.add.sprite(350, 350, 'fauna')

    this.physics.add.existing(this.fauna)
    this.fauna.body.setSize(this.fauna.width * 0.47, this.fauna.height * 0.8)

    this.fauna.anims.play('fauna-idle-down')


    this.physics.add.overlap(this.fauna, group, this.handleOverlap, null, this)

    this.physics.add.collider(this.fauna, buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.fauna, groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.fauna, groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.fauna, cropsLayer, this.handleCollision, null, this)
    // this.physics.add.collider(this.fauna, uLayer, this.handleCollision, null, this)

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

      if (overlapObjectData[0].name === 'actionType' || overlapObjectData[0].value === 'navigate') {
        this.currentNavigate = overlapObjectData[1].value
      }
      this.scene.run('interact-ui')
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, () => { 
        this.scene.stop('interact-ui')
        this.currentNavigate = null
     }), 100)
    }
  }

  checkOverlap(callback) {
    if (this.overlap) {
      if (!this.overlapTmp) {
        this.overlap = false
        callback();
      }
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, callback), 100)
    }//else

  }
  update(t, dt) {
    if (!this.cursors || !this.fauna || !this.keys) {
      return
    }

    const speed = 100

    if ((this.keys.interactE?.isDown || this.keys.interactEnter?.isDown) && this.overlap && this.currentNavigate != null) {
      window.postMessage({
        type: 'navigate_request-msg',
        value: this.currentNavigate
      }, '*')
    }

    if (this.cursors.left?.isDown || this.keys.left?.isDown) {
      this.fauna.anims.play('fauna-run-side', true)

      this.fauna.body.velocity.x = -speed
      this.fauna.body.velocity.y = 0

      this.fauna.scaleX = -1
      this.fauna.body.offset.x = 24
    } else if (this.cursors.right?.isDown || this.keys.right?.isDown) {
      this.fauna.anims.play('fauna-run-side', true)

      this.fauna.body.velocity.x = speed
      this.fauna.body.velocity.y = 0

      this.fauna.scaleX = 1
      this.fauna.body.offset.x = 8
    } else if (this.cursors.up?.isDown || this.keys.up?.isDown) {
      this.fauna.anims.play('fauna-run-up', true)

      this.fauna.body.velocity.x = 0
      this.fauna.body.velocity.y = -speed
    } else if (this.cursors.down?.isDown || this.keys.down?.isDown) {
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
