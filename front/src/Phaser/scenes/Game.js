/* eslint-disable */
import * as Phaser from 'phaser'
import NPC from '../Characters/NPC'
import Mob from '../Mobs/Mob'

import { debugDraw } from '../utils/debug'
// import strawberry from '../Characters/strawberry'
// import createCharacterAnims from '../anims/CharacterAnims'
import OverlapPoint from '../items/OverlapPoints'
// import { useNavigate } from 'react-router'

const spriteAnimsCreated = []

export default class Game extends Phaser.Scene {
  // navigate = useNavigate()
  strawberry
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
      'run': Phaser.Input.Keyboard.KeyCodes.SHIFT
    })
  }



  create() {
    this.createAnims('strawberry')

    this.map = this.make.tilemap({ key: 'map' })

    this.worldMusic = this.sound.add('worldMusic')
    this.worldMusic.play({ mute: false, volume: 1, rate: 1, seek: 0, loop: true })

    this.buildingsTileset = this.map.addTilesetImage('cozy-buildings', 'cozy-buildings', 16, 16)
    this.tileset = this.map.addTilesetImage('cozy-tileset', 'cozy-tileset', 16, 16)
    this.cropsTileset = this.map.addTilesetImage('crops', 'crops', 16, 16)

    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
    this.groundCollisionsLayer = this.map.createLayer('Ground-collisions', this.tileset, 0, 0)
    this.cropsLayer = this.map.createLayer('Crops', this.cropsTileset, 0, 0)
    this.buildingsLayer = this.map.createLayer('Buildings', this.buildingsTileset, 0, 0)
    this.aboveBuildingsLayer = this.map.createLayer('Above-buildings', this.buildingsTileset, 0, 0)
    this.aboveGroundLayer = this.map.createLayer('Above-ground', this.tileset, 0, 0)

    this.buildingsLayer.setCollisionByProperty({ collides: true })
    this.groundLayer.setCollisionByProperty({ collides: true })
    this.cropsLayer.setCollisionByProperty({ collides: true })
    this.groundCollisionsLayer.setCollisionByProperty({ collides: true })
    this.aboveBuildingsLayer.setDepth(3)
    this.aboveGroundLayer.setDepth(2)

    // debugDraw(this.buildingsLayer, this)

    this.strawberry = this.add.sprite(350, 350, 'strawberry')

    this.loadObjectLayers()

    this.physics.add.existing(this.strawberry)
    this.strawberry.setDepth(1)
    this.strawberry.body.setSize(this.strawberry.width * 0.3, this.strawberry.height * 0.3)

    this.strawberry.body.offset.y = 22

    this.strawberry.anims.play('strawberry-idle-down')

    this.physics.add.collider(this.strawberry, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.strawberry, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.strawberry, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.strawberry, this.cropsLayer, this.handleCollision, null, this)
    // this.physics.add.collider(this.strawberry, uLayer, this.handleCollision, null, this)

    this.cameras.main.startFollow(this.strawberry, true)
    // this.cameras.main.setFollowOffset(-100, -100);
  }

  handleCollision(colisionador, colisionado) {
    // console.log('collide')
  }

  handleOverlap(colisionador, colisionado) {
    const overlapObjectData = colisionado.data
    this.overlapTmp = true

    if (!this.overlap) {
      this.overlap = true

      if (overlapObjectData.get('actionType') === 'navigate') {
        this.currentNavigate = overlapObjectData.get('route')
      } else if (overlapObjectData.get('idNPC') > 0) {
        this.currentIdNPC = overlapObjectData.get('idNPC')
        console.log('npc con id ' + this.currentIdNPC)
      }
      this.scene.run('interact-ui')
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, () => {
        if (this.scene.isActive('interact-ui')) {
          this.scene.stop('interact-ui')
        }
        this.currentNavigate = null
        this.currentIdNPC = null
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
    if (!this.cursors || !this.strawberry || !this.keys) {
      return
    }

    if ((this.keys.interactE?.isDown || this.keys.interactEnter?.isDown) && this.overlap) {
      if (this.currentNavigate != null) {
        window.postMessage({
          type: 'navigate_request-msg',
          value: this.currentNavigate
        }, '*')
      }
      if (this.currentIdNPC != null && !this.inDialogue) {
        this.inDialogue = true;
        console.log('interactuar con id ' + this.currentIdNPC)
      }
    }

    let speed = 100

    if (this.keys.run?.isDown) {
      speed = 125
    }

    if (this.cursors.left?.isDown || this.keys.left?.isDown) {
      this.strawberry.anims.play('strawberry-walk-left', true)

      this.strawberry.body.velocity.x = -speed
      this.strawberry.body.velocity.y = 0

      // this.strawberry.scaleX = -1
      this.strawberry.body.offset.x = 11
    } else if (this.cursors.right?.isDown || this.keys.right?.isDown) {
      this.strawberry.anims.play('strawberry-walk-right', true)

      this.strawberry.body.velocity.x = speed
      this.strawberry.body.velocity.y = 0

      // this.strawberry.scaleX = 1
      this.strawberry.body.offset.x = 11
    } else if (this.cursors.up?.isDown || this.keys.up?.isDown) {
      this.strawberry.anims.play('strawberry-walk-up', true)

      this.strawberry.body.velocity.x = 0
      this.strawberry.body.velocity.y = -speed
    } else if (this.cursors.down?.isDown || this.keys.down?.isDown) {
      this.strawberry.anims.play('strawberry-walk-down', true)

      this.strawberry.body.velocity.x = 0
      this.strawberry.body.velocity.y = speed
    } else {
      const parts = this.strawberry.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.strawberry.play(parts.join('-'))

      this.strawberry.body.velocity.x = 0
      this.strawberry.body.velocity.y = 0
    }
  }

  loadObjectLayers() {
    const overlapObjectLayer = this.map.getObjectLayer('Overlap')
    const notLoggedOverlapObjectLayer = this.map.getObjectLayer('Not-Logged overlap')
    const NPCsObjectLayer = this.map.getObjectLayer('NPCs')
    const mobsObjectLayer = this.map.getObjectLayer('Mobs')

    const puntosDeOverlap = this.physics.add.staticGroup({
      classType: OverlapPoint
    })

    const puntosNPCs = this.physics.add.staticGroup({
      classType: NPC,
      createCallback: (go) => {
        const npcGo = go
        npcGo.body.onCollide = true
      }
    })

    const puntosMobs = this.physics.add.staticGroup({
      classType: Mob,
      createCallback: (go) => {
        const lizGo = go
        lizGo.body.onCollide = true
      }
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

    const overlapGroup = this.add.group(config)
    const npcGroup = this.add.group(config)
    const mobGroup = this.add.group(config)

    if (!window.network.getUserLogged()) {
      notLoggedOverlapObjectLayer.objects.forEach(objct => {
        const objData = new Map();

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value);
        });
        const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'strawberry', undefined, false)
        gameObj.data = objData
        overlapGroup.add(gameObj)
      })

      const notLoggedLayer = this.map.createLayer('Not-logged', this.tileset, 0, 0)
      const notLoggedBuildingsLayer = this.map.createLayer('Not-logged-buildings', this.buildingsTileset, 0, 0)
      notLoggedLayer.setCollisionByProperty({ collides: true })
      notLoggedBuildingsLayer.setCollisionByProperty({ collides: true })
      this.physics.add.collider(this.strawberry, notLoggedLayer, this.handleCollision, null, this)
    } else {
      overlapObjectLayer.objects.forEach(objct => {
        const objData = new Map();

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value);
        });
        const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'strawberry', undefined, false)
        gameObj.data = objData
        overlapGroup.add(gameObj)
      })
    }

    NPCsObjectLayer.objects.forEach(objct => {
      const objData = new Map();

      objct.properties.forEach(prop => {
        objData.set(prop.name, prop.value);
      });
      this.createAnims(objData.get('sprite'))
      const gameObj = puntosNPCs.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, objData.get('sprite'), undefined, true)
      gameObj.data = objData
      npcGroup.add(gameObj)
    })

    mobsObjectLayer.objects.forEach(objct => {
      const objData = new Map();

      objct.properties.forEach(prop => {
        objData.set(prop.name, prop.value);
      });
      this.createMobAnims(objData.get('sprite'))
      const gameObj = puntosMobs.get(objct.x + objct.width * 0.1, objct.y - objct.height * 0.1, objData.get('sprite'), undefined, true)
      gameObj.data = objData
      // console.log(gameObj)
      mobGroup.add(gameObj)
    })

    this.physics.add.overlap(this.strawberry, overlapGroup, this.handleOverlap, null, this)
    this.physics.add.overlap(this.strawberry, npcGroup, this.handleOverlap, null, this)
    this.physics.add.collider(mobGroup, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(mobGroup, npcGroup, this.handleCollision, null, this)
    this.physics.add.collider(mobGroup, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(mobGroup, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(mobGroup, this.cropsLayer, this.handleCollision, null, this)

    this.physics.add.collider(npcGroup, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(npcGroup, mobGroup, this.handleCollision, null, this)
    this.physics.add.collider(npcGroup, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(npcGroup, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(npcGroup, this.cropsLayer, this.handleCollision, null, this)

    this.physics.add.collider(this.strawberry, npcGroup, this.handlePlayerNPCCollision, null, this)
  }

  handlePlayerNPCCollision(obj1, colisionado) {
    const npc = colisionado

    const dx = npc.x - this.strawberry.x
    const dy = npc.y - this.strawberry.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100)
    npc.body.velocity.x = dir.x
    npc.body.velocity.y = dir.y

    npc.handleDamage(dir)
  }

  createMobAnims(texture) {
    if (spriteAnimsCreated.some((element) => element === texture)) {
      return
    }
    spriteAnimsCreated.push(texture)

    this.anims.create({
      key: `${texture}-walk-back`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-back-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${texture}-walk-front`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-front-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${texture}-walk-left`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-left-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${texture}-walk-right`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-right-', suffix: '.png' }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: `${texture}-sleep`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'sleep-', suffix: '.png' }),
      repeat: -1,
      frameRate: 3
    })
  }

  createAnims(texture) {
    if (spriteAnimsCreated.some((element) => element === texture)) {
      return
    }

    spriteAnimsCreated.push(texture)
    this.anims.create({
      key: `${texture}-idle-down`,
      frames: [
        { key: `${texture}`, frame: 'walk-front-1.png' }
      ]
    })

    this.anims.create({
      key: `${texture}-idle-up`,
      frames: [
        { key: `${texture}`, frame: 'walk-back-1.png' }
      ]
    })

    this.anims.create({
      key: `${texture}-idle-right`,
      frames: [
        { key: `${texture}`, frame: 'walk-right-1.png' }
      ]
    })

    this.anims.create({
      key: `${texture}-idle-left`,
      frames: [
        { key: `${texture}`, frame: 'walk-left-1.png' }
      ]
    })

    this.anims.create({
      key: `${texture}-walk-down`,
      frames: this.anims.generateFrameNames(`${texture}`, { start: 1, end: 8, prefix: 'walk-front-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
    })

    this.anims.create({
      key: `${texture}-walk-up`,
      frames: this.anims.generateFrameNames(`${texture}`, { start: 1, end: 8, prefix: 'walk-back-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
    })

    this.anims.create({
      key: `${texture}-walk-right`,
      frames: this.anims.generateFrameNames(`${texture}`, { start: 1, end: 8, prefix: 'walk-right-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
    })

    this.anims.create({
      key: `${texture}-walk-left`,
      frames: this.anims.generateFrameNames(`${texture}`, { start: 1, end: 8, prefix: 'walk-left-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
    })
  }
}
