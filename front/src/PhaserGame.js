import Phaser from 'phaser'

import Preloader from './Phaser/scenes/Preloader'
import Game from './Phaser/scenes/Game'

const PhaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#1e7cb8',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 2
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [Preloader, Game]
})

// eslint-disable-next-line import/no-anonymous-default-export
export default PhaserGame
