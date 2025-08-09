const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load the sprite sheet for the backpack character
    this.load.spritesheet('backpack', './assets/backpack.png', {
        frameWidth: 40,
        frameHeight: 75
    });

    // Load the sprite sheet for the stone man enemy
    this.load.image('stone_man', './assets/stone_man.svg');

    // Load parallax background layers
    this.load.image('background_layer_1', './assets/background_layer_1.png');
    this.load.image('background_layer_2', './assets/background_layer_2.png');
}

function create() {
    // Set background to violet
    this.cameras.main.setBackgroundColor('#8A2BE2');

    
    // Add parallax background layers
    this.background1 = this.add.tileSprite(400, 300, 800, 600, 'background_layer_1');
    this.background1.setScrollFactor(0.5); // Slower scroll for distant layer

    this.background2 = this.add.tileSprite(400, 300, 800, 600, 'background_layer_2');
    this.background2.setScrollFactor(0.7); // Faster scroll for closer layer
    
    // Create ground and platforms
    const ground = this.add.rectangle(0, 580, 800, 40, 0x00FF00);
    ground.setOrigin(0, 0);
    this.physics.add.existing(ground, true);
    
    // Add platforms
    const platform1 = this.add.rectangle(200, 480, 150, 20, 0x8B4513);
    platform1.setOrigin(0, 0);
    this.physics.add.existing(platform1, true);
    
    const platform2 = this.add.rectangle(450, 380, 150, 20, 0x8B4513);
    platform2.setOrigin(0, 0);
    this.physics.add.existing(platform2, true);
    
    // Create backpack sprite
    player = this.physics.add.sprite(100, 450, 'backpack');
    player.body.setSize(40, 60);
    player.body.setOffset(0, 0);
    player.body.setCollideWorldBounds(true);
    
    // Create animations
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'backpack', frame: 0 }],
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'run',
        frames: [
            { key: 'backpack', frame: 1 },
            { key: 'backpack', frame: 2 }
        ],
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'backpack', frame: 3 }],
        frameRate: 10,
        repeat: -1
    });
    
    // Start with idle animation
    player.anims.play('idle');

    player.hasPowerUp = false;
    
    // Create enemies group
    enemies = this.physics.add.group();
    
    // Add walker enemy (stone sprite)
    const enemy = this.physics.add.sprite(700, 450, 'stone_man');
    enemy.setOrigin(0.5, 0.5);
    enemy.body.setSize(40, 60);
    enemy.body.setOffset(0, 0);
    enemies.add(enemy);
    enemy.body.setAllowGravity(true);
    enemy.body.setCollideWorldBounds(true);
    enemy.body.setVelocityX(50); // Slower initial movement

    // Create projectiles group
    projectiles = this.physics.add.group();

    // Create collectibles groups
    keys = this.physics.add.group();
    stars = this.physics.add.group();

    // Add star collectible
    const star = this.physics.add.sprite(300, 400, 'star');
    stars.add(star);

     // Add powerUp collectible
    powerUps = this.physics.add.group();
    const powerUp = this.physics.add.sprite(150, 400, 'powerup');
    powerUps.add(powerUp);
    powerUp.body.setAllowGravity(true);

    // Collisions
    this.physics.add.collider(player, powerUps, collectPowerUp, null, this);
    this.physics.add.collider(powerUps, ground);
    this.physics.add.collider(enemies, ground);
    this.physics.add.collider(enemies, [platform1, platform2]); // Enemies collide with platforms
    this.physics.add.collider(stars, ground);
    this.physics.add.collider(stars, [platform1, platform2]);
    this.physics.add.collider(keys, ground);
    this.physics.add.collider(keys, [platform1, platform2]);
    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, [platform1, platform2]);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    this.physics.add.collider(player, keys, collectKey, null, this);
    this.physics.add.collider(player, stars, collectStar, null, this);
    this.physics.add.collider(projectiles, ground, (projectile) => projectile.destroy());
    this.physics.add.collider(projectiles, [platform1, platform2], (projectile) => projectile.destroy());
    this.physics.add.overlap(player, projectiles, hitEnemy, null, this); // Projectiles hit player
    
    // Enable cursor keys
    cursors = this.input.keyboard.createCursorKeys();
    
    // Enemy movement boundaries (wider range)
    enemyBounds = { left: 200, right: 700 };
    
    // Initialize game state variables
    keysCollected = 0;
    starsCollected = 0;
    lives = 3;
    
    // Score display
    scoreText = this.add.text(16, 16, 'Keys: 0 Stars: 0', { 
        fontSize: '20px', 
        fill: '#FFF' 
    });
    
    // Lives display
    livesText = this.add.text(16, 40, 'Lives: 3', { 
        fontSize: '20px', 
        fill: '#FFF' 
    });

    // Power-up display
    powerUpText = this.add.text(16, 64, 'Power-up: Off', {
        fontSize: '20px',
        fill: '#FFF'
    });
    
    // Track total collectibles
    totalStars = stars.getChildren().length;
    totalKeys = 0; // Will be set when keys are created
}

