window.addEventListener('keydown', initMovePlayerLeft);
window.addEventListener('keydown', function() {
    if(twoPlayers)
        initMovePlayerRight(event);
})
window.addEventListener('keyup', stopPlayer);
window.addEventListener('keyup', stopPlayerRight);
window.addEventListener('keydown', function() {
    if((event.keyCode == 32 && !isRunning )|| event.keyCode == 32 && isRunning && !served ) {
        if(document.getElementById("double").checked) {
            twoPlayers = true;
        }
		if(document.getElementById("mouse").checked) {
			mouseControls = true;
		}
		else {
			mouseControls = false;
		}
        serve();}
});

window.addEventListener("keydown", function() {
    if(event.keyCode == 82)
        isRunning = !isRunning;
   
}) 

function mouseChangeY(event) {
	console.log(event.offsetY);
	if(event.offsetY > 0 && event.offsetY < mainScreen.height && mouseControls)
		leftPlayerPos.y = event.offsetY;
	
}


var mouseControls = false;
var served = false;
var twoPlayers = false;
var playerScores = [0,0];
var Vertical = 0;
var Player = 1;
var SideLinesLeft = 2;
var SideLinesRight = 3;
var playerVector = {
    x: 5
}

var playerMove =  false;
var playerRightMove = false;

var mainScreen = document.getElementById("mainscreen");

mainScreen.addEventListener("mousemove", mouseChangeY);
var mainCtx = mainScreen.getContext("2d");
var isRunning = false;
var leftPlayerPos = {
    x: 0,
    y: 0
};

var rightPlayerPos = {
    x: (mainScreen.width - 5),
    y: 0
};

var Vector2D = {
    x: 1,
    y: 1
};

var ballPos = {
    x: 120,
    y: 120
    
};

var playerVectorRight = 5;

function resetBall() {
	ballPos.x = mainScreen.width / 2;
    ballPos.y = Math.floor((Math.random() * 100) + 40);
}


function serve() {
    resetBall();
    
    isRunning = true;
    Vector2D.x *= -1;
	served = true;
}


function initMovePlayerLeft(event) {
    
    if(event.keyCode == 87 ) {
        playerMove = true;
        if(playerVector.x > 0) {
            playerVector.x *= -1; }
        
    }
    else if(event.keyCode == 83) {
        
        playerMove = true;
        if(playerVector.x < 0) {
            playerVector.x *= -1; }
        
        
    }
    
    
}

function stopPlayerRight(event) {
    if(event == null || (event.keyCode == 38 || event.keyCode == 40)) {
        
        playerRightMove = false;
        
    }
    
}

function movePlayerRight() {
    
     rightPlayerPos.y += playerVectorRight;
    if(rightPlayerPos.y < 0 || (rightPlayerPos.y + 40) > mainScreen.height) {
        stopPlayerRight(null);
        rightPlayerPos.y < 0 ? rightPlayerPos.y = 0 : rightPlayerPos.y = mainScreen.height - 40;
    }
   
}

function initMovePlayerRight(event) {
    
    if(event.keyCode == 38 ) {
        playerRightMove = true;
        if(playerVectorRight > 0) {
            playerVectorRight *= -1; }
        
    }
    else if(event.keyCode == 40) {
        
        playerRightMove = true;
        if(playerVectorRight < 0) {
            playerVectorRight *= -1; }
        
        
    }
    
    
}

function stopPlayer() {
    playerMove = false;
}

function movePlayer() {
    leftPlayerPos.y += playerVector.x;
     if(leftPlayerPos.y < 0 || (leftPlayerPos.y + 40) > mainScreen.height) {
        stopPlayer();
         leftPlayerPos.y < 0 ? leftPlayerPos.y = 0 : leftPlayerPos.y = mainScreen.height - 40;
         
}
   
    }
    

function drawMiddleLine() {
mainCtx.moveTo((mainScreen.width / 2),0);
mainCtx.lineTo((mainScreen.width / 2),mainScreen.height);
mainCtx.stroke();
}

