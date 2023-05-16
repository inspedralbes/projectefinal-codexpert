import * as Phaser from 'phaser'

import Preloader from './Phaser/scenes/Preloader'
import Game from './Phaser/scenes/Game'
import InteractUI from './Phaser/scenes/InteractUI'

const PhaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#1e7cb8',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [Preloader, Game, InteractUI]
})

// eslint-disable-next-line import/no-anonymous-default-export
export default PhaserGame
