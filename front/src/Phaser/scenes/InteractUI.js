import * as Phaser from 'phaser'

export default class InteractUI extends Phaser.Scene {
  constructor() {
    super({ key: 'interact-ui' })
  }

  create() {
    const container = this.add.container(window.innerWidth, window.innerHeight)

    const text = this.add.text(-450, -75, 'Press', { color: '#FFFFFF', fontSize: '25px', fontStyle: 'bold' })
    const text2 = this.add.text(-325, -75, 'or', { color: '#FFFFFF', fontSize: '25px', fontStyle: 'bold' })
    const text3 = this.add.text(-225, -75, 'to interact', { color: '#FFFFFF', fontSize: '25px', fontStyle: 'bold' })

    const imgE = this.add.image(-350, -62, 'e-key')

    const imgEnter1 = this.add.image(-269, -79, 'enter1-key')

    const imgEnter2 = this.add.image(-250, -79, 'enter2-key')

    const imgEnter3 = this.add.image(-269, -60, 'enter3-key')

    const imgEnter4 = this.add.image(-250, -60, 'enter4-key')

    imgE.displayWidth = 30
    imgE.displayHeight = 30
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
