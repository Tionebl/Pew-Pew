
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 20;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 5;
const SCORE_UNIT = 10;
const MAX_LEVEL = 3;

class GameObject {
    constructor(x, y, width, height, color) {
      // position obj
      this.x = x;
      this.y = y;

      // size obj
      this.width = width;
      this.height = height;

      this.color = color;
    }

    // Draw the object on the canvas
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);

    }

    // Update the object's position
    update(dx, dy) {
      this.x += dx;
      this.y += dy;
    }

    // check collides avec d'autres obj
    collidesWith(obj) {
      return (this.x < obj.x + obj.width
           && this.x + this.width > obj.x
           && this.y < obj.y + obj.height 
           && this.y + this.height > obj.y);
    }
  }

  class Bullet extends GameObject {
    constructor(x, y, width, height, color, dy) {
      super(x, y, width, height, color);
      // direction de la balle
      this.dy = dy;
    }
    
    update(x, y) {
      this.y += this.dy; 
    }
  }

  class Canon extends GameObject {
    constructor(x, y, width, height, color, canvasHeight) {
      super(x, y, width, height, color);
      this.canvasHeight = canvasHeight;
      // canon bullet size.
      this.bulletWidth = 4;
      this.bulletHeight = 8;

      this.bulletColor = "#ff7800";
      // Bullets fired by the canon
      this.bullets = [];
    }

    draw(ctx) {
      super.draw(ctx);
      // Draw the canon bullets.
      for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(ctx);
        this.bullets[i].update(0, 0);

        // on regarde si la balle est dans le champs
        if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
          // Remove the bullet from the array.
          this.bullets.splice(i, 1);
        }
      }
    }
    
    // pour tirer depuis  le canon
    shoot(dy) {
      this.bullets.push(new Bullet(
        this.x + this.width / 2 - this.bulletWidth / 2,
        this.y - this.bulletHeight,
        this.bulletWidth,
        this.bulletHeight,
        this.bulletColor,
        dy
      ));
    }
  }
  
  class Player extends Canon {
    constructor(x, y, width, height, color, canvasHeight, canvasWidth) {
      super(x, y, width, height, color, canvasHeight);
      this.canvasWidth = canvasWidth;
    }

    // position du joueur uptade
    update(dx, dy) {
      super.update(dx, dy);

      // Keep the player within the canvas
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > this.canvasWidth) {
        this.x = this.canvasWidth - this.width;
      }
    }
  }

  class target {
    constructor(x, y, width, height, color, noParts) {
      // tableau vide pour les targets
      this.parts = [];
      for (var i = 0; i < noParts; i++) {
        for (var j = 0; j < noParts; j++) {
          this.parts.push(new GameObject(
            x + i * width,
            y + j * height,
            width,
            height,
            color
          ));
        }
      }
    }
        
    // creation target sur le canvas
    draw(ctx) {
      for (var i = 0; i < this.parts.length; i++) {
        this.parts[i].draw(ctx);
      }
    }

    // on regarde si la target collides avec d'autres obj
    collidesWith(obj) {
      for (var i = 0; i < this.parts.length; i++) {
        if (this.parts[i].collidesWith(obj)) {
          return true;
        }
      }
      return false;
    }

    // Remove sub object on collide.
    removeOnCollide(obj) {
      for (var i = 0; i < this.parts.length; i++) {
        if (this.parts[i].collidesWith(obj)) {
          this.parts.splice(i, 1);
          break;
        }
      }
    }
  }

  var game = {};
  
  game.canvas = document.getElementById('canvas');
  game.ctx = game.canvas.getContext('2d');
  
  game.backgroundColor = '#000000';

  //target
  game.targetParts = 8;
  game.noOftarget = 8;
  game.targetSpace = 85;

  // enemies
  let img = document.getElementById("canonimg");
  game.enemiesEachLine = 20;
  game.enemyLines = 8;
  game.enemySpace = 30;
  game.enemyFireRate = 1000;
  game.enemyFireTimer = 0;
  game.enemyDirection = 1;
  game.enemyStep = 5;
  
  // game loop
  game.update = function() {
    //  canvas background
    game.ctx.fillStyle = game.backgroundColor;
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    
    //  player
    game.player.draw(game.ctx);

    // Draw target
    for (var i = 0; i < game.target.length; i++) {
      game.target[i].draw(game.ctx);
    }

    // Draw enemies
    for (var i = 0; i < game.enemies.length; i++) {
      game.enemies[i].draw(game.ctx);
      game.enemies[i].update(game.enemyDirection, 0);
    }

    // Check if the player has destroyed all enemies
    if (game.enemies.length == 0) {
      // Reset the game
      game.restart();
    }

    // Check if the enemies are out of bounds.
    if (game.enemyDirection == 1)
    {
      // Find the enemy closest to the right side of the screen
      var closestToRightSideEnemy = game.enemies[0];
      for (var i = 1; i < game.enemies.length; i++) {
        if (game.enemies[i].x > closestToRightSideEnemy.x) {
          closestToRightSideEnemy = game.enemies[i];
        }
      }

      // Check if the enemy closest to the right side of 
      // the screen has reached the right side of the screen.
      if (closestToRightSideEnemy.x + 
          closestToRightSideEnemy.width > game.canvas.width) {
        // Reverse the direction of the enemies.
        game.enemyDirection = -1;            
        // Move the enemies down.
        for (var i = 0; i < game.enemies.length; i++) {
          game.enemies[i].update(0, game.enemyStep);
        }
      }          
    }
    else if (game.enemyDirection == -1)
    {
      // Find the enemy closest to the left side of the screen
      var closestToLeftSideEnemy = game.enemies[0];
      for (var i = 1; i < game.enemies.length; i++) {
        if (game.enemies[i].x < closestToLeftSideEnemy.x) {
          closestToLeftSideEnemy = game.enemies[i];
        }
      }

      // Check if the enemy closest to the left side of 
      // the screen has reached the left side of the screen.
      if (closestToLeftSideEnemy.x < 0) {
        // Reverse the direction of the enemies.
        game.enemyDirection = 1;
        // Move the enemies down.
        for (var i = 0; i < game.enemies.length; i++) {
          game.enemies[i].update(0, game.enemyStep);
        }
      }
    }

    // Enemy fire counter
    // game.enemyFireTimer += Math.random() * 10;
    // if (game.enemyFireTimer > game.enemyFireRate) {
    //   game.enemyFireTimer = 0;
    //   // Fire enemy bullet
    //   game.enemies[Math.floor(Math.random() * game.enemies.length)].shoot(5);
    // }

    // Check if player bullet collides with target
    for (var i = 0; i < game.player.bullets.length; i++) {
      for (var j = 0; j < game.target.length; j++) {
        if (game.target[j].collidesWith(game.player.bullets[i])) {
          game.target[j].removeOnCollide(game.player.bullets[i]);
          game.player.bullets.splice(i, 1);
          score += SCORE_UNIT;
          break;
        }
      }
    }

    // Check if enemy bullet collides with target
    for (var i = 0; i < game.enemies.length; i++) {
      for (var j = 0; j < game.enemies[i].bullets.length; j++) {
        for (var k = 0; k < game.target.length; k++) {
          if (game.target[k].collidesWith(game.enemies[i].bullets[j])) {
            game.target[k].removeOnCollide(game.enemies[i].bullets[j]);
            game.enemies[i].bullets.splice(j, 1);
            break;
          }
        }
      }
    }

    // Check if player bullet collides with enemy
    for (var i = 0; i < game.player.bullets.length; i++) {
      for (var j = 0; j < game.enemies.length; j++) {
        if (game.enemies[j].collidesWith(game.player.bullets[i])) {
          game.enemies.splice(j, 1);
          game.player.bullets.splice(i, 1);
          break;
        }
      }
    }

    // balle ennemie check avec joueur
    for (var i = 0; i < game.enemies.length; i++) {
      for (var j = 0; j < game.enemies[i].bullets.length; j++) {
        if (game.player.collidesWith(game.enemies[i].bullets[j])) {
          game.restart();
          break;
        }
      }
    }
  
    // si ennemie s'approche trop
    for (var i = 0; i < game.enemies.length; i++) {
      if (game.enemies[i].y + game.enemies[i].height > game.player.y) {
        game.restart();
        break;
      }
    }
  }

  // Defines a function to handle key events
  game.keydown = function(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      game.player.update(-10, 0);
    }
    else if (e.keyCode == 39 || e.keyCode == 68) {
      game.player.update(10, 0);
    }
    else if (e.keyCode == 32) { // space bar
      game.player.shoot(-5);
    }
  }      
  
  // start the game loop
  game.init = function() {
    // Set the game loop
    game.interval = setInterval(game.update, 1000 / 60);

    // Setup player
    game.player = new Player(
      game.canvas.width / 2 - 50,
      game.canvas.height - 50,
      20,
      20,
      '#0099CC',
      game.canvas.width
    );

    // Setup target
    game.target = [];
    for (var i = 0; i < game.noOftargget; i++) {
      game.target.push(new target(
        game.targetSpace + i * game.targetSpace,
        game.canvas.height - 180,
        5,
        5,
        '#ffffff',
        game.targetParts
      ));
    }

    // Setup enemies
    game.enemies = [];
    for (var i = 0; i < game.enemyLines; i++) {
      for (var j = 0; j < game.enemiesEachLine; j++) {
        game.enemies.push(new Canon(
          game.enemySpace + j * game.enemySpace,
          game.enemySpace + i * game.enemySpace,
          20,
          20,
          '#FF0000'
        ));
      }
    }
  }

  // stop the game loop
  game.stop = function() {
    clearInterval(game.interval);
  }

  // restart the game
  game.restart = function() {
    game.stop();
    game.init();
  }

  // Start the game on window load
  window.onload = game.init;

  // Detect keydown events
  window.onkeydown = game.keydown;



