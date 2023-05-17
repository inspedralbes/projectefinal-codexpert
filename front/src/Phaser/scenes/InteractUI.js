import * as Phaser from 'phaser'

export default class InteractUI extends Phaser.Scene {
  constructor() {
    super({ key: 'interact-ui' })
  }

  create() {
    const container = this.add.container(window.innerWidth / 2, window.innerHeight / 2)

    const text = this.add.text(-280, -40, 'Press', { color: '#FFFFFF', fontSize: '15px', fontStyle: 'bold' })
    const text2 = this.add.text(-200, -40, 'or', { color: '#FFFFFF', fontSize: '15px', fontStyle: 'bold' })
    const text3 = this.add.text(-125, -40, 'to interact', { color: '#FFFFFF', fontSize: '15px', fontStyle: 'bold' })

    const imgE = this.add.image(-215, -32, 'e-key')

    const imgEnter1 = this.add.image(-165, -49, 'enter1-key')

    const imgEnter2 = this.add.image(-145, -49, 'enter2-key')

    const imgEnter3 = this.add.image(-165, -30, 'enter3-key')

    const imgEnter4 = this.add.image(-145, -30, 'enter4-key')

    imgE.displayWidth = 25
    imgE.displayHeight = 25
    imgEnter1.displayWidth = 20
    imgEnter1.displayHeight = 20
    imgEnter2.displayWidth = 20
    imgEnter2.displayHeight = 20
    imgEnter3.displayWidth = 20
    imgEnter3.displayHeight = 20
    imgEnter4.displayWidth = 20
    imgEnter4.displayHeight = 20

    container.add(imgE)
    container.add(imgEnter1)
    container.add(imgEnter2)
    container.add(imgEnter3)
    container.add(imgEnter4)
    container.add(text)
    container.add(text2)
    container.add(text3)

    this.add.existing(container)
  }
}
