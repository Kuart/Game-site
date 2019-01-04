let canvas   	  = document.querySelector('.spaceship'),
	context 	  = canvas.getContext('2d'),
	backgroundImg = new Image(),
	ship		  = new Image(),
	shot		  = new Image(),
	enemiesType1  = new Image(),
	enemiesType2  = new Image(),
	enemiesType3  = new Image(),
	enemiesType4  = new Image(),
	enemiesType5  = new Image(),
	status 		  = false, //движение коробля
	shotArr 	  = [],	//массив выстрелов
	background 	  = {x: 0, y: 0, height: -1920,	dy: 0, speed: 0.3},
	shipPosition  = {x: 235, y: 700, speed: 0.1};

backgroundImg.onload = function(){
	game()
}

backgroundImg.src = '../img/618857.jpg';
ship.src = '../img/bluecargoship.png';
shot.src = '../img/plasma.png';
enemiesType1.src = '../img/RD2.png'
enemiesType2.src = '../img/ship(9).png'
enemiesType3.src = '../img/RD1.png'
enemiesType4.src = '../img/ship(14).png'
enemiesType5.src = '../img/greenship1.png'


//игровой цикл
function game(){
	update()
	render()
	requestAnimFrame(game)
}

function update(){
	//бэкграунд
	background.dy -= background.speed
	if(background.dy < background.height){
		background.dy -= background.height;
	}

	//корабль
	if(!status){
		shipPosition.x -= shipPosition.speed;
		if( shipPosition.x < 210){
			status = true
		}
	}else if(status){
		shipPosition.x += shipPosition.speed;
		if( shipPosition.x > 230){
			status = false
		}
	}
	
	//выстрелы
	for (i in shotArr){
		if(enemies.length){
			if( enemies[index].x <= 235){
				if(Math.round(enemies[index].x) != 235){
					shotArr[i].dx += (enemies[index].dx/shotArr[i].speed)*shotArr[i].dy
					shotArr[i].x -= shotArr[i].dx
				}
				console.log(Math.round(shotArr[i].x));
			}else if(Math.round(enemies[index].x) >= 235){
				if(Math.round(shotArr[i].x) != 235){
					shotArr[i].dx += (enemies[index].dx*shotArr[i].speed)*shotArr[i].dy
					shotArr[i].x += shotArr[i].dx
				}
				console.log(Math.round(shotArr[i].x));
			}
			shotArr[i].dy += shotArr[i].speed
			shotArr[i].y -= shotArr[i].dy
			if (shotArr[i].y <= enemies[index].y){
				shotArr.splice(i,1)
			}
		}
	}
	//враги
	for (i in enemies){
		if( enemies[i].x < 235 ){
			if(Math.floor(enemies[i].x) != 235 ){
				enemies[i].dx += 0.0001
				enemies[i].x += enemies[i].dx
				
			}	
		}else if(Math.floor(enemies[i].x) > 235 ){
			if(Math.floor(enemies[i].x) != 235){
				enemies[i].dx += 0.0001
				enemies[i].x -= enemies[i].dx
				/* console.log(900/enemies[0].speed); */
			}
		}
		enemies[i].dy += enemies[i].speed
		enemies[i].y += enemies[i].dy
	}
}
let testArr = ['один', 'двааа', 'тритри', 'четыречетыре', 'пятьпятьпятьпять'];
let target = '';
let index = 0;
let enemies = createEnemies(testArr);

function render(){
	//фон
	context.drawImage(backgroundImg,background.x, background.y + background.dy, 600, 1920, 0, 0 , 600, 1920 );
	if(background.dy < (background.height + 1920)){
		context.drawImage(backgroundImg,background.x, background.y, 600, 1920, 0, background.height - background.dy, 600, 1920, );
	}
	
	//корбаль
	context.drawImage(ship, shipPosition.x, shipPosition.y, 40, 60)
	
	//высрелы
	for (i in shotArr){
		context.drawImage(shot, shotArr[i].x, shotArr[i].y, 60, 100)
	}
	for(i in enemies){
		context.drawImage(enemies[i].type, enemies[i].x, enemies[i].y, enemies[i].sizeX, enemies[i].sizeY)
	}
}

function createEnemies(arr){
	let enemies = [];
	for ( let i = 0; i < arr.length; i++){
		enemies.push({
			x: random(), 
			y: 0,
			speed: checkType(arr[i], 0.009, 0.005, 0.002, 0.001, 0.0009),
			type: checkType(arr[i], enemiesType1, enemiesType2, enemiesType3, enemiesType4, enemiesType5),
			sizeX: checkType(arr[i], 10, 20,40, 60, 100),
			sizeY: checkType(arr[i], 20, 40, 80, 120, 200),
			dy: 0,
			dx: 0
		})
	}
	return enemies
}

console.log(enemies)
function random(){
	return Math.floor(Math.random()*(400 - 40 + 1) + 40)
}
function checkType(el,value1, value2, value3, value4, value5){
	return el.length < 4?
		value1 : el.length < 6?
		value2 : el.length < 9?
		value3 : el.length < 12?
		value4 : value5
}
//выстрелы
document.addEventListener('keypress', function(e){
	let code = (e.keyCode ? e.keyCode : e.which);
	if(!target){
		for ( let i = 0; i <  testArr.length; i++){
			if(testArr[i][0] === String.fromCharCode(code)){
				index = i
				target = testArr[i];
				testArr[i] = testArr[i].slice(1);
				target = target.slice(1);
				shotArr.push({x:shipPosition.x-2, y:shipPosition.y-30, dx: 0, dy: 0, speed: 0.3}) 
				break;
			}else{
				console.log('miss')
			}
		}
	}else if(target[0] === String.fromCharCode(code) && target){
		target = target.slice(1);
		testArr[index] = testArr[index].slice(1);
		shotArr.push({x:shipPosition.x-2, y:shipPosition.y-30, dx: 0, dy: 0, speed: 0.3});
		console.log(index)
		if(testArr[index] === '') {
			let oldIndex  = index;
			testArr.splice(oldIndex,1)
			setTimeout(function(){
				enemies.splice(oldIndex,1)
			},1500)
			
		}
		console.log(target)
		console.log(testArr)
	}else{
		console.log('miss')
	}
});

function Text(){
	context.fillStyle = "#fff";
	context.font = "20pt Verdana";
	this.step = 0;
}

Text.prototype.runText = function(text, speed, posX, posY){
	this.step += speed;
	context.save();
	context.translate(canvas.width, this.step);
	context.fillText(text, 0, 0);
	context.restore();
	if (this.step === shipPosition.y){
	}
}
let firstWord = new Text();


//test zona


/* function generate(){
	for ()
}
  */









//кросбраузер requestAnimationFrame
let requestAnimFrame = (function(){                                                  
	return window.requestAnimationFrame 	||
		window.webkitRequestAnimationFrame 	||
		window.mozRequestAnimationFrame 	||
		window.oRequestAnimationFrame 		||
		window.msRequestAnimationFrame 		||
		function(callback){
			window.setTimeout(callback, 1000/20)
		}
})();