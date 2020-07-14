$(function() {

  var canvas = document.getElementById("breakoutCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  var ballRadius = canvas.width / 140;
  var hideBall = 0;
  var showBall = ballRadius;
  var x = canvas.width/2;
  var y = canvas.height-50;
  var dx = 7;
  var dy = -10;
  var brickRowCount = 12;
  var brickColumnCount = 5;
  var brickWidth = canvas.width / brickRowCount;
  var brickHeight = 30;
  var brickPadding = 2;
  var brickOffsetTop = 80;
  var brickOffsetLeft = 10;
  var paddleHeight = brickHeight;
  var paddleWidth = brickWidth;
  var paddleX = (canvas.width-paddleWidth)/2;
  var rightPressed = false;
  var leftPressed = false;
  var score = 0;
  var lives = 3;
  var start = false;
  var speedBallAdded = false;

  var bricks = [];
  for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }
  function collisionDetection() {
    for(var col = 0; col < brickColumnCount; col++) {
      for(var row = 0; row < brickRowCount; row++) {
        var b = bricks[col][row];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;

            if(!speedBallAdded && col == 1){
                paddleWidth = paddleWidth / 2;
                dy = dy *2;
                dx = dx * 2;
                speedBallAdded = true;
            }

            b.status = 0;
            score++;
            if(score == brickRowCount*brickColumnCount) {
             drawStart("YOU WIN, CONGRATS!");

            }
          }
        }
      }
    }
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  function drawBall() {

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for(var col = 0; col < brickColumnCount; col++) {
      for(var row = 0; row < brickRowCount; row++) {

        if(bricks[col][row].status == 1) {
          var brickX = (row * (brickWidth+brickPadding)) + brickOffsetLeft;
          var brickY = (col * (brickHeight+brickPadding)) + brickOffsetTop;
          bricks[col][row].x = brickX;

          bricks[col][row].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);

          switch (col){

            case 0:{
              ctx.fillStyle = "#FF0000";
              break;
            }
            case 1:{
              ctx.fillStyle = "#FFF000";
              break
            }
            case 2:{
              ctx.fillStyle = "#800080";
              break;
            }
            case 3:{
              ctx.fillStyle = "#00FF00";
              break;
            }
            case 4 :{
              ctx.fillStyle = "#0000FF";
              break;
            }
          }

          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+ score, 8, 20);
  }

  function drawLives() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+ lives, canvas.width-95, 20);
  }

  function drawStart(msg){

    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(msg, canvas.width/2 -canvas.width/20, canvas.height/2);

    $("#breakoutCanvas").click(function(){
      start = true;
      draw();
    })
    if(start)
    document.location.reload();
  }

  function drawGameOver() {

    drawStart("Game Over!  Click To Play Again?");
  }

  function draw() {

    if(start){

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();

      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if(y + dy < ballRadius) {
        dy = -dy;
      }
      else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;

        }
        else {

          if(lives == 0) {

            lives == 0;
            drawGameOver();
            // document.location.reload();
          } else {

            --lives;
            start = false;
            x = canvas.width/2;
            y = canvas.height-30;

            if(speedBallAdded){

              dx = 14;
              dy = -20;
            } else {

              dx = 7;
              dy = -10;
            }

            paddleX = (canvas.width-paddleWidth)/2;
          }

        }
      }

      if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 3;
      }
      else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      if(start == true){

        x += dx;
        y += dy;
        requestAnimationFrame(draw);
      }
    }
  }

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawStart("Click to Start");
});







