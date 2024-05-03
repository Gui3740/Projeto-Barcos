const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

let engine;
let world;

var tower;
var angle;
var balls=[];
var boats=[];
var boatAnimation = [];
var boatSpritedata, boatspriteSheet
var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteSheet = loadImage("./assets/boat/boat.png");
  boatSpritedata = loadJSON("./assets/boat/boat.json");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpriteSheet = loadImage("assets/boat/broken_boat.png");
  
}


function setup() {
  canvas = createCanvas(1200,600);

  engine = Engine.create();
  world = engine.world;
   
  angle = -PI/4;


  rectMode(CENTER);
  ellipseMode(RADIUS);
  //Use a palavra-chave new para criar um objeto torre. (Desafio 4)

  tower=new Tower(150, 350, 160, 310);
  cannon=new Cannon(180, 110, 100, 50, angle);
  var boatFrames = boatSpritedata.frames;
  for( var i=0; i< boatFrames.length; i++){
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }
  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i=0; i< brokenBoatFrames.length; i++){
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  //exibir a torre (Desafio 4)
  showBoats();


   for(var i=0; i < balls.length; i++){
    showCannonBalls(balls[i], i);
    for(var j = 0; j< boats.length; j++){
      if(balls[i] !== undefined && boats[j] !== undefined){
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if(collision.collided){
          if(!boats[j].isBroken && !balls[i].isSink){
            boats[j].remove(j);
            j--;
          }
          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
        }
      }
    }
   }



    tower.display();
    cannon.display();
 




}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}

//Função mostrar a bala
function showCannonBalls (ball,index){
  ball.display();
   if(ball.body.position.x >= width || ball.body.position.y >= height -50){
     Matter.World.remove(world, ball.body);
     balls.splice(index, 1);
   }

}


function keyReleased(){
  if(keyCode === DOWN_ARROW){
    balls[balls.length -1].shoot();
  }
}
function showBoats(){
  if(boats.length > 0){
    if(boats.length < 4 && boats[boats.length - 1].body.position.x < width - 300){
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width,height -100, 170, 170, position, boatAnimation);
      boats.push(boat);
    }
    for(var i=0; i < boats.length; i++){
      Matter.Body.setVelocity(boats[i].body,{
        x: -0.9,
        y: 0
      })
      boats[i].display();
      boats[i].animate();
    }
  }else{
    var boat = new Boat(width, height -60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}
