
const WALL_HIT = new Audio('sounds/wall.mp3');

const PADDLE_HIT = new Audio('sounds/paddle_hit.mp3');

const BRICK_HIT = new Audio('sounds/brick_hit.mp3');

const WIN = new Audio('sounds/win.mp3');

const LIFE_LOST = new Audio('sounds/life_lost.mp3');



/* ===== CHARGEMENT DES IMAGES ===== 
const input=document.querySelector('input')
input.addEventListener('keyup',()=>{
     if(input.value==1){
        life=5;
        score=0;

     }
      if(input.value==2){
        life=4;
        score=0;
     }
      if(input.value==3){
        life=2;
        score=0;
     }
    
    

})*/
const LEVEL_IMG = new Image(40, 40);
LEVEL_IMG.src = 'img/level.png';
const LIFE_IMG = new Image(40, 40);
LIFE_IMG.src = 'img/life.png';
const SCORE_IMG = new Image();
SCORE_IMG.src = 'img/score.png';
const b=new Image();
b.src='img/pro.png';
