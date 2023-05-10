import * as Phaser from 'phaser'
import 'assets/tiles/dungeon_oc.json'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('tiles', 'assets/tiles/dungeon_tiles_extruded.png')
    this.load.tilemapTiledJSON('dungeon_tiles', 'assets/tiles/dungeon-01.json')

    this.load.atlas('fauna', 'assets/characters/fauna/fauna.png', 'assets/characters/fauna/fauna.json')
    this.load.atlas('lizard_m', 'assets/enemies/lizard/male_lizard/male_lizard.png', 'assets/enemies/lizard/male_lizard/male_lizard_atlas.json')

    this.load.image('ui-heart-empty', 'assets/ui/ui_heart_empty.png')
    this.load.image('ui-heart-full', 'assets/ui/ui_heart_full.png')
  }

  create() {
    this.scene.start('game')
  }
}
