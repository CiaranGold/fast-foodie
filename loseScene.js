// Lose screen
class LoseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoseScene' })
  }

  preload() {
    // Preload screen
    this.load.image('lose', `art/lose_screen.png`);

    // Preload song
    this.load.audio('loseTheme', [
      `audio/music/4-loseTheme.ogg`,
      `audio/music/4-loseTheme.mp3`
    ]); // Credit: "Pixel Song #18" by hmmm101: https://freesound.org/people/hmmm101
  }

  create() {
    // Stop, reassign, and play the new music
    gameState.currentMusic.stop();
    gameState.currentMusic = this.sound.add('loseTheme');
    gameState.currentMusic.play({ loop: true });

    // Lose screen
    this.add.image(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'lose').setOrigin(0.5).setScale(0.5);

    // Score text 
    this.add.text(gameState.cam.midPoint.x, gameState.cam.midPoint.y + 250, `Score: ${gameState.score}`, { fontSize: '30px', fill: '#ffffff' }).setOrigin(0.5);
    //Burgers served
    this.add.text(game.config.width - 80, gameState.cam.midPoint.y - 30, `Burgers Served: ${gameState.burgersServedCount}`, { fontSize: '30px', fill: '#ffffff' }).setOrigin(1,0.5);
    //Fries served
    this.add.text(game.config.width - 80, gameState.cam.midPoint.y - 0, `Fries Served: ${gameState.friesServedCount}`, { fontSize: '30px', fill: '#ffffff' }).setOrigin(1,0.5);
    //Shake served
    this.add.text(game.config.width - 80, gameState.cam.midPoint.y + 30, `Shakes Served: ${gameState.shakesServedCount}`, { fontSize: '30px', fill: '#ffffff' }).setOrigin(1,0.5);
    
    // Prompt to restart
    this.add.text(gameState.cam.midPoint.x, gameState.cam.midPoint.y + 300, 'Press enter to play again', { fontSize: '30px', fill: '#ffffff' }).setOrigin(0.5);

    // Refine enter key again as diff scene
    gameState.keys.Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    // Press Enter to start the game
    if (Phaser.Input.Keyboard.JustDown(gameState.keys.Enter)) {
      this.scene.stop('LoseScene');
      this.scene.start('TutorialScene');
    }
  }
}