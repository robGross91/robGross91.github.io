/*
 * Things to remember:
 * The game takes place on a 20x20 array
 * getMousePos will return x and y offset by +8 pixels
*/

// initialising canvas:
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var squareSize = 25;
var canvasSize = 500;

// cellObj contains all of the information relative to each cell
function cellObj() {
	// fire determines whether cell is on fire
	fire = false;
	// fighter determines whether cell contains a firefighter
	unit =  null;
	// cValue determines the chance that the cell will catch fire, determined by surrounding cells
	cValue = 0;
	// water determines if the cell is being covered by a fireman:
	water = false;
	// house determines if the cell contains a house:
	house = false;
}
cellObj.prototype.fire = false;
cellObj.prototype.unit = null;
cellObj.prototype.cValue = 0;
cellObj.prototype.water = false;
cellObj.prototype.house = false;

// selector keeps track of what the user has selected currently
function selector() {
	selected = null;
}
selector.prototype.selected = null;
selector.selected = null;

// initialise graphics
// fire sprite:
var fireSprite = new Image();
fireSprite.onload = function(){
	drawBoard();
}
fireSprite.src = "fire.jpg";
// selector:
var selectorSprite = new Image();
selectorSprite.onload = function(){
	drawBoard();
}
selectorSprite.src = "selector.jpg";
// fireman left:
var firemanLeft = new Image();
firemanLeft.onload = function() {
	drawUI();
}
firemanLeft.src = "firemanLeft.jpg";
// firemanRight:
var firemanRight = new Image();
firemanRight.onload = function() {
	drawUI();
}
firemanRight.src = "firemanRight.jpg";
// firemanUp:
var firemanUp = new Image();
firemanUp.onload = function() {
	drawUI();
}
firemanUp.src = "firemanUp.jpg";
// firemanDown:
var firemanDown = new Image();
firemanDown.onload = function() {
	drawUI();
}
firemanDown.src = "firemanDown.jpg";

// water sprite
var waterSprite = new Image();
waterSprite.onload = function() {
	drawBoard();
}
waterSprite.src = "waterSprite.jpg";

// house sprite
var houseSprite = new Image();
houseSprite.onload = function() {
	drawBoard();
}
houseSprite.src = "house.jpg";


// variables that determine x and y position of fireman UI elements:
var firemanLeftX = 540;
var firemanLeftY = 300;
var firemanRightX = 540;
var firemanRightY = 350;
var firemanUpX = 540;
var firemanUpY = 400;
var firemanDownX = 540;
var firemanDownY = 450;


// initialising variables:
var fireClock = 10;
var cash = 5;
// houseCount keeps track of how many houses the player can afford to lose
var houseCount = 4;
var score = 0;

function drawGrid() {
	// draw grid:
	// horizontal lines:
	for (var i = 1; i < 20; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * squareSize);
		ctx.lineTo(canvasSize, i * squareSize);
		ctx.strokeStyle ="black";
		ctx.stroke();
	}
	// vertical lines:
	for (var i = 1; i < 21; i++) {
		ctx.beginPath();
		ctx.moveTo(i * squareSize, 0);
		ctx.lineTo(i * squareSize, canvasSize);
		ctx.strokeStyle ="black";
		ctx.stroke();
	}
}


function drawUI() {
	// drawing fireClock countdown:
	ctx.font = "20px Arial";
	ctx.fillText("Time until fire breaks out:", 540, 30);
	ctx.font = "30px Arial";
	ctx.fillText(fireClock, 650, 70);
	
	// drawing current cash supplies:
	ctx.font = "20px Arial";
	ctx.fillText("Cash: " + cash, 540, 130);
	
	// drawing how many houses the player can lose:
	ctx.fillText("Houses left: " + houseCount, 640, 130);
	
	// drawing selector over relevant object:
	if (selector.selected == firemanLeft) {
		ctx.drawImage(selectorSprite, firemanLeftX - 5, firemanLeftY -5);
	}
	if (selector.selected == firemanRight) {
		ctx.drawImage(selectorSprite, firemanRightX - 5, firemanRightY -5);
	}
	if (selector.selected == firemanUp) {
		ctx.drawImage(selectorSprite, firemanUpX - 5, firemanUpY -5);
	}
	if (selector.selected == firemanDown) {
		ctx.drawImage(selectorSprite, firemanDownX - 5, firemanDownY -5);
	}
	
	// drawing units that the user can select:
	// firemanLeft:
	ctx.drawImage(firemanLeft, firemanLeftX, firemanLeftY);
	// firemanRight:
	ctx.drawImage(firemanRight, firemanRightX, firemanRightY);
	// firemanUp:
	ctx.drawImage(firemanUp, firemanUpX, firemanUpY);
	// firemanDown:
	ctx.drawImage(firemanDown, firemanDownX, firemanDownY);
	

	
}

