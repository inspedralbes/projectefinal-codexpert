import * as Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'assets/tiles/Overworld.png')
    this.load.tilemapTiledJSON('map-tiles', 'assets/tiles/overworld-map.json')

    this.load.atlas('fauna', 'assets/characters/fauna/fauna.png', 'assets/characters/fauna/fauna.json')

    // UI
    this.load.image('e-key', 'assets/UI/e_key.png')
    this.load.image('enter1-key', 'assets/UI/enter_key_1.png')
    this.load.image('enter2-key', 'assets/UI/enter_key_2.png')
    this.load.image('enter3-key', 'assets/UI/enter_key_3.png')
    this.load.image('enter4-key', 'assets/UI/enter_key_4.png')
  }

  create() {
    this.scene.start('game')
  }
}