//Afficher les statistiques du jeu
function showStats(img, iPosX, iPosY, text = '', tPosX = null, tPosY = null) {
    ctx.fillStyle = '#fff';
    ctx.font = '20px gruppo';
    ctx.fillText(text, tPosX, tPosY);
    ctx.drawImage(img, iPosX, iPosY, width = 20, height = 20);
}
function draw() {
    showStats(SCORE_IMG, canvas.width - 100, 5, score, canvas.width - 65, 22);
    showStats(LIFE_IMG, 35, 5, life, 70, 22);
    showStats(LEVEL_IMG,(canvas.width / 2) - 25, 5, level, (canvas.width / 2), 22);
}  

var timer;
var timeleft = 60;

function gameover () {

    if (life <= 0) {
        showEndInfo('lose');
        gameOver = true;
    }
    if (score >= 100) {
        showEndInfo('lose');
        gameOver = true;
    }
}

// (function(){     
//     var sec = 60;  
//     var id = window.setInterval(function() {
//         sec--;
//         if (sec < - 1) {
//             clearInterval(id);
//             alert("Time complete");
//             return;
//         }        
//     }, 1000/60)
// })();

//Aller au niveau suivant
function nextLevel () {
    let isLevelUp = true;

    for (let r = 0; r < brickProp.row; r++) {
        for (let c = 0; c < brickProp.column; c++) {
            isLevelUp = isLevelUp && !bricks[r][c].status;
        }
    }

    if (isLevelUp) {
        WIN.play();

        if (level >= MAX_LEVEL) {
            showEndInfo();
            gameOver = true;
            return;
        }
        brickProp.row += 2;
        createBricks();
        ball.velocity += .5;
        resetBall();
        resetPaddle();
        level++;
    }
}