// managing the placement of a unit:
function placeUnit(thisUnit, x, y) {
	var xCoord = (Math.floor(x/squareSize));
	var yCoord = (Math.floor(y/squareSize));
	// unitValue is the price of a fireman
	var unitValue = 5;
	
	// check that the current index does not contain a a fireman or fire
	if (fireArray[xCoord][yCoord].fire == false && fireArray[xCoord][yCoord].unit == null && cash > unitValue 
		&& fireArray[xCoord][yCoord].house == false) {
			cash = cash - unitValue;
			fireArray[xCoord][yCoord].unit = thisUnit;
			drawWater(thisUnit, xCoord, yCoord);
	}
	

}

function drawWater(thisFireman, xCoord, yCoord) {

		// arrays to determine placement of water coverage for each direction:
	var leftArray = [[-2,1],[-2,0],[-2,-1],[-1,1],[-1,0],[-1,-1]];
	var downArray = [[-1,2],[0,2],[1,2],[-1,1],[0,1],[1,1]];
	var upArray = [[-1,-1],[-1,-2],[0,-1],[0,-2],[1,-1],[1,-2]];
	var rightArray = [[1,1],[2,1],[1,0],[2,0],[1,-1],[2,-1]];
	
	// determine relevant array:
	switch(thisFireman) {
		case firemanLeft:
			for (var zx = 0; zx < 6; zx++) {
				var adjustedX = leftArray[zx][0] + xCoord;
				var adjustedY = leftArray[zx][1] + yCoord;
				if (adjustedX >= 0 && adjustedX < 20 && adjustedY >= 0 && adjustedY < 20) {
					fireArray[adjustedX][adjustedY].water = true;
		}
				}
			break;
		case firemanRight:
			for (var zx = 0; zx < 6; zx++) {
				var adjustedX = rightArray[zx][0] + xCoord;
				var adjustedY = rightArray[zx][1] + yCoord;
				if (adjustedX >= 0 && adjustedX < 20 && adjustedY >= 0 && adjustedY < 20) {
					fireArray[adjustedX][adjustedY].water = true;
				}
				}
			break;
		case firemanUp:
			for (var zx = 0; zx < 6; zx++) {
				var adjustedX = upArray[zx][0] + xCoord;
				var adjustedY = upArray[zx][1] + yCoord;
				if (adjustedX >= 0 && adjustedX < 20 && adjustedY >= 0 && adjustedY < 20) {
					fireArray[adjustedX][adjustedY].water = true;
				}
				}
			break;
		case firemanDown:
			for (var zx = 0; zx < 6; zx++) {
				var adjustedX = downArray[zx][0] + xCoord;
				var adjustedY = downArray[zx][1] + yCoord;
				if (adjustedX >= 0 && adjustedX < 20 && adjustedY >= 0 && adjustedY < 20) {
					fireArray[adjustedX][adjustedY].water = true;
				}
				}
			break;
		}	
}

