

const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let obj = {
	dist : 150,
	height : 50,
}

let focalDist = 100;

function drawScene() {
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

function drawFocalPoint() {
	ctx.beginPath();
	ctx.arc(canvas.width/2 - focalDist, canvas.height/2, 5, 0, Math.PI*2);
	ctx.fillStyle = "green";
	ctx.fill();
}

function drawObj() {
	ctx.setLineDash([5, 5]);
	ctx.beginPath();
	ctx.moveTo(canvas.width/2 - obj.dist, canvas.height/2);
	ctx.lineTo(canvas.width/2 - obj.dist, canvas.height/2 - obj.height);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(canvas.width/2 - obj.dist, canvas.height/2 - obj.height, 5, 0, Math.PI*2);
	ctx.fillStyle = "red";
	ctx.fill();

}

function drawRays() {
	let [imgX, imgY] = calculateImgFromObj(obj.dist, obj.height, focalDist);
	ctx.beginPath();
	ctx.moveTo(canvas.width/2 - obj.dist, canvas.height/2 - obj.height);
	ctx.lineTo(canvas.width/2, canvas.height/2 - obj.height);
	ctx.lineTo(canvas.width/2 - imgX, canvas.height/2 - imgY);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(canvas.width/2 - obj.dist, canvas.height/2 - obj.height);
	ctx.lineTo(canvas.width/2 - imgX, canvas.height/2 - imgY);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(canvas.width/2 - obj.dist, canvas.height/2 - obj.height);
	ctx.lineTo(canvas.width/2, canvas.height/2 - imgY);
	ctx.lineTo(canvas.width/2 - imgX, canvas.height/2 - imgY);
	ctx.stroke();
}

function drawAll() {
	drawScene();
	drawFocalPoint();
	drawRays();
	drawObj();
	drawImg();
}


function calculateImgFromObj(distObj, htObj, f) {
	distImg = -1/(1/f-1/distObj);

	//height/height = dist/dist
	htImg = distImg/distObj * htObj;
	return [distImg, htImg];
}

function drawImg() {
	let [imgX, imgY] = calculateImgFromObj(obj.dist, obj.height, focalDist);
	ctx.beginPath();
	ctx.arc(canvas.width/2 - imgX, canvas.height/2 - imgY, 5, 0, Math.PI*2);
	ctx.fillStyle = "red";
	ctx.fill();
}

drawAll();

canvas.onclick=(e)=> {
	obj.dist = canvas.width/2 - e.layerX;
	obj.height = -(e.layerY - canvas.height/2);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawAll();
}

canvas.onmousemove=(e)=> {
	if (e.buttons) {
		obj.dist = canvas.width/2 - e.layerX;
		obj.height = -(e.layerY - canvas.height/2);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawAll();
		}
}

