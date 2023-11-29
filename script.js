"use strict";

const $=(x)=>{return document.querySelector(x);}

/* Constants */

const canvas = $("#display");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = 500;

/* Classes */

class sceneElement {
	_dist;
	_height;
	color;
	distInput;
	heightInput;

	constructor(dist = 0, height = 0, color = "#f00", distInput, heightInput, refreshFunc) {
		this._dist = dist;
		this._height = height;
		this.color = color;
		this.distInput = distInput;
		this.heightInput = heightInput;

		this.distInput.value = dist.toFixed(3);
		this.heightInput.value = height.toFixed(3);

		this.distInput.addEventListener("input", ()=> {
			this._dist = this.distInput.value;
			refreshFunc();
		});

		this.heightInput.addEventListener("input", ()=> {
			this._height = this.heightInput.value;
			refreshFunc();
		});
	}

	get screenX(){
		return canvas.width/2 - this._dist;
	}

	get screenY(){
		return canvas.height/2 - this._height;
	}

	set dist(value) {
		this.distInput.value = value.toFixed(3);
		this._dist = value;
	}

	get dist() {
		return this._dist;
	}

	set height(value) {
		this.heightInput.value = value.toFixed(3);
		this._height = value;
	}

	get height() {
		return this._height;
	}

	render(){}

	setPosFromCoords(x, y){
		this.dist = canvas.width/2 - x;
		this.height = canvas.height/2 - y;
	}
}

class sceneObject extends sceneElement {
	constructor(dist = 0, height = 0, color = "#f008", distInput, heightInput, refreshFunc) {
		super(dist, height, color, distInput, heightInput, refreshFunc);
	}

	get imgDist(){
		return -1/(1/focalDist - 1/this._dist);
	}

	get imgHeight(){
		return (-1/(1/focalDist - 1/this._dist))/this._dist * this._height;
	}

	render() {
		ctx.strokeStyle = "#000";
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(this.screenX, canvas.height/2);
		ctx.lineTo(this.screenX, this.screenY);
		ctx.stroke();

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.screenX, this.screenY, 5, 0, Math.PI*2);
		ctx.fill();
	}
}

class sceneImage extends sceneElement {
	object;

	constructor(obj, color="#f008", distInput, heightInput, refreshFunc) {
		super(obj.imgDist, obj.imgHeight, color, distInput, heightInput, refreshFunc);
		this.object = obj;
	}

	get objDist() {
		return -1/(-1/this._dist-1/focalDist);
	}

	get objHeight() {
		return -1/(-1/this._dist-1/focalDist)/this._dist * this._height;
	}

	render() {
		let mag = Math.abs(this.height / obj.height);
		ctx.lineWidth = mag;

		ctx.strokeStyle = "#0008";
		ctx.setLineDash([5*mag, 5*mag]);
		ctx.beginPath();
		ctx.moveTo(this.screenX, canvas.height/2);
		ctx.lineTo(this.screenX, this.screenY);
		ctx.stroke();

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.ellipse(this.screenX, this.screenY, 5*mag, 5*mag, 0, 0, Math.PI*2);
		ctx.fill();

		$("#mag-out").textContent = mag.toFixed(3);
		ctx.lineWidth = 1;
	}
}

/* Vars */

// let mapScale = 1;
let focalDist = 100;
let obj = new sceneObject(200, 50, "#f00", $("#obj-dist-input"), $("#obj-height-input"), refreshSim);
let img = new sceneImage(obj, "#f008", $("#img-dist-input"), $("#img-height-input"), refreshSimFromImg);

/* Procedure */

function drawScene() {
	ctx.strokeStyle = "#000";
	ctx.setLineDash([]);

	ctx.beginPath();
	ctx.moveTo(50, canvas.height/2);
	ctx.lineTo(canvas.width - 50, canvas.height/2);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(canvas.width/2, 50);
	ctx.lineTo(canvas.width/2, canvas.height - 50);
	ctx.stroke();

	if (focalDist > 0) { // convex (converging) lens
		ctx.beginPath();
		ctx.ellipse(canvas.width/2, canvas.height/2, 20, 180, 0, 0, Math.PI*2);
		ctx.stroke();
	} else if (focalDist == 0) {
		ctx.beginPath();
		ctx.rect(canvas.width/2 - 20, canvas.height/2 - 180, 40, 360);
		ctx.stroke();
	} else { // concave (diverging) lens
		ctx.beginPath();
		ctx.ellipse(canvas.width/2 + 30, canvas.height/2, 20, 180, 0, Math.PI/2, Math.PI*3/2);
		ctx.ellipse(canvas.width/2 - 30, canvas.height/2, 20, 180, 0, Math.PI*3/2, Math.PI/2);
		ctx.closePath();
		ctx.stroke();
	}

	for (let x = canvas.width/2; x <= canvas.width - 75; x += 50) {
		ctx.beginPath();
		ctx.moveTo(x, canvas.height/2 - 5);
		ctx.lineTo(x, canvas.height/2 + 5);
		ctx.stroke();
	}

	for (let x = canvas.width/2; x >= 75; x -= 50) {
		ctx.beginPath();
		ctx.moveTo(x, canvas.height/2 - 5);
		ctx.lineTo(x, canvas.height/2 + 5);
		ctx.stroke();
	}
}

