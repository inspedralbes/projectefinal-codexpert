import * as Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'assets/tiles/Overworld.png')
    this.load.tilemapTiledJSON('map-tiles', 'assets/tiles/overworld-map.json')

    this.load.atlas('fauna', 'assets/characters/fauna/fauna.png', 'assets/characters/fauna/fauna.json')
  }

  create() {
    this.scene.start('game')
  }
}