function update() {
    // Horizontal movement
    player.body.setVelocityX(0);

    if (player.hasPowerUp) {
        // Power-up effect: double speed
        if (cursors.left.isDown) {
            player.body.setVelocityX(-320);
            player.setFlipX(true);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(320);
            player.setFlipX(false);
        }
    } else {
        // Normal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-160);
            player.setFlipX(true);
            if (player.body.onFloor()) {
                player.anims.play('run', true);
            }
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(160);
            player.setFlipX(false);
            if (player.body.onFloor()) {
                player.anims.play('run', true);
            }
        } else if (player.body.onFloor()) {
            player.anims.play('idle', true);
        }
    }
    
    // Jumping
    if (cursors.up.isDown && player.body.onFloor()) {
        player.body.setVelocityY(-330);
        player.anims.play('jump', true);
    }
    
    // Enemy AI - obstacle-aware movement and jumping
    enemies.getChildren().forEach(enemy => {
        if (enemy.texture.key === 'stone_man') { // Walker enemy behavior
            if (enemy.body.blocked.right || enemy.x > enemyBounds.right) {
                enemy.body.setVelocityX(-50);
            } else if (enemy.body.blocked.left || enemy.x < enemyBounds.left) {
                enemy.body.setVelocityX(50);
            }
        } 
    });

    // Update power-up text
    if (player.hasPowerUp) {
        powerUpText.setText('Power-up: On');
    } else {
        powerUpText.setText('Power-up: Off');
    }

    // Power-up tint
    if (player.hasPowerUp) {
        player.setTint(0x00ffff); // Cyan tint
    } else {
        player.clearTint();
    }

    // Parallax scrolling for background layers
    this.background1.tilePositionX = this.cameras.main.scrollX * 0.5;
    this.background2.tilePositionX = this.cameras.main.scrollX * 0.7;
}

function hitEnemy(player, enemy) {
    // Check if player is jumping on enemy
    if (player.body.touching.down && enemy.body.touching.up) {
        // Create key collectible when enemy is defeated
        const key = this.physics.add.sprite(enemy.x, enemy.y, 'key');
        keys.add(key);
        enemy.destroy();
        
        // Position key on ground
        key.y = 550; // Ground level
        
        // Update total keys count
        totalKeys++;
    } else {
        // Player gets hurt: reduce life and check game over
        lives--;
        livesText.setText(`Lives: ${lives}`);
        
        if (lives <= 0) {
            // Show game over text
            const gameOverText = this.add.text(400, 300, 'Game Over', { 
                fontSize: '40px', 
                fill: '#FF0000' 
            });
            gameOverText.setOrigin(0.5);
            
            // Restart after delay
            this.time.delayedCall(2000, () => {
                this.scene.restart();
            }, [], this);
        } else {
            // Reset player position
            player.setPosition(100, 450);
        }
    }
}

function collectKey(player, key) {
    key.destroy();
    keysCollected++;
    updateScore();
    checkWinCondition.call(this);
}

function collectStar(player, star) {
    star.destroy();
    starsCollected++;
    updateScore();
    checkWinCondition.call(this);
}

function updateScore() {
    scoreText.setText(`Keys: ${keysCollected} Stars: ${starsCollected}`);
}

// function checkWinCondition() {
//     if (starsCollected === totalStars && keysCollected === totalKeys) {
//         // Show win text
//         const winText = this.add.text(400, 300, 'You Win!', { 
//             fontSize: '40px', 
//             fill: '#00FF00' 
//         });
//         winText.setOrigin(0.5);
        
//         // Restart after delay
//         this.time.delayedCall(2000, () => {
//             this.scene.restart();
//         }, [], this);
//     }
// }

function applyPowerUp(player) {
    player.hasPowerUp = true;
    player.body.setVelocityX(320); // Double speed
    // Reset power-up after 5 seconds
    this.time.delayedCall(5000, () => {
        player.hasPowerUp = false;
        player.body.setVelocityX(160); // Normal speed
    }, [], this);
}

function collectPowerUp(player, powerUp) {
    console.log('Power-up collected!');
    powerUp.destroy();
    applyPowerUp.call(this, player);
}