// recording the position of mouseClick:
function getMousePos(event) {
	
	var rect = c.getBoundingClientRect();
	var mouseX = event.clientX - rect.left;
	var mouseY = event.clientY - rect.top;
	console.log(mouseX + " ," + mouseY);
	// check if within firemanLeft:
	if (mouseX >= firemanLeftX && mouseX <= firemanLeftX + squareSize 
	&&  mouseY >= firemanLeftY && mouseY <= firemanLeftY + squareSize) {	
		// if selector is on firemanLeft:
		if (selector.selected == firemanLeft) {
			// deselect firemanLeft:
			selector.selected = null;
		}
		// else, select firemanLeft:
		else {
			selector.selected = firemanLeft;
		}
	}
	// check if within firemanRight:
	if (mouseX >= firemanRightX && mouseX <= firemanRightX + squareSize 
	&&  mouseY >= firemanRightY && mouseY <= firemanRightY + squareSize) {	
		// if selector is on firemanRight:
		if (selector.selected == firemanRight) {
			// deselect firemanRight:
			selector.selected = null;
		}
		// else, select firemanRight:
		else {
			selector.selected = firemanRight;
		}
	}
	// check if within firemanUp:
	if (mouseX >= firemanUpX && mouseX <= firemanUpX + squareSize 
	&&  mouseY >= firemanUpY && mouseY <= firemanUpY + squareSize) {	
		// if selector is on firemanUp:
		if (selector.selected == firemanUp) {
			// deselect firemanUp:
			selector.selected = null;
		}
		// else, select firemanUp:
		else {
			selector.selected = firemanUp;
		}
	}
	// check if within firemanDown:
	if (mouseX >= firemanDownX && mouseX <= firemanDownX + squareSize 
	&&  mouseY >= firemanDownY && mouseY <= firemanDownY + squareSize) {	
		// if selector is on firemanDown:
		if (selector.selected == firemanDown) {
			// deselect firemanDown:
			selector.selected = null;
		}
		// else, select firemanDown:
		else {
			selector.selected = firemanDown;
		}
	}
	
	// if clicked within grid:
	if (mouseX < canvasSize) {
		// if a unit is currently selected:
		if (selector.selected != null) {
			// place unit:
			placeUnit(selector.selected, mouseX, mouseY);
		}
	}
}
c.addEventListener("click", getMousePos);

// function to manage fireClock and supplies
function countDownFireClock() {
	
	// update score:
	if (houseCount > 0) {
		score = score +1;
	}
	
	// check to see if fire will be extinguished:
	extinguish();
	if (fireClock == 1) {
		// reset the clock back to 10
		fireClock = 10;
		// ignite the fire	
		buildcArray();
		ignite();
		
		// undraw all water:
		for (var i = 0; i < 20; i++) {
				for (var j = 0; j < 20; j++) {
					fireArray[i][j].water = false;
				}
		}
		// redraw all water
		for (var i = 0; i < 20; i++) {
				for (var j = 0; j < 20; j++) {
					if (fireArray[i][j].unit != null) {
						drawWater(fireArray[i][j].unit, i, j);
					}
				}
		}
	}
	else {
		fireClock = fireClock - 1;

	}
	if (fireClock % 2 == 0) {
		cash ++;
	}
}

// will clear and redraw the game area:
function updateGameArea() {
	// clear the game area:
	ctx.clearRect(0,0,800,canvasSize);
	// if the player has not lost:
	if (houseCount > 0) {
		drawGrid();
		drawUI();
		drawBoard();
	}
	else {
		// game is over, display gameover screen
		ctx.font = "30px Arial";
		ctx.fillText("Game Over! Your score was " + score, 200, 200);
	}
}

// Timed updates:
// updates the game area every 20ms
setInterval(updateGameArea,20);
// counts down fireClock:
setInterval(countDownFireClock, 500);


// fireArray will contain data that the canvas will draw from
// 0 = empty
// 1 = fire
var fireArray = new Array();
function buildBlankArray() {

	for (var xValue = 0; xValue < 20; xValue ++) {
		fireArray[xValue] = new Array();
		for (var yValue = 0; yValue < 20; yValue ++) {
			fireArray[xValue][yValue] = new cellObj();
		}
	}
}
buildBlankArray();

// function to manage the random generation of house placement:
function buildHouses() {
	var noHouses = 6;
	while (noHouses > 0) {
		// randomly selecting x and y coordinates for houses to be placed:
		var x = Math.round(Math.random() * 19);
		var y = Math.round(Math.random() * 19);
		
		// check that the houses do not sit on the edge:
		if (x > 1 && y > 1 && y < 18 && x < 18) {
			// checl that the cell does not already contain a house:
			if (fireArray.house != true) {
				fireArray[x][y].house = true;
				noHouses = noHouses - 1;
			}
		}
	}
}

// function to randomly generate initial fire placement:
function lightFire() {
	
	// noFire keeps track of how many fires are yet to be lit:
	var noFire = 20;
	while (noFire > 0) {
		var x = Math.round(Math.random() * 19);
		var y = Math.round(Math.random() * 19);
		// check that fire placement is close to edge:
		if (x < 2 || x > 17 || y < 2 || y > 17) {
				// check that it's not already on fire
				if (fireArray[x][y].fire != true) {
					// check that is doesn't contain a house:
					if (fireArray[x][y].house != true) {
						// light the fire!
						fireArray[x][y].fire = true;
						noFire = noFire - 1;
					}
				}
		}
	}
}



