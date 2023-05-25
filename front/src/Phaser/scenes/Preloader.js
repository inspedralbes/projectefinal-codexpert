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

    // UI
    this.load.image('e-key', 'assets/UI/e_key.png')
    this.load.image('enter1-key', 'assets/UI/enter_key_1.png')
    this.load.image('enter2-key', 'assets/UI/enter_key_2.png')
    this.load.image('enter3-key', 'assets/UI/enter_key_3.png')
    this.load.image('enter4-key', 'assets/UI/enter_key_4.png')
    this.load.image('skip_dialog', 'assets/UI/skip_dialog.gif')

    // Music
    this.load.audio('worldMusic', 'assets/music/world.mp3')

    // Characters
    this.load.atlas('Strawberry', 'assets/characters/strawberry/strawberry.png', 'assets/characters/strawberry/strawberry.json')
    this.load.atlas('Gaspa', 'assets/characters/gaspa/gaspa.png', 'assets/characters/gaspa/gaspa.json')
    this.load.atlas('Asselia', 'assets/characters/asselia/asselia.png', 'assets/characters/asselia/asselia.json')
    this.load.atlas('Martin', 'assets/characters/martin/martin.png', 'assets/characters/martin/martin.json')
    this.load.atlas('Amae', 'assets/characters/amae/amae.png', 'assets/characters/amae/amae.json')
    this.load.atlas('Farmer', 'assets/characters/farmer/farmer.png', 'assets/characters/farmer/farmer.json')
    this.load.atlas('Shopkeeper', 'assets/characters/shopkeeper/shopkeeper.png', 'assets/characters/shopkeeper/shopkeeper.json')
    this.load.atlas('Iris', 'assets/characters/iris/iris.png', 'assets/characters/iris/iris.json')
    this.load.atlas('Emo', 'assets/characters/emo/emo.png', 'assets/characters/emo/emo.json')
    this.load.atlas('Aitor', 'assets/characters/aitor/aitor.png', 'assets/characters/aitor/aitor.json')
    this.load.atlas('Paul', 'assets/characters/paul/paul.png', 'assets/characters/paul/paul.json')

    // Mobs
    this.load.atlas('chicken', 'assets/mobs/chicken/chicken.png', 'assets/mobs/chicken/chicken.json')
    this.load.atlas('chicken_baby', 'assets/mobs/chicken/chicken_baby.png', 'assets/mobs/chicken/chicken_baby.json')
    this.load.atlas('bunny', 'assets/mobs/bunny/bunny.png', 'assets/mobs/bunny/bunny.json')
    this.load.atlas('cow', 'assets/mobs/cow/cow.png', 'assets/mobs/cow/cow.json')
    this.load.atlas('cow_baby', 'assets/mobs/cow/cow_baby.png', 'assets/mobs/cow/cow_baby.json')
  }

  async create() {
    this.scene.start('game')
  }
}
