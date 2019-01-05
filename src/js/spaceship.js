let game = {
	width:	600,
	height: 900,
	ctx: null,
	background: null,
	ship: null,
	shot: null,
	shotArr: [],
	status: false,
	sprites: {
		background: null,
		ship: null,
		shot: null,
		enemiesType1: null,
		enemiesType2: null,
		enemiesType3: null,
		enemiesType4: null,
		enemiesType5: null
	},
	enemies: null,
	target: '',
	index: null,
	oldIndex: null,
	testArr: ['один', 'двааа', 'тритри', 'четыречетыре', 'пятьпятьпятьпять'],
	count: 0,

	init: function(){
		let canvas = document.querySelector(`.spaceship`);
		this.ctx = canvas.getContext('2d');
	},

	load: function(){
		for (i in this.sprites){
			this.sprites[i] = new Image();
			this.sprites[i].src = `../img/${i}.png`;
		}
		this.createEnemies(this.testArr);
		this.shoting();
	},

	starting: function(){
		this.init();
		this.load();
		this.run();
	},

	update: function(){
		//бэкграунд
		this.background.dy -= this.background.speed
		if(this.background.dy < this.background.height){
			this.background.dy -= this.background.height;
		}

		//корабль
		if(!this.status){
			this.ship.x -= this.ship.speed;
			if( this.ship.x < 210){
				this.status = true
			}
		}else if(this.status){
			this.ship.x += this.ship.speed;
			if( this.ship.x > 230){
				this.status = false
			}
		}
		
		//выстрелы
		for (i in this.shotArr){
			let temp = Math.round(this.enemies[this.index].x - (this.enemies[this.index].sizeX/2)) || Math.round(this.enemies[this.oldIndex].x - (this.enemies[this.oldIndex].sizeX/2));
			if(this.enemies.length){
				if( temp < this.ship.x){
					if(temp != this.ship.x){
						this.shotArr[i].dx += 0.0001
						this.shotArr[i].x -= this.shotArr[i].dx
					}
				}else if(temp > this.ship.x){
					if(temp != this.ship.x){
						this.shotArr[i].dx += 0.00001
						this.shotArr[i].x += this.shotArr[i].dx
					}
				}
				this.shotArr[i].dy += 1
				this.shotArr[i].y -= this.shotArr[i].dy 
				if (this.shotArr[i].y <= this.enemies[this.index].y){
					this.shotArr.splice(i,1)
				}
			}
		}
		//враги
		for (i in this.enemies){
			if( this.enemies[i].x < this.ship.x-20 ){
				if(Math.floor(this.enemies[i].x) != this.ship.x-20 ){
					this.enemies[i].dx += 0.0001
					this.enemies[i].x += this.enemies[i].dx
					
				}	
			}else if(Math.floor(this.enemies[i].x) > this.ship.x ){
				if(Math.floor(this.enemies[i].x) != this.ship.x){
					this.enemies[i].dx += 0.0001
					this.enemies[i].x -= this.enemies[i].dx
				}
			}
			this.enemies[i].dy += this.enemies[i].speed
			this.enemies[i].y += this.enemies[i].dy
		}
	},

	render: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		//фон
		this.ctx.drawImage(this.sprites.background, this.background.x, this.background.y + this.background.dy, 600, 1920, 0, 0 , 600, 1920 );
		if(this.background.dy < (this.background.height + 1920)){
			this.ctx.drawImage(this.sprites.background, this.background.x, this.background.y, 600, 1920, 0, this.background.height - this.background.dy, 600, 1920, );
		}
		//корбаль
		this.ctx.drawImage(this.sprites.ship, this.ship.x, this.ship.y, 40, 60);
		//высрелы
		for (i in this.shotArr){
			this.ctx.drawImage(this.sprites.shot, this.shotArr[i].x, this.shotArr[i].y, 60, 100);
		}
		for(i in this.enemies){
			this.ctx.drawImage(this.enemies[i].type, this.enemies[i].x, this.enemies[i].y, this.enemies[i].sizeX, this.enemies[i].sizeY);
		}
	},

	run: function(){
		this.update();
		this.render();
		window.requestAnimationFrame(function(){
			game.run()
		})
	},

	requestingAnimFrame: function(){                                                  
		return window.requestAnimationFrame 	||
			window.webkitRequestAnimationFrame 	||
			window.mozRequestAnimationFrame 	||
			window.oRequestAnimationFrame 		||
			window.msRequestAnimationFrame 		||
			function(callback){
				window.setTimeout(callback, 1000/20);
			}
	},
	createEnemies: function(arr){
		let enemies = [];
		for ( let i = 0; i < arr.length; i++){
			enemies.push({
				x: this.random(0, 430), 
				y: -200,
				speed: this.checkType(arr[i], 0.009, 0.005, 0.002, 0.001, 0.0009),
				type: this.checkType(arr[i], this.sprites.enemiesType1, this.sprites.enemiesType2, this.sprites.enemiesType3, this.sprites.enemiesType4, this.sprites.enemiesType5),
				sizeX: this.checkType(arr[i], 10, 20,40, 60, 100),
				sizeY: this.checkType(arr[i], 20, 40, 80, 120, 200),
				dy: 0,
				dx: 0
			})
		}
		this.enemies = enemies
	},
	checkType: function(el,value1, value2, value3, value4, value5){
		return el.length < 4?
			value1 : el.length < 6?
			value2 : el.length < 9?
			value3 : el.length < 12?
			value4 : value5
	},
	shoting: function(){
		document.addEventListener('keypress', (e)=>{
			let code = (e.keyCode ? e.keyCode : e.which);
			if(!this.target){
				for ( let i = 0; i < this.testArr.length; i++){
					if(this.testArr[i][0] === String.fromCharCode(code)){
						this.index = i
						this.target = this.testArr[i];
						this.testArr[i] = this.testArr[i].slice(1);
						this.target = this.target.slice(1);
						this.shotArr.push({x: this.ship.x-2, y: this.ship.y-30, dx: 0, dy: 0, speed: 0.3}) 
						break;
					}else{
						console.log('miss')
					}
				}
			}else if(this.target[0] === String.fromCharCode(code) && this.target){
				this.target = this.target.slice(1);
				this.testArr[this.index] = this.testArr[this.index].slice(1);
				this.shotArr.push({x: this.ship.x-2, y: this.ship.y-30, dx: 0, dy: 0, speed: 0.3});
				console.log(this.index)
				if(this.testArr[this.index] === '') {
					this.oldIndex  = this.index;
					this.testArr.splice(this.oldIndex,1)
					console.log(this.enemies)
					setTimeout(()=>{
						this.enemies.splice(this.oldIndex,1)
					},1200)
					
				}
				console.log(this.target)
				console.log(this.testArr)
			}else{
				console.log('miss')
			}
		});
	},
	random: function (min,max){
		return Math.floor(Math.random()*(max - min + 1) + min);
	}
}
	
game.background = {
	x: 0, 
	y: 0, 
	height: -1920,	
	dy: 0, 
	speed: 0.3
};

game.ship = {
	x: 235, 
	y: 700, 
	speed: 0.1
};

window.addEventListener('load', function(){
	game.starting()
});


/* function Text(){
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
let firstWord = new Text(); */