// checks whether array cell will ignite:
function ignite() {
	// iterate through whole array
	for (var arrayX = 0; arrayX < 20; arrayX ++) {
		for (var arrayY = 0; arrayY < 20; arrayY++) {
			// check that the cell is not currently on fire:
			if (fireArray[arrayX][arrayY].fire != true) {
				// check if the cell will catch fire:
				if ((Math.random() * 100) < fireArray[arrayX][arrayY].cValue){
					// cell ignites, update fireArray
					fireArray[arrayX][arrayY].fire = true;
					
					// check if cell contains fireman
					if (fireArray[arrayX][arrayY].unit != null) {
						// if so, remove fireman
						fireArray[arrayX][arrayY].unit = null;
					}
					// check if cell contains a house
					if (fireArray[arrayX][arrayY].house != false) {
						// if so, remove fireman
						fireArray[arrayX][arrayY].house = false;
						houseCount = houseCount - 1;
					}
				}
			}
		}
	}
}

// determines cValue for each cell
function buildcArray() {
	// iterate through fireArray:
	// xCoord:
	for (var xCoord = 0; xCoord < 20; xCoord ++) {
		// yCoord:
		for (var yCoord = 0; yCoord < 20; yCoord ++) {
			// resetting the cValues to 0:
			fireArray[xCoord][yCoord].cValue = 0;
			// check each adjacent cell:
			for (var xOffset = -1; xOffset < 2; xOffset++) {
				for (var yOffset = -1; yOffset < 2; yOffset ++) {
					// calculate adjacent x and y coords:
					var xCoordAdjacent = xCoord + xOffset;
					var yCoordAdjacent = yCoord + yOffset;
					// check x and y are valid coords:
					if (xCoordAdjacent > -1 && xCoordAdjacent < 20 && yCoordAdjacent > -1 && yCoordAdjacent < 20) {
						// if it is on fire
						if (fireArray[xCoordAdjacent][yCoordAdjacent].fire == true) {
							// increase cValue
							fireArray[xCoord][yCoord].cValue = fireArray[xCoord][yCoord].cValue + 7;
						}
					}
				}
			}
		}
	}
}

function drawBoard() {
	// check to see if the player has lost
		// if so, pause game and display gameover message
	
	// iterate through fireArray:
	// xCoord:
	for (var xCoord = 0; xCoord < 20; xCoord ++) {
		// yCoord:
		for (var yCoord = 0; yCoord < 20; yCoord ++) {
			
			
			// draw water:
			if (fireArray[xCoord][yCoord].water == true) {
				ctx.drawImage(waterSprite, (xCoord * squareSize) + 1, (yCoord * squareSize)+ 1);
				console.log("drawing water 4 real");
			}
			// check if current cell is on fire
			if (fireArray[xCoord][yCoord].fire == true) {
				// draw fire sprite at relative coordinate
				ctx.drawImage(fireSprite, (xCoord * squareSize) + 5, (yCoord * squareSize)+ 5);
			}
			// drawing firemen:
			if (fireArray[xCoord][yCoord].unit != null) {
				ctx.drawImage(fireArray[xCoord][yCoord].unit, (xCoord * squareSize) + 3, (yCoord * squareSize)+ 3);
			}
			
			// drawing houses:
			if (fireArray[xCoord][yCoord].house == true) {
				ctx.drawImage(houseSprite, (xCoord * squareSize) + 3, (yCoord * squareSize)+ 3);
			}
		}
	}
}

function extinguish() {
	// probability is the percentage that a square will be extinguished
	var probability = 9;
	// iterate through array
	for (var x = 0; x < 20; x++) {
		for (var y = 0; y < 20; y++) {
			// if array is on fire and contains water
			if (fireArray[x][y].fire == true && fireArray[x][y].water == true) {
				// if it passes probability check
				if ((Math.random() * 100) < probability) {
					// extinguish fire
					fireArray[x][y].fire = false;
				}
			}
		}
	}
}

function startGame() {
	buildBlankArray();
	buildHouses();
	lightFire();
	
	updateGameArea();
	
	
	// initialising variables:
	var fireClock = 10;
	var cash = 5;
	// houseCount keeps track of how many houses the player can afford to lose
	var houseCount = 4;
	var score = 0;
}

startGame();


/*
 *References:
 * http://www.w3schools.com/games/game_components.asp
 */
 
