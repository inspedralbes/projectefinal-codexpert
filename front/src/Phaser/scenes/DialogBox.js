import * as Phaser from 'phaser'

export default class DialogBox extends Phaser.Scene {
  gameObject
  dialog
  destroyText = false

  constructor() {
    super({ key: 'dialog-ui' })

    // Window event listener for event handling
    window.addEventListener('message', this.handleMessage)
  }

  handleMessage = (event) => {
    const eventData = event.data

    // Event handle
    switch (eventData.type) {
      case 'interaction_with_npc':
        this.destroyText = true
        this.dialog = eventData.npcData.message
        this.createDialogs()
        break

      case 'end_interaction_with_npc':
        if (this.dialogContainer) {
          this.destroyText = true
          this.dialogContainer.destroy()
        }
        break

      default:
        // UNKNOWN EVENT
        break
    }
  }

  createDialogs() {
    // Obtener las dimensiones del lienzo
    const canvasWidth = this.sys.game.config.width
    const canvasHeight = this.sys.game.config.height

    // Calcular las dimensiones del cuadro de diálogo
    const dialogWidth = canvasWidth * 0.8
    const dialogHeight = canvasHeight * 0.2

    // Calcular la posición del cuadro de diálogo para que esté centrado en la pantalla
    const dialogX = (canvasWidth - dialogWidth) * 0.5
    const dialogY = (canvasHeight - dialogHeight)

    // Crear un contenedor para el cuadro de diálogo
    this.dialogContainer = this.add.container(dialogX, dialogY)

    // Crear el fondo del cuadro de diálogo
    const dialogBackground = this.add.graphics()
    dialogBackground.fillStyle(0x000000, 0.8)
    dialogBackground.fillRect(0, 0, dialogWidth, dialogHeight)
    this.dialogContainer.add(dialogBackground)

    const textWidth = dialogWidth * 0.95

    // Crear el texto del cuadro de diálogo
    const dialogText = this.add.text(10, 15, '', {
      fontFamily: 'pixel_operator',
      fontSize: 8,
      // fontStyle: 'bold',
      color: '#ffffff',
      // strokeThickness: 2,
      // stroke: '#000',
      wordWrap: { width: textWidth, useAdvancedWrap: true },
      resolution: 2,
      align: 'left'
    })

    const fullText = this.dialog
    let currentCharIndex = 0
    this.destroyText = false

    // Configura una función para mostrar progresivamente el texto
    function showNextCharacter() {
      if (this.destroyText) {
        return
      }
      dialogText.text += fullText[currentCharIndex]
      currentCharIndex++

      // Verifica si se han mostrado todos los caracteres
      if (currentCharIndex < fullText.length) {
        // Agrega un retardo antes de mostrar el siguiente carácter
        this.time.delayedCall(50, showNextCharacter, null, this)
      }

      if (currentCharIndex >= fullText.length) {
        window.postMessage({ type: 'dialog_end-msg' }, '*')
      }
    }

    // Inicia la función para mostrar el texto progresivamente
    showNextCharacter.call(this)

    // Añadir el marco al cuadro de diálogo
    const dialogFrame = this.add.graphics()
    dialogFrame.lineStyle(2, 0x000000, 0.9) // Grosor y color del marco
    dialogFrame.strokeRect(0, 0, dialogWidth, dialogHeight) // Dimensiones del marco
    this.dialogContainer.add(dialogFrame)

    const skipGif = this.add.image(dialogText.x + textWidth * 1.5, dialogHeight - 15, 'skip_dialog')

    // skipGif.displayWidth = 25
    // skipGif.displayHeight = 20

    this.dialogContainer.add(dialogText)
    this.dialogContainer.add(skipGif)

    // Calcular las dimensiones ajustadas del contenedor
    const containerScale = 1 / this.cameras.main.zoom
    this.dialogContainer.setScale(containerScale)

    this.add.existing(this.dialogContainer)
  }
}
