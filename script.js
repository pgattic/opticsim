

const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

class sceneElement {
	dist = 0;
	height = 0;
	color = "";

	constructor(dist = 0, height = 0, color="red") {
		this.dist = dist;
		this.height = height;
		this.color = color;
	}

	get screenX(){
		return canvas.width/2 - this.dist;
	}

	get screenY(){
		return canvas.height/2 - this.height;
	}

	setPosFromCoords(x, y){
		this.dist = canvas.width/2 - x;
		this.height = canvas.height/2 - y;
	}

	render() {
		ctx.strokeStyle = "#000";
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(this.screenX, canvas.height/2);
		ctx.lineTo(this.screenX, this.screenY);
		ctx.stroke();
	
		ctx.beginPath();
		ctx.arc(this.screenX, this.screenY, 5, 0, Math.PI*2);
		ctx.fillStyle = "red";
		ctx.fill();
	}
}

let obj = new sceneElement(150, 50);
let img = new sceneElement();

let focalDist = 100;

function calculateImgFromObj(distObj, htObj, f) {
	distImg = -1/(1/f-1/distObj);

	//height/height = dist/dist
	htImg = distImg/distObj * htObj;
	return [distImg, htImg];
}

function drawScene() {
	ctx.strokeStyle = "#000";
	ctx.setLineDash([]);

	ctx.beginPath();
	ctx.moveTo(50, canvas.height/2);
	ctx.lineTo(canvas.width - 50, canvas.height/2);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(canvas.width/2, 50);
	ctx.lineTo(canvas.width/2, canvas.height-50);
	ctx.stroke();

	ctx.beginPath();
	ctx.ellipse(canvas.width/2, canvas.height/2, 20, 180, 0, 0, Math.PI*2);
	ctx.stroke();
}

function drawRays() {
	ctx.strokeStyle = "#000";

	ctx.beginPath();
	ctx.moveTo(obj.screenX, obj.screenY);
	ctx.lineTo(canvas.width/2, obj.screenY);
	ctx.lineTo(img.screenX, img.screenY);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(obj.screenX, obj.screenY);
	ctx.lineTo(img.screenX, img.screenY);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(obj.screenX, obj.screenY);
	ctx.lineTo(canvas.width/2, img.screenY);
	ctx.lineTo(img.screenX, img.screenY);
	ctx.stroke();
}

function drawFocalPoint() {
	ctx.beginPath();
	ctx.arc(canvas.width/2 - focalDist, canvas.height/2, 5, 0, Math.PI*2);
	ctx.fillStyle = "green";
	ctx.fill();
}

function drawAll() {
	[img.dist, img.height] = calculateImgFromObj(obj.dist, obj.height, focalDist);
	drawScene();
	drawRays();
	drawFocalPoint();
	obj.render();
	img.render();
}

drawAll();

canvas.onclick=(e)=> {
	obj.setPosFromCoords(e.layerX, e.layerY);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawAll();
}

canvas.onmousemove=(e)=> {
	if (e.buttons) {
		obj.setPosFromCoords(e.layerX, e.layerY);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawAll();
	}
}

