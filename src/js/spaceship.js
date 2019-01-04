let canvas   	  = document.querySelector('.spaceship'),
	context 	  = canvas.getContext('2d'),
	backgroundImg = new Image(),
	ship		  = new Image(),
	shot		  = new Image(),
	status 		  = false, //движение коробля
	shotArr 	  = [],	//массив выстрелов
	background 	  = {x: 0, y: 0, height: -1920,	dy: 0, speed: 0.3},
	shipPosition  = {x: 235, y: 700, speed: 0.1};

backgroundImg.onload = function(){
	game()
}

backgroundImg.src = '../img/618857.jpg';
ship.src = '../img/bluecargoship.png';
shot.src = '../img/shot.png';

//игровой цикл
function game(){
	update()
	render()
	requestAnimFrame(game)
}

let pos = 200 //тестовая позиция

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
		if( pos-40 < 0){
			if(pos-40 != shotArr[i].x ){
				shotArr[i].dx += 0.1
				shotArr[i].x -= shotArr[i].dx
			}
			
		}else if(pos + 40 > 0){
			if(pos + 40 != shotArr[i].x ){
				shotArr[i].dx += 0.1
				shotArr[i].x += shotArr[i].dx
			}
		}

		shotArr[i].dy += shotArr[i].speed
		shotArr[i].y -= shotArr[i].dy
		if (shotArr[i].y <= firstWord.step + firstWord.step){
			shotArr.splice(i,1)
		}
	}
}
let wordArr = ['Один', "Два", 'Три']
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
		context.drawImage(shot, shotArr[i].x, shotArr[i].y, 40, 60)
	}
	for (let i = 0; i < wordArr.length; i++){
		firstWord.runText(wordArr[i], 0.1, Math.floor(Math.random()*(200 - 200 + 1) - 1))
	}
}
let testArr = ['одинодин', 'двадва', 'тритри']
let target = '';
let index = 0;
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
				console.log(index)
				break;
			}else{
				console.log('miss')
			}
		}
	}else if(target[0] === String.fromCharCode(code) && target){
		target = target.slice(1);
		testArr[index] = testArr[index].slice(1);
		if(testArr[index] === '') testArr.splice(index,1)
		shotArr.push({x:shipPosition.x-2, y:shipPosition.y-30, dx: 0, dy: 0, speed: 0.3}) 
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

Text.prototype.runText = function(text, speed, positionX1){
	this.step += speed;
	context.save();
	context.translate(canvas.width / 2, this.step);
	context.fillText(text, positionX1, 0);
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