const sound = document.getElementById('sound');
sound.addEventListener('click', audioManager);

function audioManager() {
    //Changer l'image
    let imgSrc = sound.getAttribute('src');
    let SOUND_IMG = imgSrc === 'img/sound_on.png' ? 'img/mute.png' : 'img/sound_on.png';
    sound.setAttribute('src', SOUND_IMG);

    //Modification des sons en fonction des etats
    WALL_HIT.muted = !WALL_HIT.muted;
    PADDLE_HIT.muted = !PADDLE_HIT.muted;
    BRICK_HIT.muted = !BRICK_HIT.muted;
    WIN.muted = !WIN.muted;
    LIFE_LOST.muted = !LIFE_LOST.muted;
}

//GESTION DU DOM POUR L'AFFICHAGE DES ERREURS
//Importation des éléments du DOM
const rules = document.getElementById('rules');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const game_over = document.getElementById('game-over');
const youWin = game_over.querySelector('#you-won');
const youLose = game_over.querySelector('#you-lose');
const restart = game_over.querySelector('#restart');

//Affichage des règles du jeu
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
    isPaused = true;
});
closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
    isPaused = false;
});

function showEndInfo(type = 'win') {
    game_over.style.visibility = 'visible';
    game_over.style.opacity = '1';
    if (type === 'win') {
        youWin.style.visibility = 'visible';
        youLose.style.visibility = 'hidden';
        youLose.style.opacity = '0';
    } else {
        youWin.style.visibility = 'hidden';
        youWin.style.opacity = '0';
        youLose.style.visibility = 'visible';
    }
}

//Relancer le jeu
restart.addEventListener('click', () => {location.reload();});
