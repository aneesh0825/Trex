var PLAY=1;
var END=0;
var gameState=PLAY;

var trex, trex_running,trex_collided;
var ground,invisible_ground,ground_image;
var CloudsGroup,cloud_image;
var ObstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var count=0;
var restart,restartimage;
var gameOver,gameOverimage;
var die, jump, checkpoint
//set text
textFont("Georgia");
textStyle(BOLD);

function preload() {
  trex_running= loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  ground_image=loadImage("ground2.png");
  cloud_image=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  restartimage=loadImage("restart.png");
  gameOverimage=loadImage("gameOver.png");
  die=loadSound("die.mp3");
  jump=loadSound("jump.mp3");
  checkpoint=loadSound("checkPoint.mp3");
}
function setup() { 
   
  createCanvas(600, 200);
  trex=createSprite(50,100,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5;
  
  ground=createSprite(200,180,400,10); 
  ground.addImage(ground_image);
  invisible_ground=createSprite(200,190,400,10);
  invisible_ground.visible=false;
  
  CloudsGroup = new Group();
  ObstaclesGroup= new Group();
  
  //place gameOver and restart icon on the screen
 gameOver = createSprite(300,100);
 restart = createSprite(300,140);
 gameOver.addImage(gameOverimage);
 gameOver.scale = 0.5;
 restart.addImage(restartimage);
 restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
} 

function draw() {
  background(255);
   //display score  
  text("Score: "+ count, 500, 50);
  if (gameState==PLAY) {
  count = count + Math.round(getFrameRate()/20);
    if(count>0&&count%100==0){
    checkpoint.play();
    }
    ground.velocityX=-(6+3*count/100);
    if(keyDown("space")&&trex.y>=159) {
      trex.velocityY=-12;
      jump.play();
      
    }
    trex.velocityY+=0.8;
    if(ground.x<0) {
      ground.x=ground.width/2;
      
     }
    spawnClouds();
      
    spawnObstacles();
     //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
   
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }  
  trex.collide(invisible_ground);
  drawSprites();
  
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage("cloud",cloud_image);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 3*count/100);
      
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1:obstacle.addImage(obstacle1);
      break;
      case 2:obstacle.addImage(obstacle2);
      break;
      case 3:obstacle.addImage(obstacle3);
      break;
      case 4:obstacle.addImage(obstacle4);
      break;
      case 5:obstacle.addImage(obstacle5);
      break;
      case 6:obstacle.addImage(obstacle6);
      break;
      default:break;
        
    }
    
      
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  count=0;
}