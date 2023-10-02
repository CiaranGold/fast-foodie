else if (gameState.starRating > 1) {
     if (gameState.currentMeal.fullnessValue<gameState.currentCustomer.fullnessCapacity) {
      gameState.currentCustomer.list[0].setTint(0xDB533A);
      gameState.sfx.servingIncorrect.play();
      gameState.starRating -=2;
      gameState.score -=50;
      gameState.scoreText.setText(gameState.score);
      this.cameras.main.shake(200, 0.001)
    } else {
      //if customer has too much food, turn them orange, lose a star, -25 points
      gameState.currentCustomer.list[0].setTint(0xDB9B3A);
      gameState.sfx.servingEmpty.play();
      gameState.starRating -=1;
      gameState.score -=25;
      gameState.scoreText.setText(gameState.score);
    }
    //player loses if they have no stars

    if (gameState.starRating < 1) {
      // If they have 1 or no stars, they lose
      this.scene.stop('GameScene');
      this.scene.start('LoseScene');
    }
  } else if (gameState.starRating < 1) {
    // Lose the game if no stars
    this.scene.stop('GameScene');
    this.scene.start('LoseScene');
  }



    this.drawStars()
}