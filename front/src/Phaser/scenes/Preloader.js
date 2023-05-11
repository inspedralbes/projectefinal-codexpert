import * as Phaser from 'phaser'
import '../assets/tiles/Overworld-map.json'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', '../assets/tiles/Overworld.png')
    this.load.tilemapTiledJSON('overworld-map', '../assets/tiles/Overworld-map.json')
  }

  create() {
    this.scene.start('game')
  }
}
