// Paramètre
var widthPlayground = 690;
var heightPlayground = 390;
var pixelSize = 15;
var nbWidthPx = widthPlayground / pixelSize;
var nbHeightPx = heightPlayground / pixelSize;
var quartz = 200;
var direction = 1; // 0 : top, 1: right, 2: bottom, 3: left
var lastDirection = null;
var snakeHead = document.getElementById('snake-head');
var foodItem = document.getElementById('food-item');
var playGround = document.getElementById('playground');
var counter = 0;
var listImg = ['amelie.jpg','aurora.jpg','benjamin.jpg','cecile.jpg','coline.jpg','delphine.jpg','gabrielle.jpg','jean.jpg','jessica.jpg','melissa.jpg','paresseux.jpg','takeshi.jpg','vincent.jpg']
var gameTimer = null;
var pause = true;
var lastFoodItem = {};

init();
	

function init() {
	// Catch event
	document.onkeydown = changeDirection;
	initialPosition();
	lastFoodItem = addFood();

	gameTimer = setInterval(manageAll, quartz);
}

function manageAll() {
	if(!pause) {
		var pos = getPosition(snakeHead);
		if(isLost(pos)) {
			clearInterval(gameTimer);
			alert('Perdu!!');
		} else {
			moveAllItem();
			// Avancement
			if(direction === 0) {
				setPosition(snakeHead, pos.top - pixelSize, pos.left)
			}
			if(direction === 1) {
				setPosition(snakeHead, pos.top, pos.left + pixelSize);
			}
			if(direction === 2) {
				setPosition(snakeHead, pos.top + pixelSize, pos.left)
			}
			if(direction === 3) {
				setPosition(snakeHead, pos.top, pos.left - pixelSize);
			}
			// Vérification si on a mangé le truc
			if(matchFood()) {
				// Ajouter dans la queue le dernier item mangé
				addItem(direction, lastFoodItem.img);
				// Ajout d'un truc à manger
				lastFoodItem = addFood();
				
			}
			lastDirection = direction;
		}
	}
	
}

// POSITION & DIRECTION (HEAD)
function changeDirection(evt) {
	// Top
	if(evt.keyCode === 38 && lastDirection !== 2) {
		direction = 0;
	}
	// Right
	if (evt.keyCode === 39 && lastDirection !== 3) {
		direction = 1;		
	}
	// Bottom
	if(evt.keyCode === 40 && lastDirection !== 0) {
		direction = 2;
	}
	// Left
	if(evt.keyCode === 37 && lastDirection !== 1) {
		direction = 3;
	}
	// pause
	if(evt.keyCode === 32) {
		pause = !pause;
	}
}

function initialPosition() {
	setPosition(snakeHead, nbHeightPx/2 * pixelSize, nbWidthPx/2 * pixelSize);
}

function setPosition(el, top, left) {
	el.style.left = left + 'px';
	el.style.top = top + 'px';
}
function getPosition(el) {
	return {
		top: el.offsetTop,
		left: el.offsetLeft
	}
}

function addItem(direction, foodImg) {
	// Your existing code unmodified...
	var newSnakeItem = document.createElement('div');
	newSnakeItem.className = 'snake-tale item snake-item';
	newSnakeItem.style.background = 'url(food/' + foodImg + ')';
	newSnakeItem.style.backgroundSize = 'cover';
	// Get last item
	var items = document.getElementsByClassName('snake-item');
	var pos = {};
	var lastItem = items[items.length - 1];
	if(items && items.length >= 1) {
		pos = getPosition(lastItem);
	}
	var addLeft = 0;
	var addTop = 0;
	if(direction === 0) {
		addTop = pixelSize;
	}
	if(direction === 1) {
		addLeft = -pixelSize;
	}
	if(direction === 2) {
		addTop = -pixelSize;
	}
	if(direction === 3) {
		addLeft = pixelSize;
	}
	newSnakeItem.style.left = (pos.left + addLeft) + 'px';
	newSnakeItem.style.top = (pos.top + addTop) + 'px';
	playGround.appendChild(newSnakeItem);
	
}

function moveAllItem() {
	var items = document.getElementsByClassName('snake-item');
	if(items && items.length > 1) {
		for(var idx = (items.length - 1) ; idx >= 0; idx--) {
			if(items[idx + 1]) {
				var pos = getPosition(items[idx]);
				setPosition(items[idx+1], pos.top, pos.left);
			}
		}
	}
	
}

// FOOD
function addFood() {
	// On évite les bordures
	var left = Math.floor(Math.random() * nbWidthPx) * pixelSize;
	var top = Math.floor(Math.random() * nbHeightPx) * pixelSize;
	if(left <= 0) {
		left += pixelSize;
	}
	if(left >= widthPlayground) {
		left -= pixelSize;
	}
	if(top <= 0) {
		top += pixelSize;
	}
	if(top >= heightPlayground) {
		top -= pixelSize;
	}
	var foodImg = setFoodBackground();
	var foodPos = setPosition(foodItem, top, left);
	return {
		img: foodImg,
		top: top,
		left: left
	};
}

function matchFood() {
	var foodPos = getPosition(foodItem);
	var headPos = getPosition(snakeHead);
			
	if(headPos.left === foodPos.left && headPos.top === foodPos.top) {
		counter++;
		setScore();
		return true;
	}
	return false;
}
function setFoodBackground() {
	var indice = Math.floor((Math.random() * listImg.length));
	while(indice < 0 || indice > (listImg.length - 1)) {
		indice = Math.floor((Math.random() * listImg.length));
	}
	var imgBack = listImg[indice];
	foodItem.style.background = 'url(food/' + imgBack + ')';
	foodItem.style.backgroundSize = 'cover';
	return imgBack;
}
function isLost(pos) {
	var isEatingHimself = false;
	var items = document.getElementsByClassName('snake-item');
	if(items && items.length > 1) {
		for(var idx = 0; idx < items.length; idx++) {
			var posItem = getPosition(items[idx]);
			if(pos.left === posItem.left && pos.top === posItem.top && items[idx].className.indexOf('snake-head') === -1) {
				isEatingHimself = true;
			}
		}
	}
	return isEatingHimself || pos.left <= 0 || (pos.left >= widthPlayground) || pos.top <= 0 || (	pos.top >= heightPlayground);
}
function restart() {
	location.reload();
}
function setScore() {
	document.getElementById('score').textContent = counter;
}