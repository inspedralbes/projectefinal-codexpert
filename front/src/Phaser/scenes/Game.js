import * as Phaser from 'phaser'

// import { debugDraw } from '../utils/debug'

export default class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }

  preload() {
    // this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const map = this.make.tilemap({ key: 'overworld-map' })

    const tileset = map.addTilesetImage('overworld-map', 'tiles', 16, 16, 1, 2)

    map.createLayer('Ground', tileset, 0, 0)
    // const wallsLayer = map.createLayer('Walls', tileset, 0, 0)
    // wallsLayer.setCollisionByProperty({ collides: true })

    // Character collider
    // this.physics.add.collider(this.fauna, wallsLayer)
  }

  update(t, dt) {

  }
}
