/* eslint-disable */
import * as Phaser from 'phaser'
import NPC from '../Characters/NPC'
import Mob from '../Mobs/Mob'

import { debugDraw } from '../utils/debug'
import OverlapPoint from '../items/OverlapPoints'

const spriteAnimsCreated = []

const npcDialogs = [
  {
    name: 'Gaspa',
    dialogs: ['Hi! (with rizz)', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut velit el consectetur necessitatibus fugiat sint ad nulla saepe, voluptatum voluptates doloremque perspiciatis asperiores, deserunt placeat reprehenderit non commodi exercitationem mollitia sapiente.'],
    currentIndex: 0
  }
]

const PUNTOAPARICION = {
  x: 350,
  y: 350
}

const movimientos = ['up', 'down', 'left', 'right']

const defaultSpeed = 125

export default class Game extends Phaser.Scene {
  strawberry
  cursor
  keys
  selector
  events = new Phaser.Events.EventEmitter()
  interactEvent
  canInteract = true
  nameTagText
  username = 'guest'
  actualState = 'idle'
  lastSpeed = defaultSpeed
  othersprites
  nametags
  username

  constructor() {
    super('game')
    this.overlap = false

    // Window event listener for event handling
    window.addEventListener('message', this.handleMessage)
  }

  handleMessage = (event) => {
    const eventData = event.data

    // Event handle
    switch (eventData.type) {
      case 'dialog_end-msg':
        this.canInteract = true
        this.inDialogue = false
        break

      case 'update_character-msg':
        this.changeCharacters(eventData.characterData)
        break

      case 'new_character-msg':
        this.addCharacter(eventData.characterData)
        break

      case 'username-event':
        this.username = window.network.getUsername()
        break

      case 'connected_to_phaser-event':
        this.phaserUserId = window.network.getPhaserId()
        break

      default:
        // UNKNOWN EVENT
        break
    }
  }

  addCharacter(characterData) {
    if (characterData.id === this.phaserUserId) {
      return
    }

    if (!this.othersprites) { this.othersprites = this.physics.add.staticGroup() }

    if (!this.nametags) { this.nametags = this.physics.add.staticGroup() }

    const sprites = this.othersprites.getChildren()

    if (!sprites.some((sprite) => sprite.properties.id == characterData.id)) {
      const newPlayer = this.physics.add.sprite(characterData.x, characterData.y, 'Strawberry')
      newPlayer.setDepth(1)
      newPlayer.properties = characterData

      newPlayer.anims.play('Strawberry-idle-down')
      this.physics.add.existing(newPlayer)

      this.othersprites.add(newPlayer)
    }

    const tags = this.nametags.getChildren()

    if (!tags.some((tag) => tag.properties.name == characterData.name)) {
      const newTag = this.add.text(characterData.x, characterData.y, this.username, {
        fontSize: '6px',
        color: '#fff',
        align: 'center',
        backgroundColor: '#00000070',
        resolution: 2,
        wordWrap: { useAdvancedWrap: true },
        fontFamily: 'pixel_operator',
      })

      newTag.setDepth(999)
      newTag.properties = characterData

      this.physics.add.existing(newTag)

      this.nametags.add(newTag)
    }
  }

  changeCharacters(characterData) {
    if (!this.othersprites.getChildren().some((sprite) => sprite.properties.id == characterData.id) || !this.nametags.getChildren().some((tag) => tag.properties.name == characterData.name)) {
      this.addCharacter(characterData)
    }

    this.othersprites.getChildren().forEach(sprite => {
      if (sprite.properties.id === characterData.id) {
        sprite.properties = characterData
        sprite.x = sprite.properties.x
        sprite.y = sprite.properties.y
      }
    });

    this.nametags.getChildren().forEach(tag => {
      if (tag.properties.id === characterData.id) {
        tag.properties = characterData
        tag.x = tag.properties.x
        tag.y = tag.properties.y
      }
    });
  }

  preload() {
    if (!this.othersprites) { this.othersprites = this.physics.add.staticGroup() }

    if (!this.nametags) { this.nametags = this.physics.add.staticGroup() }

    this.createAnims('Strawberry')
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
    this.nameTagContainer = this.add.container(0, 0)
    this.nameTagText = this.add.text(PUNTOAPARICION.x, PUNTOAPARICION.y, this.username, {
      fontSize: '6px',
      color: '#fff',
      align: 'center',
      backgroundColor: '#00000070',
      resolution: 2,
      wordWrap: { useAdvancedWrap: true },
      fontFamily: 'pixel_operator',
    })

    this.nameTagContainer.add(this.nameTagText)
    this.nameTagContainer.setDepth(100)
    this.add.existing(this.nameTagContainer)

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

    this.strawberry = this.add.sprite(PUNTOAPARICION.x, PUNTOAPARICION.y, 'strawberry')

    this.loadObjectLayers()

    this.physics.add.existing(this.strawberry)
    this.strawberry.setDepth(1)
    this.strawberry.body.setSize(this.strawberry.width * 0.3, this.strawberry.height * 0.3)

    this.createBox()

    this.strawberry.body.offset.y = 22
    this.selector.body.offset.y = 6

    this.strawberry.anims.play('Strawberry-idle-down')

    this.physics.add.collider(this.strawberry, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.strawberry, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.strawberry, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.strawberry, this.cropsLayer, this.handleCollision, null, this)

    this.cameras.main.startFollow(this.strawberry, true)

    this.scene.run('dialog-ui')
  }

  update(t, dt) {
    if (!this.cursors || !this.strawberry || !this.keys || !this.othersprites) {
      return
    }

    if ((this.keys.interactE.isDown || this.keys.interactEnter?.isDown) && this.overlap && this.canInteract) {
      if (this.currentNavigate != null) {
        window.postMessage({
          type: 'navigate_request-msg',
          value: this.currentNavigate
        }, '*')
      }

      if (this.npcData != null && !this.inDialogue) {
        this.inDialogue = true

        const message = this.getCurrentDialog(this.npcData)

        window.postMessage({ type: 'end_interaction_with_npc' }, '*')
        window.postMessage({ type: 'interaction_with_npc', npcData: { message, name: this.npcData.character } }, '*')
      }

      if (!this.inDialogue) {
        window.postMessage({ type: 'end_interaction_with_npc' }, '*')
        this.inDialogue = false
        if (this.scene.isActive('interact-ui')) {
          this.scene.stop('interact-ui')
        }
      }
    }

    this.othersprites.getChildren().forEach(sprite => {
      const charX = sprite.x
      const charY = sprite.y

      const speed = sprite.properties.speed
      if (sprite.properties.direction == 'left') {
        console.log('left ' + sprite.properties.id)
        sprite.anims.play('Strawberry-walk-left', true)

        sprite.body.velocity.x = -speed
        sprite.body.velocity.y = 0

        sprite.body.offset.x = 11
      } else if (sprite.properties.direction == 'right') {
        console.log('right ' + sprite.properties.id)

        sprite.anims.play('Strawberry-walk-right', true)

        sprite.body.velocity.x = speed
        sprite.body.velocity.y = 0

        sprite.body.offset.x = 11
      } else if (sprite.properties.direction == 'up') {
        console.log('up ' + sprite.properties.id)

        sprite.anims.play('Strawberry-walk-up', true)

        sprite.body.velocity.x = 0
        sprite.body.velocity.y = -speed
      } else if (sprite.properties.direction == 'down') {
        console.log('down ' + sprite.properties.id)

        sprite.anims.play('Strawberry-walk-down', true)

        sprite.body.velocity.x = 0
        sprite.body.velocity.y = speed
      } else if (sprite.properties.direction == '' && sprite.anims.currentAnim) {
        const parts = sprite.anims.currentAnim.key.split('-')
        parts[1] = 'idle'
        sprite.play(parts.join('-'))

        sprite.body.velocity.x = 0
        sprite.body.velocity.y = 0
      }

      this.nametags.getChildren().forEach(tag => {
        if (tag.properties.id === tag.properties.id) {
          tag.x = charX - 10
          tag.y = charY - 15
        }
      });
    });

    if (this.inDialogue) {
      return
    }

    const charX = this.strawberry.x
    const charY = this.strawberry.y
    const distance = 16

    let speed = 125

    if (this.keys.run?.isDown) {
      speed = 150
    }

    let changedSpeed = false

    if (!(this.lastSpeed === speed)) {
      changedSpeed = true
    }

    this.lastSpeed = speed

    let moveDataToSend = {
      direction: '',
      x: charX,
      y: charY,
      speed: speed
    }

    let moved = false
    let lastState = this.actualState

    if (this.cursors.left?.isDown || this.keys.left?.isDown) {
      moveDataToSend.direction = 'left'
      this.strawberry.anims.play('Strawberry-walk-left', true)

      this.strawberry.body.velocity.x = -speed
      this.strawberry.body.velocity.y = 0

      this.selector.setPosition(charX - distance, charY)

      this.strawberry.body.offset.x = 11
      moved = true
      this.actualState = 'left'
    } else if (this.cursors.right?.isDown || this.keys.right?.isDown) {
      moveDataToSend.direction = 'right'
      this.strawberry.anims.play('Strawberry-walk-right', true)

      this.strawberry.body.velocity.x = speed
      this.strawberry.body.velocity.y = 0

      this.selector.setPosition(charX + distance, charY)

      this.strawberry.body.offset.x = 11
      moved = true
      this.actualState = 'right'
    } else if (this.cursors.up?.isDown || this.keys.up?.isDown) {
      moveDataToSend.direction = 'up'
      this.strawberry.anims.play('Strawberry-walk-up', true)

      this.strawberry.body.velocity.x = 0
      this.strawberry.body.velocity.y = -speed

      this.selector.setPosition(charX, charY - distance)
      moved = true
      this.actualState = 'up'
    } else if (this.cursors.down?.isDown || this.keys.down?.isDown) {
      moveDataToSend.direction = 'down'
      this.strawberry.anims.play('Strawberry-walk-down', true)

      this.strawberry.body.velocity.x = 0
      this.strawberry.body.velocity.y = speed

      this.selector.setPosition(charX, charY + distance + 8)
      moved = true
      this.actualState = 'down'
    } else {
      const parts = this.strawberry.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.strawberry.play(parts.join('-'))

      this.strawberry.body.velocity.x = 0
      this.strawberry.body.velocity.y = 0
    }
    this.nameTagText.x = charX - 10
    this.nameTagText.y = charY - 15

    if (lastState !== this.actualState || !moved && movimientos.some((mov) => lastState === mov) || changedSpeed) {
      window.postMessage({ type: 'started_to_walk-emit', moveDataToSend }, '*')
    }

    if (!moved) {
      this.actualState = 'idle'
    }
  }

  handleCollision(colisionador, colisionado) {
    // COLISIONA
  }

  handleOverlap(colisionador, colisionado) {
    const overlapObjectData = colisionado.properties
    this.overlapTmp = true

    if (!this.overlap) {
      this.overlap = true

      if (overlapObjectData.get('actionType') === 'navigate') {
        this.currentNavigate = overlapObjectData.get('route')
        window.postMessage({ type: 'interaction_with_overlap_object', data: { name: this.currentNavigate, x: colisionado.x, y: colisionado.y, type: 'location' } }, '*')
      } else if (overlapObjectData.get('idNPC') > 0) {
        this.npcData = {
          character: overlapObjectData.get('sprite')
        }
        window.postMessage({ type: 'interaction_with_overlap_object', data: { name: overlapObjectData.get('sprite'), x: colisionado.x, y: colisionado.y, type: 'npc' } }, '*')
      }
      if (this.canInteract) {
        this.scene.run('interact-ui')
      }
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, () => {
        if (this.scene.isActive('interact-ui')) {
          this.scene.stop('interact-ui')
        }
        this.currentNavigate = null
        this.npcData = null
        window.postMessage({ type: 'end_interaction_with_npc' }, '*')
      }), 100)
    }
  }

  checkOverlap(callback) {
    if (this.overlap) {
      if (!this.overlapTmp) {
        this.overlap = false
        callback()
      }
      this.overlapTmp = false
      setTimeout(this.checkOverlap.bind(this, callback), 100)
    }
  }

  getCurrentDialog() {
    let dialog = '...'
    npcDialogs.forEach(npc => {
      if (npc.name === this.npcData.character) {
        dialog = npc.dialogs[npc.currentIndex]
        npc.currentIndex === npc.dialogs.length - 1 ? npc.currentIndex = 0 : npc.currentIndex++
      }
    })
    return dialog
  }

  createBox() {
    const box = this.add.rectangle(PUNTOAPARICION.x, PUNTOAPARICION.y, 20, 20, 0xffffff, 0)
    this.physics.add.existing(box)

    this.selector = box

    this.physics.add.overlap(this.selector, this.npcGroup, this.handleOverlap, undefined, this)
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

    this.overlapGroup = this.add.group(config)
    this.npcGroup = this.add.group(config)
    this.mobGroup = this.add.group(config)

    if (!window.network.getUserLogged()) {
      notLoggedOverlapObjectLayer.objects.forEach(objct => {
        const objData = new Map()

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value)
        })
        const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'Strawberry', undefined, false)
        gameObj.properties = objData
        this.overlapGroup.add(gameObj)
      })

      const notLoggedLayer = this.map.createLayer('Not-logged', this.tileset, 0, 0)
      const notLoggedBuildingsLayer = this.map.createLayer('Not-logged-buildings', this.buildingsTileset, 0, 0)
      notLoggedLayer.setCollisionByProperty({ collides: true })
      notLoggedBuildingsLayer.setCollisionByProperty({ collides: true })
      this.physics.add.collider(this.strawberry, notLoggedLayer, this.handleCollision, null, this)
    } else {
      this.username = window.network.getUsername()
      overlapObjectLayer.objects.forEach(objct => {
        const objData = new Map()

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value)
        })
        const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'Strawberry', undefined, false)
        gameObj.properties = objData
        this.overlapGroup.add(gameObj)
      })
    }

    NPCsObjectLayer.objects.forEach(objct => {
      const objData = new Map()

      objct.properties.forEach(prop => {
        objData.set(prop.name, prop.value)
      })
      this.createAnims(objData.get('sprite'))
      const gameObj = puntosNPCs.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, objData.get('sprite'), undefined, true)
      gameObj.properties = objData
      this.npcGroup.add(gameObj)
    })

    mobsObjectLayer.objects.forEach(objct => {
      const objData = new Map()

      objct.properties.forEach(prop => {
        objData.set(prop.name, prop.value)
      })
      this.createMobAnims(objData.get('sprite'))
      const gameObj = puntosMobs.get(objct.x + objct.width * 0.1, objct.y - objct.height * 0.1, objData.get('sprite'), undefined, true)
      gameObj.properties = objData
      this.mobGroup.add(gameObj)
    })

    this.physics.add.overlap(this.strawberry, this.overlapGroup, this.handleOverlap, null, this)
    this.physics.add.overlap(this.strawberry, this.npcGroup, this.handleOverlap, null, this)
    this.physics.add.collider(this.mobGroup, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.npcGroup, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.cropsLayer, this.handleCollision, null, this)

    this.physics.add.collider(this.npcGroup, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.cropsLayer, this.handleCollision, null, this)

    this.physics.add.collider(this.strawberry, this.mobGroup, this.handlePlayerNPCCollision, null, this)
    this.physics.add.collider(this.strawberry, this.npcGroup, this.handlePlayerNPCCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.mobGroup, this.handlePlayerNPCCollision, null, this)
  }

  handlePlayerNPCCollision(obj1, colisionado) {
    const mob = colisionado

    const dx = mob.x - this.strawberry.x
    const dy = mob.y - this.strawberry.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100)
    mob.body.velocity.x = 0
    mob.body.velocity.y = 0

    mob.handleDamage(dir)
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
      frameRate: 12
    })

    this.anims.create({
      key: `${texture}-walk-front`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-front-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
    })

    this.anims.create({
      key: `${texture}-walk-left`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-left-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
    })

    this.anims.create({
      key: `${texture}-walk-right`,
      frames: this.anims.generateFrameNames(texture, { start: 1, end: 4, prefix: 'walk-right-', suffix: '.png' }),
      repeat: -1,
      frameRate: 12
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