function drawRays() {
	ctx.strokeStyle = "#000";

	let slope1, slope2;

	if (obj.dist == focalDist) {
		slope1 = slope2 = obj.height/obj.dist;
	} else {
		slope1 = (img.height-obj.height)/img.dist;
		slope2 = img.height/img.dist;
	}

	ctx.beginPath();
	ctx.moveTo(obj.screenX, obj.screenY);
	ctx.lineTo(canvas.width/2, obj.screenY);
	ctx.lineTo(img.screenX, img.screenY);
	ctx.lineTo(canvas.width, canvas.height/2 + slope1*(canvas.width/2) - obj.height); // extended ray
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(obj.screenX, obj.screenY);
	ctx.lineTo(canvas.width/2, canvas.height/2);
	ctx.lineTo(img.screenX, img.screenY);
	ctx.lineTo(canvas.width, (canvas.width/2) * slope2 + canvas.height/2); // extended ray
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(obj.screenX, obj.screenY);
	ctx.lineTo(canvas.width/2-focalDist, canvas.height/2);
	ctx.lineTo(canvas.width/2, img.screenY);
	ctx.lineTo(img.screenX, img.screenY);
	ctx.lineTo(canvas.width, img.screenY); // extended ray
	ctx.stroke();
}

function drawFocalPoint() {
	ctx.beginPath();
	ctx.arc(canvas.width/2 - focalDist, canvas.height/2, 5, 0, Math.PI*2);
	ctx.fillStyle = "#00f";
	ctx.fill();
}

function drawAll() {
	drawScene();
	drawRays();
	obj.render();
	img.render();
	drawFocalPoint();
}

function refreshSim() {
	img.dist = obj.imgDist;
	img.height = obj.imgHeight;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawAll();
}

function refreshSimFromImg() {
	obj.dist = img.objDist;
	obj.height = img.objHeight;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawAll();
}

canvas.onmousedown = (e) => {
	if (e.shiftKey) {
		img.setPosFromCoords(e.offsetX, e.offsetY);
		refreshSimFromImg();
	} else if (e.ctrlKey) {
		focalDist = canvas.width/2 - e.offsetX;
		$("#focal-input").value = focalDist.toFixed(3);
		refreshSim();
	} else {
		obj.setPosFromCoords(e.offsetX, e.offsetY);
		refreshSim();
	}
}

canvas.onmousemove = (e) => {
	if (e.buttons) {
		if (e.shiftKey) {
			img.setPosFromCoords(e.offsetX, e.offsetY);
			refreshSimFromImg();
		} else if (e.ctrlKey) {
			focalDist = canvas.width/2 - e.offsetX;
			$("#focal-input").value = focalDist.toFixed(3);
			refreshSim();
		} else {
			obj.setPosFromCoords(e.offsetX, e.offsetY);
			refreshSim();
		}
	}
}

canvas.ontouchmove = (e) => {
	e.preventDefault();
	obj.setPosFromCoords(e.changedTouches[0].clientX - canvas.getBoundingClientRect().x, e.changedTouches[0].clientY - canvas.getBoundingClientRect().y);
	refreshSim();
}

$("#focal-input").value = focalDist.toFixed(3);
$("#focal-input").oninput = () => {
	focalDist = $("#focal-input").value;
	refreshSim();
}

window.onresize = () => {
	canvas.width = canvas.offsetWidth;
	refreshSim();
}

document.addEventListener("keydown", (e)=>{
	if (e.target == document.body) {
		switch (e.key) {
			case "ArrowUp":
				obj.height++;
				refreshSim();
				break;
			case "ArrowRight":
				obj.dist--;
				refreshSim();
				break;
			case "ArrowDown":
				obj.height--;
				refreshSim();
				break;
			case "ArrowLeft":
				obj.dist++;
				refreshSim();
				break;
		}
	}
})

refreshSim();
