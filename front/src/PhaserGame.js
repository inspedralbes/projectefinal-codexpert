import Phaser from 'phaser'

import { Game, Preloader } from './Phaser/scenes'

const PhaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  width: 500,
  height: 250,
  parent: 'phaser-container',
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
