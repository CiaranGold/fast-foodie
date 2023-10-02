
const gameState = {
  score: 0,
  starRating: 5,
  currentWaveCount: 1,
  customerIsReady: false,
  cam: {},
  gameSpeed: 3,
  currentMusic: {},
  totalWaveCount: 3,
  countdownTimer: 1500,
  readyForNextOrder: true,
  burgersServedCount: 0,
  friesServedCount: 0,
  shakesServedCount: 0,
  customersServedCount: 0,
  serviceCountdown:{}
  
}

// Gameplay scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    // Preload images
    const baseURL = 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/';
    this.load.image('Chef', `${baseURL}art/Chef.png`);
    this.load.image('Customer-1', `${baseURL}art/Customer-1.png`);
    this.load.image('Customer-2', `${baseURL}art/Customer-2.png`);
    this.load.image('Customer-3', `${baseURL}art/Customer-3.png`);
    this.load.image('Customer-4', `${baseURL}art/Customer-4.png`);
    this.load.image('Customer-5', `${baseURL}art/Customer-5.png`);
    this.load.image('Floor-Server', `${baseURL}art/Floor-Server.png`);
    this.load.image('Floor-Customer', `${baseURL}art/Floor-Customer.png`);
    this.load.image('Tray', `${baseURL}art/Tray.png`);
    this.load.image('Barrier', `${baseURL}art/Barrier.png`);
    this.load.image('Star-full', `${baseURL}art/Star-full.png`);
    this.load.image('Star-half', `${baseURL}art/Star-half.png`);
    this.load.image('Star-empty', `${baseURL}art/Star-empty.png`);

    // Preload song
    this.load.audio('gameplayTheme', [
      `${baseURL}audio/music/2-gameplayTheme.ogg`,
      `${baseURL}audio/music/2-gameplayTheme.mp3`
    ]); // Credit: "Pixel Song #18" by hmmm101: https://freesound.org/people/hmmm101

    // Preload SFX
    this.load.audio('placeFoodSFX', [
      `${baseURL}audio/sfx/placeFood.ogg`,
      `${baseURL}audio/sfx/placeFood.mp3`
    ]); // Credit: "action_02.wav" by dermotte: https://freesound.org/people/dermotte

    this.load.audio('servingCorrectSFX', [
      `${baseURL}audio/sfx/servingCorrect.ogg`,
      `${baseURL}audio/sfx/servingCorrect.mp3`
    ]); // Credit: "Video Game SFX Positive Action Long Tail" by rhodesmas: https://freesound.org/people/djlprojects

    this.load.audio('servingIncorrectSFX', [
      `${baseURL}audio/sfx/servingIncorrect.ogg`,
      `${baseURL}audio/sfx/servingIncorrect.mp3`
    ]); // Credit: "Incorrect 01" by rhodesmas: https://freesound.org/people/rhodesmas

    this.load.audio('servingEmptySFX', [
      `${baseURL}audio/sfx/servingEmpty.ogg`,
      `${baseURL}audio/sfx/servingEmpty.mp3`
    ]); // Credit: "Computer Error Noise [variants of KevinVG207's Freesound#331912].wav" by Timbre: https://freesound.org/people/Timbre

    this.load.audio('fiveStarsSFX', [
      `${baseURL}audio/sfx/fiveStars.ogg`,
      `${baseURL}audio/sfx/fiveStars.mp3`
    ]); // Credit: "Success 01" by rhodesmas: https://freesound.org/people/rhodesmas

    this.load.audio('nextWaveSFX', [
      `${baseURL}audio/sfx/nextWave.ogg`,
      `${baseURL}audio/sfx/nextWave.mp3`
    ]); // Credit: "old fashion radio jingle 2.wav" by rhodesmas: https://freesound.org/people/chimerical
  }

  create() {
    //Reset game values
    this.restartGame();
    // Stop, reassign, and play the new music
    gameState.currentMusic.stop();
    gameState.currentMusic = this.sound.add('gameplayTheme');
    gameState.currentMusic.play({ loop: true });

    // Assign SFX
    gameState.sfx = {};
    gameState.sfx.placeFood = this.sound.add('placeFoodSFX');
    gameState.sfx.servingCorrect = this.sound.add('servingCorrectSFX');
    gameState.sfx.servingIncorrect = this.sound.add('servingIncorrectSFX');
    gameState.sfx.servingEmpty = this.sound.add('servingEmptySFX');
    gameState.sfx.fiveStars = this.sound.add('fiveStarsSFX');
    gameState.sfx.nextWave = this.sound.add('nextWaveSFX');

    // Create environment sprites
    gameState.floorServer = this.add.sprite(gameState.cam.midPoint.x, 0, 'Floor-Server').setScale(0.5).setOrigin(0.5, 0);
    gameState.floorCustomer = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.worldView.bottom, 'Floor-Customer').setScale(0.5).setOrigin(0.5, 1);
    gameState.table = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Barrier').setScale(0.5);

    // Create player and tray sprites
    gameState.tray = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Tray').setScale(0.5);
    gameState.player = this.add.sprite(gameState.cam.midPoint.x, 200, 'Chef').setScale(0.5);

    // Display the score
    gameState.scoreTitleText = this.add.text(gameState.cam.midPoint.x, 30, 'Score', { fontSize: '15px', fill: '#666666',backgroundColor: '#3ADB40',padding: { x: 10, y: 5 },borderColor: '#FFFFFF',borderThickness: 2, }).setOrigin(0.5);
    gameState.scoreText = this.add.text(gameState.cam.midPoint.x, gameState.scoreTitleText.y + gameState.scoreTitleText.height + 20, gameState.score, { fontSize: '30px', fill: '#000000' }).setOrigin(0.5);

    // Display the wave count
    gameState.waveTitleText = this.add.text(gameState.cam.worldView.right - 20, 30, 'Wave', { fontSize: '64px', fill: '#666666' }).setOrigin(1, 1).setScale(0.25);
    gameState.waveCountText = this.add.text(gameState.cam.worldView.right - 20, 30, gameState.currentWaveCount + '/' + gameState.totalWaveCount, { fontSize: '120px', fill: '#000000' }).setOrigin(1, 0).setScale(0.25);

    // Display number of customers left
    gameState.customerCountText = this.add.text(gameState.cam.worldView.right - 20, 80, `Customers left: ${gameState.customersLeftCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);

    //Display burgers served
    gameState.burgersServed = this.add.text(gameState.cam.worldView.right - 20, 200, `Burgers served: ${gameState.burgersServedCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);

    //Display fries served
    gameState.friesServed = this.add.text(gameState.cam.worldView.right - 20, 220, `Fries served: ${gameState.friesServedCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);
    
    //Display shakes served
    gameState.shakesServed = this.add.text(gameState.cam.worldView.right - 20, 240, `Shakes served: ${gameState.shakesServedCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);
    

    
    

    // Generate wave group
    gameState.customers = this.add.group();

    this.generateWave();

    // Keep track of meals fed to customers
    gameState.currentMeal = this.add.group()
    gameState.currentMeal.fullnessValue = 0;

    gameState.keys.Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    gameState.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    gameState.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    gameState.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    gameState.starGroup = this.add.group()

    this.drawStars()

  }

  update() {
    // Previous customer served, who's next!
    if (gameState.readyForNextOrder) {
      gameState.readyForNextOrder = false;

      // Move to the next customer
      gameState.customerIsReady = false;

      if (gameState.customersServedCount > 0) {
        // Hide the fullness meter of the 'served' customer
        gameState.currentCustomer.meterContainer.visible = false;

        // Move up each 'served'customer in the queue
        for (let i = 0; i < gameState.customersServedCount; i++) {
          gameState.previousCustomer = gameState.customers.children.entries[i];
          this.tweens.add({
            targets: gameState.previousCustomer,
            x: '-=300',
            angle: 0,
            duration: 750,
            ease: 'Power2'
          });
        }
      }

      // Move the new current customer to be served
      gameState.currentCustomer = gameState.customers.children.entries[gameState.customersServedCount];
      this.tweens.add({
        targets: gameState.currentCustomer,
        x: gameState.player.x,
        angle: 90,
        delay: 100,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          gameState.currentCustomer.meterContainer.visible = true;
          gameState.customerIsReady = true;

          // If player is too slow (1.5 secs+), go to next order
          gameState.serviceCountdown = this.time.delayedCall(gameState.countdownTimer * gameState.gameSpeed, function () {
            this.moveCustomerLine();
          }, [], this);
        }
      });

      // Move the upcoming customers ahead in line
      for (let j = 0; j < gameState.customersLeftCount; j++) {
        let nextCustomer = gameState.customers.children.entries[gameState.customersServedCount + 1 + j];
        let nextCustomerPositionX = 1024 + (200 * j);
        this.tweens.add({
          targets: nextCustomer,
          x: '-=200',
          delay: 200,
          duration: 1500,
          ease: 'Power2'
        });
      }
    }

    // A customer is in front of the chef
    if (gameState.customerIsReady) {
      // Shrink the current customer's timer meter
      gameState.currentCustomer.timerMeterBody.width = gameState.currentCustomer.meterBase.width - (gameState.serviceCountdown.getProgress() * gameState.currentCustomer.meterBase.width);

      // Based on the ratio of the time, apply a color to the timer
      if (gameState.serviceCountdown.getProgress() > .75) {
        // Red if the timer is close to ending
        gameState.currentCustomer.timerMeterBody.setFillStyle(0xDB533A);
      } else if (gameState.serviceCountdown.getProgress() > .25) {
        // Orange 1/4 of the way through
        gameState.currentCustomer.timerMeterBody.setFillStyle(0xFF9D00);
      } else {
        // Green when there's lots of time
        gameState.currentCustomer.timerMeterBody.setFillStyle(0x3ADB40);
      }
    }

    /* KEYBOARD KEYS */
    // Press A to put burger on the tray
    if (Phaser.Input.Keyboard.JustDown(gameState.keys.A)) {
      this.placeFood('Burger', 5);
      gameState.burgersServedCount ++;
      gameState.burgersServed.setText(`Burgers Served: ${gameState.burgersServedCount}`)
    }

    // Press S to put fries on the tray
    if (Phaser.Input.Keyboard.JustDown(gameState.keys.S)) {
      this.placeFood('Fries', 3);
      gameState.friesServedCount ++;
      gameState.friesServed.setText(`Fries Served: ${gameState.friesServedCount}`)
    }

    // Press D to put a shake on the tray
    if (Phaser.Input.Keyboard.JustDown(gameState.keys.D)) {
      this.placeFood('Shake', 1);
      gameState.shakesServedCount ++;
      gameState.shakesServed.setText(`Shakes Served: ${gameState.shakesServedCount}`)
    }

    // Press Enter to serve the meal
    if (Phaser.Input.Keyboard.JustDown(gameState.keys.Enter)) {
      if (!gameState.readyForNextOrder && gameState.customerIsReady) {
        gameState.serviceCountdown.remove();
        this.moveCustomerLine();
        this.updateCustomerCountText();
      }
    }
  }





  
  // Generate wave
  generateWave() {
    
    //Total number of customers per wave (default is 10)
    gameState.totalCustomerCount = Math.ceil(Math.random() * 10 * gameState.currentWaveCount);
    gameState.customersServedCount = 0;

    this.updateCustomerCountText()

    for (let i = 0; i < gameState.totalCustomerCount; i++) {
      // Container for customers:
      const customerContainer = this.add.container(gameState.cam.worldView.right + (200 * i), gameState.cam.worldView.bottom - 140)

      gameState.customers.add(customerContainer);

      // Customer sprite randomizer (from 5) , add to customerContainer
      let customerImageKey = Math.ceil(Math.random() * 5);
      const customer = this.add.sprite(0, 0, `Customer-${customerImageKey}`).setScale(0.5);
      customerContainer.add(customer);

      // Fullness meter container, add to customerContainer
      customerContainer.fullnessMeter = this.add.group();

      // Define capacity of meter container
      customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5 * gameState.totalWaveCount);

      // If capacity is an impossible number to fill, reshuffle it until it isn't
      while (customerContainer.fullnessCapacity === 12 || customerContainer.fullnessCapacity === 14) {
        customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5) * gameState.totalWaveCount;
      }

      //Add container to position meters
      let meterWidth = customerContainer.fullnessCapacity * 10;
      customerContainer.meterContainer = this.add.container(0, customer.y + (meterWidth / 2));

      // Add the customerContainer.meterContainer to customerContainer
      customerContainer.add(customerContainer.meterContainer);

      // Add meter background (grey)
      customerContainer.meterBase = this.add.rectangle(-130, customer.y, meterWidth, 33, 0x707070).setOrigin(0);
      customerContainer.meterBase.setStrokeStyle(6, 0x707070);
      customerContainer.meterBase.angle = -90;
      customerContainer.meterContainer.add(customerContainer.meterBase);

      // Add the timer countdown meter body
      customerContainer.timerMeterBody = this.add.rectangle(customerContainer.meterBase.x + 22, customer.y + 1, meterWidth + 4, 12, 0x3ADB40).setOrigin(0);
      customerContainer.timerMeterBody.angle = -90;
      customerContainer.meterContainer.add(customerContainer.timerMeterBody);

      // Create container for individual fullness blocks
      customerContainer.fullnessMeterBlocks = [];

      // Create fullness meter blocks
      for (let j = 0; j < customerContainer.fullnessCapacity; j++) {
        customerContainer.fullnessMeterBlocks[j] = this.add.rectangle(customerContainer.meterBase.x, customer.y - (10 * j), 10, 20, 0xDBD53A).setOrigin(0);
        customerContainer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB9B42E);
        customerContainer.fullnessMeterBlocks[j].angle = -90;
        customerContainer.fullnessMeter.add(customerContainer.fullnessMeterBlocks[j]);
        customerContainer.meterContainer.add(customerContainer.fullnessMeterBlocks[j]);
      }

      // Hide meters
      customerContainer.meterContainer.visible = false;
    }
  }
    //update customer count, wave count
  updateCustomerCountText() {
    gameState.customersLeftCount = gameState.totalCustomerCount - gameState.customersServedCount;
    gameState.customerCountText.setText(`Customers left: ${gameState.customersLeftCount}`)
    gameState.waveCountText.setText(gameState.currentWaveCount + '/' + gameState.totalWaveCount)
  }

  // Place food down
  placeFood(food, fullnessValue) {
    if (gameState.currentMeal.children.entries.length < 3 && gameState.customerIsReady) {
      gameState.sfx.placeFood.play();//

      let Xposition = gameState.tray.x;
      switch (gameState.currentMeal.children.entries.length) {
        case 0:
          Xposition -= 90;
          break;
        case 2:
          Xposition += 90;
          break;
      }

      gameState.currentMeal.create(Xposition, gameState.tray.y, food).setScale(0.5);
      gameState.currentMeal.fullnessValue += fullnessValue;
      
      //change block colors to show what is remaining on order
      for (let i = 0; i < gameState.currentMeal.fullnessValue; i++) {
        if (i < gameState.currentCustomer.fullnessCapacity) {
          if (gameState.currentCustomer.fullnessCapacity === gameState.currentMeal.fullnessValue) {
            // If exactly full, show 'just right' color
            gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0x3ADB40);
            gameState.currentCustomer.fullnessMeterBlocks[i].setStrokeStyle(2, 0x2EB94E);
          } else if (gameState.currentMeal.fullnessValue > gameState.currentCustomer.fullnessCapacity) {
            // If too full, turn red
            gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0xDB533A);
            gameState.currentCustomer.fullnessMeterBlocks[i].setStrokeStyle(2, 0xB92E2E);
          } else {
            // Otherwise, change color to indicate some food served
            gameState.currentCustomer.fullnessMeterBlocks[i].setFillStyle(0xFFFA81);
          }
        }
      }
    }
  }


  moveCustomerLine() {
  // Set current customer to be full
  gameState.currentCustomer.fullnessValue = gameState.currentMeal.fullnessValue;  
this.updateStars(game, gameState.currentCustomer.fullnessValue, gameState.currentCustomer.fullnessCapacity)


// Reset current meal by removing old children and resetting fullness
gameState.currentMeal.clear(true);
gameState.currentMeal.fullnessValue = 0;

// Move to next customer
gameState.customersServedCount += 1;

// If all customers are done
if (gameState.customersServedCount === gameState.totalCustomerCount) {
  gameState.currentWaveCount += 1;
  this.input.keyboard.enabled = false;
  

  // End the game after 3 waves
  if (gameState.currentWaveCount > gameState.totalWaveCount) {
    this.scene.stop('GameScene');
    this.scene.start('WinScene');
  } else {
    // OR destroy and generate a new wave
    this.destroyWave();
    gameState.gameSpeed -= 1;
    
  }
} else {
  // Send the next person
  gameState.readyForNextOrder = true;
  }
}

  //drawStars method, adds rating stars to gameState.starGroup 
  drawStars() {
    // Get rid of any old stars
    gameState.starGroup.clear(true);
  
    // Draw each star until it matches the StarRating
    for (let i = 0; i < gameState.starRating; i++) {
      let spacer = i * 50;
      gameState.starGroup.create(20 + spacer, 20, 'Star-full').setOrigin(0).setScale(0.5);
    }
  
    // Calculate the number of empty stars to draw
    let emptyStars = 5 - gameState.starRating;
  
    // Draw each empty star after the filled stars
    for (let i = 0; i < emptyStars; i++) {
      let spacer = (gameState.starRating + i) * 50; // Use the combined spacer value
      gameState.starGroup.create(20 + spacer, 20, 'Star-empty').setOrigin(0).setScale(0.5);
    }
  }
  //customer reacts to served food, score updated
  /* updateStars() {
    if (gameState.currentMeal.fullnessValue === gameState.currentCustomer.fullnessCapacity) {
      //customer goes green to indicate contentness
      gameState.currentCustomer.list[0].setTint(0x3ADB40);
      gameState.sfx.servingCorrect.play();
      //score updated, +100 for correct meal
      gameState.score +=100;
      gameState.scoreText.setText(gameState.score);
      // star added unless already at 5 stars already
      if (gameState.starRating < 5) {
        gameState.starRating ++;
      // play sound to indicate at 5 stars  
        if (gameState.starRating === 5) {
          gameState.sfx.fiveStars.play()
        }
      }
      //if customer has not enough food, turn them red, lose two stars, -50 points
    } 
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

    this.drawStars()
} */
// Update stars
updateStars() {
  if (gameState.currentMeal.fullnessValue === gameState.currentCustomer.fullnessCapacity) {
    // If exactly full customer goes green to indicate contentness
    gameState.currentCustomer.list[0].setTint(0x3ADB40);
    gameState.sfx.servingCorrect.play();

    // //score updated, +100 for correct meal
    gameState.score += 100;
    gameState.scoreText.setText(gameState.score);

    // Then add a star (unless at 5 star rating already)
    if (gameState.starRating < 5) {
      gameState.starRating += 1;

      if (gameState.starRating === 5) {
        // Let player know when they reach 5 stars
        gameState.sfx.fiveStars.play();
      }
    }
  } else if (gameState.starRating > 1) {
    // If too full, remove a star
    if (gameState.fullnessValue > 0) {
      gameState.starRating -= 1;
      // Also turn the customer orange
      gameState.currentCustomer.list[0].setTint(0xDBD53A);
      gameState.sfx.servingIncorrect.play();
      gameState.score -=10;
      gameState.scoreText.setText(gameState.score);
    } else {
      // Turn the customer red as not full, shake screen indicator
      gameState.currentCustomer.list[0].setTint(0xDB533A);
      gameState.sfx.servingEmpty.play();
      gameState.starRating -= 2;
      gameState.score -=25;
      gameState.scoreText.setText(gameState.score);
      this.cameras.main.shake(200, 0.001)
    }

    if (gameState.starRating < 1) {
      // If they have 1 or no stars, they lose
      this.scene.stop('GameScene');
      this.scene.start('LoseScene');
    }
  } else {
    // Lose the game if no stars
    this.scene.stop('GameScene');
    this.scene.start('LoseScene');
  }
  this.drawStars();
}
  
  
 
  //
  destroyWave() {

  gameState.sfx.nextWave.play()
  // move all characters left
  for (let i = 0; i < gameState.customersServedCount; i++) {
    // Move each customer forward and rotate them
    this.tweens.add({
      targets: gameState.customers.children.entries[i],
      x: '-=300',
      angle: 0,
      duration: 750,
      ease: 'Power2',
      onComplete: () => {
        // Move the customers offscreen
        this.tweens.add({
          targets: gameState.customers.children.entries[i],
          x: '-=900',
          duration: 1200,
          ease: 'Power2',
          onComplete: () => {
            // Kill old customers by removing them from the group
            gameState.customers.clear(true);
            this.generateWave();

            // Set ready for next order
            gameState.readyForNextOrder = true;
            this.input.keyboard.enabled = true;
          }
        });
      }
    });
  }

  this.drawStars()
}

 //rest values so game runs ok after win/loss 
  restartGame() {
    gameState.score = 0;
    gameState.starRating = 5;
    gameState.currentWaveCount = 1;
    gameState.customersServedCount = 0;
    gameState.readyForNextOrder = true;
    gameState.gameSpeed = 3;
    gameState.burgersServedCount = 0;
    gameState.friesServedCount = 0;
    gameState.shakesServedCount = 0;
  }
  // class GameScene closes
}