function renderScreen() {
	
	mainCtx.beginPath();
    mainCtx.clearRect(0, 0, mainScreen.width, mainScreen.height);
    mainCtx.closePath();
    drawMiddleLine();
    if(isRunning && served) {
        drawBall(ballPos.x, ballPos.y); 
	}
    
    drawLeftPaddle();
    drawRightPaddle();
    drawScore();
}

function mainLoop() {
    
    if(isRunning) {
    changeDirection(collisionDetect());
    
    
    
    
    if(playerMove) 
        movePlayer();
    }
    if(twoPlayers && playerRightMove)
        movePlayerRight();
	if(served) {
		moveBall(Vector2D);
	}
     
    renderScreen();
}

function drawLeftPaddle() {
    mainCtx.rect(leftPlayerPos.x, leftPlayerPos.y ,5 , 40);
    mainCtx.fill();
    mainCtx.stroke();
}

function drawRightPaddle() {
    mainCtx.rect(rightPlayerPos.x, rightPlayerPos.y ,5 , 40);
    mainCtx.fill();
    mainCtx.stroke();
}


function drawBall(posX, posY) {
    mainCtx.beginPath();
    mainCtx.arc(posX, posY, 05, 0, 2 * Math.PI);
    mainCtx.fill();
    mainCtx.stroke();
	mainCtx.closePath();
}

function drawScore() {
    mainCtx.font = "40px Arial";
    var dist = 40;
    if(playerScores[0] > 9)
        dist += 20;
    mainCtx.fillText(playerScores[0], mainScreen.width / 2 - dist, 40);
    mainCtx.fillText(playerScores[1], mainScreen.width / 2 + 20, 40);
}

function moveBall(vector) {
    ballPos.x += vector.x;
    ballPos.y += vector.y;
}

function collisionDetect() {
    
    if((ballPos.x + 5) >= mainScreen.width || (ballPos.x - 5) <= 0) {
        var leftPlayer = (ballPos.y >= leftPlayerPos.y && ballPos.y <= (leftPlayerPos.y + 40) && ballPos.x < mainScreen.width / 2);
        var rightPlayer = (ballPos.y >= rightPlayerPos.y && ballPos.y <= (rightPlayerPos.y + 40) && ballPos.x > mainScreen.width / 2);
    
        if(leftPlayer || rightPlayer) {
            return Player;
        }
        else {
            if(ballPos.x < mainScreen.width / 2)
                return SideLinesLeft;
            else 
                return SideLinesRight;
        }
       
    }
    
    if((ballPos.y + 5) >= mainScreen.height || (ballPos.y - 5) <= 0) {
        return Vertical;
    }
    
    
    return null;
    
    
}

function changeDirection(type) {
    
    switch(type) {
        case Vertical:
            Vector2D.y *= -1;
            break;
        case Player: 
            Vector2D.x *= -1;
            break;
        case SideLinesLeft:
            served = false;
			resetBall();
            playerScores[1] += 1;
            
            break; 
        case SideLinesRight:
            served = false;
			resetBall();
            playerScores[0] += 1;
            
            break; 
            
    }
    
    
}

function posDetectionAI() {
    
        var projection = (ballPos.y * Vector2D.y) + (mainScreen.width - ballPos.x) 
		var marginOfError = Math.floor(Math.random() * 5);
		
		projection += marginOfError;
        if(rightPlayerPos.y + 20 < projection ) {
                if(rightPlayerPos.y + 40 <= mainScreen.height)
                    rightPlayerPos.y += 5 + marginOfError;
            
            
        }
        if(rightPlayerPos.y + 20 > projection) {
            if(rightPlayerPos.y  > 0)
                rightPlayerPos.y -= 5 + marginOfError;
        }
                
        
    
}


setInterval(mainLoop, 5);

setInterval(function() { if(!twoPlayers)
        posDetectionAI();}, 5);