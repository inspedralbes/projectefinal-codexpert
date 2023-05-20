import * as Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('cozy-tileset', 'assets/tiles/cozy-tileset.png')
    this.load.image('cozy-buildings', 'assets/tiles/cozy-buildings.png')
    this.load.image('crops', 'assets/tiles/crops.png')
    this.load.tilemapTiledJSON('map', 'assets/tiles/cozy-map.json')

    this.load.atlas('strawberry', 'assets/characters/strawberry/strawberry.png', 'assets/characters/strawberry/strawberry.json')

    // UI
    this.load.image('e-key', 'assets/UI/e_key.png')
    this.load.image('enter1-key', 'assets/UI/enter_key_1.png')
    this.load.image('enter2-key', 'assets/UI/enter_key_2.png')
    this.load.image('enter3-key', 'assets/UI/enter_key_3.png')
    this.load.image('enter4-key', 'assets/UI/enter_key_4.png')

    // Music
    this.load.audio('worldMusic', 'assets/music/world.mp3')

    // Dialogs

    // Mobs
    this.load.atlas('chicken', 'assets/mobs/chicken/chicken.png', 'assets/mobs/chicken/chicken.json')
    this.load.atlas('bunny', 'assets/mobs/bunny/bunny.png', 'assets/mobs/bunny/bunny.json')
  }

  create() {
    this.scene.start('game')
  }
}
