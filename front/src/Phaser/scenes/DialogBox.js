import * as Phaser from 'phaser'

export default class DialogBox extends Phaser.Scene {
  gameObject
  dialog
  destroyText = false
  npcName

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
        this.npcName = eventData.npcData.name
        this.createDialogs()
        break

      case 'end_interaction_with_npc':
        if (this.dialogContainer) {
          this.destroyText = true
          this.dialogContainer.destroy()
          this.whoAmITalkingToTextWidth.destroy()
        }
        break

      default:
        // UNKNOWN EVENT
        break
    }
  }

  createDialogs() {
    const containerInteract = this.add.container(0, window.innerHeight / 2.5)

    this.whoAmITalkingToTextWidth = this.sys.game.config.width * 0.95

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

    const whoAmITalkingTo = this.add.text(40, -40, this.npcName, {
      color: '#FFFFFF',
      backgroundColor: '#00000070',
      fontSize: '16px',
      resolution: 2,
      fontFamily: 'pixel_operator',
      wordWrap: { width: this.whoAmITalkingToTextWidth, useAdvancedWrap: true }
    })
    containerInteract.add(whoAmITalkingTo)

    // Crear el texto del cuadro de diálogo
    const dialogText = this.add.text(10, 15, '', {
      fontFamily: 'pixel_operator',
      fontSize: 8,
      color: '#ffffff',
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

    this.dialogContainer.add(dialogText)
    this.dialogContainer.add(skipGif)

    // Calcular las dimensiones ajustadas del contenedor
    const containerScale = 1 / this.cameras.main.zoom
    this.dialogContainer.setScale(containerScale)

    this.add.existing(this.dialogContainer)
    this.add.existing(containerInteract)
  }
}
