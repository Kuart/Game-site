let gameEl = document.querySelectorAll(".game");
let status = false;

gameEl.forEach((e)=>{
	e.addEventListener('mouseover', function(){
		status = false;
		let video = document.querySelector(`.tetr`);
		setTimeout(function(){
			if(!status)video.style.display = 'block';
			clearTimeout();
		},400)
	})
	e.addEventListener('mouseout', function(){
		status = true
		let video = document.querySelector(`.tetr`);
		setTimeout(function(){
			if(status)video.style.display = 'none';
			clearTimeout();
		},100)
	})
})