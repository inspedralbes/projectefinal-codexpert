/* eslint-disable */
import * as Phaser from 'phaser'
import NPC from '../Characters/NPC'
import Mob from '../Mobs/Mob'

import { debugDraw } from '../utils/debug'
import OverlapPoint from '../items/OverlapPoints'

import Cookies from 'universal-cookie'
import routes from '../../conn_routes'

const cookies = new Cookies()

const spriteAnimsCreated = []

const PUNTOAPARICION = {
  x: 210,
  y: 690
}

const movimientos = ['up', 'down', 'left', 'right']

const defaultSpeed = 125

export default class Game extends Phaser.Scene {
  main_character
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
  npcDialogs
  tutorialPassed = false

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
      const newPlayer = this.physics.add.sprite(characterData.x, characterData.y, 'bunny')
      newPlayer.setDepth(1)
      newPlayer.properties = characterData

      newPlayer.anims.play('bunny-sleep')
      this.physics.add.existing(newPlayer)

      this.othersprites.add(newPlayer)
    }

    const tags = this.nametags.getChildren()

    if (!tags.some((tag) => tag.properties.id == characterData.id)) {
      const newTag = this.add.text(characterData.x, characterData.y, characterData.name, {
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

      if (tags.some((tag) => tag.properties.id == characterData.id)) {
        this.nametags.getChildren().forEach((tag, index) => {
          if (tag.id === characterData.id) {
            tag.destroy()
            // this.nametags.getChildren().splice(index, 1);
          }
        });
      }

      this.nametags.add(newTag)
    }
  }

  changeCharacters(characterData) {
    if (!this.othersprites.getChildren().some((sprite) => sprite.properties.id == characterData.id) || !this.nametags.getChildren().some((tag) => tag.properties.name == characterData.name || tag.properties.id != characterData.id)) {
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
    this.loadAnimations()
    if (!this.othersprites) { this.othersprites = this.physics.add.staticGroup() }

    if (!this.nametags) { this.nametags = this.physics.add.staticGroup() }

    // this.createAnims('Main')
    // this.createMobAnims('bunny')
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

    this.worldMusic = this.sound.add('worldMusic')
    this.worldMusic.play({ mute: false, volume: 1, rate: 1, seek: 0, loop: true })
    
    this.startGame = true;
  }

  async create() {
    // Dialogs
    const token = new FormData()
    token.append(
      'token',
      cookies.get('token') !== undefined ? cookies.get('token') : null
    )

    await fetch(routes.fetchLaravel + 'checkTutorialPassed', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        this.tutorialPassed = data.tutorialPassed
      })

    await fetch(routes.fetchLaravel + 'getAllNPCS', {
      method: 'POST',
      mode: 'cors',
      body: token,
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.npcDialogs = data
      })

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

    this.buildingsTileset = this.map.addTilesetImage('cozy-buildings', 'cozy-buildings', 16, 16)
    this.tileset = this.map.addTilesetImage('cozy-tileset', 'cozy-tileset', 16, 16)
    this.cropsTileset = this.map.addTilesetImage('crops', 'crops', 16, 16)
    this.puenteTileset = this.map.addTilesetImage('puente', 'puente', 16, 16)
    this.cascadeTileset = this.map.addTilesetImage('cascada', 'cascada', 16, 16)
    this.competitiveEdTileset = this.map.addTilesetImage('competitive_edification', 'competitive_edification', 16, 16)

    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
    this.groundCollisionsLayer = this.map.createLayer('Ground-collisions', this.tileset, 0, 0)
    this.cropsLayer = this.map.createLayer('Crops', this.cropsTileset, 0, 0)
    this.bridgeLayer = this.map.createLayer('Bridge', this.puenteTileset, 0, 0)
    this.buildingsLayer = this.map.createLayer('Buildings', this.buildingsTileset, 0, 0)
    this.aboveBuildingsLayer = this.map.createLayer('Above-buildings', this.buildingsTileset, 0, 0)
    this.aboveGroundLayer = this.map.createLayer('Above-ground', this.tileset, 0, 0)
    this.cascadeLayer = this.map.createLayer('Cascade', this.cascadeTileset, 0, 0)

    this.competitiveBuildingLayer = this.map.createLayer('Competitive-building', this.competitiveEdTileset, 0, 0)
    this.aboveCompetitiveBuildingLayer = this.map.createLayer('Competitive Above-building', this.competitiveEdTileset, 0, 0)

    this.buildingsLayer.setCollisionByProperty({ collides: true })
    this.bridgeLayer.setCollisionByProperty({ collides: true })
    this.groundLayer.setCollisionByProperty({ collides: true })
    this.cropsLayer.setCollisionByProperty({ collides: true })
    this.groundCollisionsLayer.setCollisionByProperty({ collides: true })
    this.aboveGroundLayer.setCollisionByProperty({ collides: true })
    this.competitiveBuildingLayer.setCollisionByProperty({ collides: true })
    this.cascadeLayer.setDepth(3)
    this.aboveBuildingsLayer.setDepth(3)
    this.aboveGroundLayer.setDepth(1)
    this.aboveCompetitiveBuildingLayer.setDepth(3)
    this.buildingsLayer.setDepth(1)
    this.groundCollisionsLayer.setDepth(1)
    this.bridgeLayer.setDepth(0)

    this.main_character = this.add.sprite(PUNTOAPARICION.x, PUNTOAPARICION.y, 'main_character')

    this.loadObjectLayers()

    this.physics.add.existing(this.main_character)
    this.main_character.setDepth(1)
    this.main_character.body.setSize(this.main_character.width * 0.3, this.main_character.height * 0.3)

    this.createBox()

    this.main_character.body.offset.y = 22
    this.selector.body.offset.y = 6

    this.main_character.anims.play('Main-idle-down')

    this.physics.add.collider(this.main_character, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.main_character, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.main_character, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.main_character, this.cropsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.main_character, this.aboveGroundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.main_character, this.competitiveBuildingLayer, this.handleCollision, null, this)

    this.cameras.main.startFollow(this.main_character, true)

    this.scene.run('dialog-ui')
  }

  update(t, dt) {
    if (!this.cursors || !this.main_character || !this.keys || !this.othersprites || !this.startGame) {
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

        const data = this.getCurrentDialog(this.npcData)

        window.postMessage({ type: 'end_interaction_with_npc' }, '*')
        window.postMessage({ type: 'interaction_with_npc', npcData: { message: data.dialog, name: data.haveMet ? data.name : '???', voice: this.npcData.voice } }, '*')
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
        sprite.anims.play('bunny-walk-left', true)
        sprite.body.velocity.x = -speed
        sprite.body.velocity.y = 0

        sprite.body.offset.x = 11
      } else if (sprite.properties.direction == 'right') {
        sprite.anims.play('bunny-walk-right', true)

        sprite.body.velocity.x = speed
        sprite.body.velocity.y = 0

        sprite.body.offset.x = 11
      } else if (sprite.properties.direction == 'up') {
        sprite.anims.play('bunny-walk-back', true)

        sprite.body.velocity.x = 0
        sprite.body.velocity.y = -speed
      } else if (sprite.properties.direction == 'down') {
        sprite.anims.play('bunny-walk-front', true)

        sprite.body.velocity.x = 0
        sprite.body.velocity.y = speed
      } else if (sprite.properties.direction == '' && sprite.anims.currentAnim) {
        sprite.anims.play('bunny-sleep', true)

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

    const charX = this.main_character.x
    const charY = this.main_character.y
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
      this.main_character.anims.play('Main-walk-left', true)

      this.main_character.body.velocity.x = -speed
      this.main_character.body.velocity.y = 0

      this.selector.setPosition(charX - distance, charY)

      this.main_character.body.offset.x = 11
      moved = true
      this.actualState = 'left'
    } else if (this.cursors.right?.isDown || this.keys.right?.isDown) {
      moveDataToSend.direction = 'right'
      this.main_character.anims.play('Main-walk-right', true)

      this.main_character.body.velocity.x = speed
      this.main_character.body.velocity.y = 0

      this.selector.setPosition(charX + distance, charY)

      this.main_character.body.offset.x = 11
      moved = true
      this.actualState = 'right'
    } else if (this.cursors.up?.isDown || this.keys.up?.isDown) {
      moveDataToSend.direction = 'up'
      this.main_character.anims.play('Main-walk-up', true)

      this.main_character.body.velocity.x = 0
      this.main_character.body.velocity.y = -speed

      this.selector.setPosition(charX, charY - distance)
      moved = true
      this.actualState = 'up'
    } else if (this.cursors.down?.isDown || this.keys.down?.isDown) {
      moveDataToSend.direction = 'down'
      this.main_character.anims.play('Main-walk-down', true)

      this.main_character.body.velocity.x = 0
      this.main_character.body.velocity.y = speed

      this.selector.setPosition(charX, charY + distance + 8)
      moved = true
      this.actualState = 'down'
    } else {
      const parts = this.main_character.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.main_character.play(parts.join('-'))

      this.main_character.body.velocity.x = 0
      this.main_character.body.velocity.y = 0
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
          character: overlapObjectData.get('sprite'),
          id: overlapObjectData.get('idNPC'),
          voice: overlapObjectData.get('voice')
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
    let haveMet = false;
    let name = '???';

    this.npcDialogs?.forEach(npc => {
      if (npc.id === this.npcData.id) {
        console.log(npc)
        if (!npc.haveMet) {
          haveMet = npc.haveMet
          dialog = npc.introduction

          const bodyData = new FormData()
          bodyData.append('token', cookies.get('token') !== undefined ? cookies.get('token') : null)
          bodyData.append('npcId', npc.id)

          fetch(routes.fetchLaravel + 'setSpokenToNPC', {
            method: 'POST',
            mode: 'cors',
            body: bodyData,
            credentials: 'include'
          })
          npc.haveMet = true
          npc.currentIndex = 0
        } else {
          name = npc.name
          haveMet = npc.haveMet
          if (!npc.currentIndex)
            npc.currentIndex = 0

          dialog = npc.dialogues[npc.currentIndex]
          npc.currentIndex === npc.dialogues.length - 1 ? npc.currentIndex = 0 : npc.currentIndex++
        }
      }
    })

    return { dialog, haveMet, name }
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
    const notLoggedNPCsObjectLayer = this.map.getObjectLayer('Not-Logged NPCs')
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

    if (!this.tutorialPassed) {
      notLoggedOverlapObjectLayer.objects.forEach(objct => {
        const objData = new Map()

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value)
        })
        const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'Main', undefined, false)
        gameObj.properties = objData
        this.overlapGroup.add(gameObj)
      })

      const notLoggedLayer = this.map.createLayer('Not-logged', this.tileset, 0, 0)
      const notLoggedBuildingsLayer = this.map.createLayer('Not-logged-buildings', this.buildingsTileset, 0, 0)
      notLoggedLayer.setCollisionByProperty({ collides: true })
      notLoggedBuildingsLayer.setCollisionByProperty({ collides: true })
      this.physics.add.collider(this.main_character, notLoggedLayer, this.handleCollision, null, this)
      notLoggedLayer.setDepth(1)

      notLoggedNPCsObjectLayer.objects.forEach(objct => {
        const objData = new Map()

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value)
        })
        // this.createAnims(objData.get('sprite'))
        const gameObj = puntosNPCs.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, objData.get('sprite'), undefined, true)
        gameObj.properties = objData
        this.npcGroup.add(gameObj)
      })
    } else {
      this.username = window.network.getUsername()
      overlapObjectLayer.objects.forEach(objct => {
        const objData = new Map()

        objct.properties.forEach(prop => {
          objData.set(prop.name, prop.value)
        })
        const gameObj = puntosDeOverlap.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, 'Main', undefined, false)
        gameObj.properties = objData
        this.overlapGroup.add(gameObj)
      })
    }

    NPCsObjectLayer.objects.forEach(objct => {
      const objData = new Map()

      objct.properties.forEach(prop => {
        objData.set(prop.name, prop.value)
      })
      // this.createAnims(objData.get('sprite'))
      const gameObj = puntosNPCs.get(objct.x + objct.width * 0.5, objct.y - objct.height * 0.5, objData.get('sprite'), undefined, true)
      gameObj.properties = objData
      this.npcGroup.add(gameObj)
    })

    mobsObjectLayer.objects.forEach(objct => {
      const objData = new Map()

      objct.properties.forEach(prop => {
        objData.set(prop.name, prop.value)
      })
      // this.createMobAnims(objData.get('sprite'))
      const gameObj = puntosMobs.get(objct.x + objct.width * 0.1, objct.y - objct.height * 0.1, objData.get('sprite'), undefined, true)
      gameObj.properties = objData
      this.mobGroup.add(gameObj)
    })

    this.physics.add.overlap(this.main_character, this.overlapGroup, this.handleOverlap, null, this)
    this.physics.add.overlap(this.main_character, this.npcGroup, this.handleOverlap, null, this)

    this.physics.add.collider(this.mobGroup, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.cropsLayer, this.handleCollision, null, this)

    this.physics.add.collider(this.npcGroup, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.cropsLayer, this.handleCollision, null, this)

    this.physics.add.collider(this.main_character, this.mobGroup, this.handlePlayerNPCCollision, null, this)
    this.physics.add.collider(this.main_character, this.npcGroup, this.handlePlayerNPCCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.mobGroup, this.handlePlayerNPCCollision, null, this)
    this.physics.add.collider(this.mobGroup, this.competitiveBuildingLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.npcGroup, this.competitiveBuildingLayer, this.handleCollision, null, this)

    this.physics.add.collider(this.othersprites, this.buildingsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.othersprites, this.npcGroup, this.handleCollision, null, this)
    this.physics.add.collider(this.othersprites, this.groundLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.othersprites, this.groundCollisionsLayer, this.handleCollision, null, this)
    this.physics.add.collider(this.othersprites, this.cropsLayer, this.handleCollision, null, this)

    this.mobGroup.setDepth(1)
    this.npcGroup.setDepth(1)
  }

  handlePlayerNPCCollision(obj1, colisionado) {
    const mob = colisionado

    const dx = mob.x - this.main_character.x
    const dy = mob.y - this.main_character.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100)
    mob.body.velocity.x = 0
    mob.body.velocity.y = 0

    mob.handleDamage(dir)
  }

  loadAnimations = () => {
    const npcTextures = ['Main', 'Strawberry', 'Gaspa', 'Asselia', 'Martin', 'Amae', 'Farmer', 'Shopkeeper', 'Iris', 'Emo', 'Aitor', 'Paul']
    const mobTextures = ['chicken', 'chicken_baby', 'bunny', 'cow', 'cow_baby']

    npcTextures.forEach(texture => {
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
    })

    mobTextures.forEach(texture => {
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
    })
  }
}
