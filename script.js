const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = canvas.width/200;
let adjustY = canvas.height/200;

let mouse = {
	x: null,
	y: null,
    radius: 75
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + canvas.clientLeft;
		mouse.y = event.y + canvas.clientTop;
});

ctx.font = 'bold 13px Arial';
ctx.fillText('Um hover é sempre bem vindo!', 0, 20);
const data = ctx.getImageData(0, 0, canvas.width, 100);

class Particle {
    constructor(x, y){
        this.x = x,
        this.y = y,
        this.size = 2,
        this.baseX = this.x,
        this.baseY = this.y,
        this.density = ((Math.random() * 14) + 1);


    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        var maxDistance = mouse.radius;
        var force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        let directionX = (forceDirectionX * force * this.density)
        let directionY = (forceDirectionY * force * this.density);
        if (distance < mouse.radius + this.size){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX ) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            } if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}


function init(){
    particleArray = [];
 
    for (var y = 0, y2 = data.height; y < y2; y++) {
        for (var x = 0, x2 = data.width; x < x2; x++) {
            if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 120) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 7, positionY * 7));
            }
        }
    }
}

function animate(){
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0,0,innerWidth,innerHeight);
    ctx.clearRect(0,0,innerWidth,innerHeight);
    connect();
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update();
        particleArray[i].draw();
    }
    requestAnimationFrame(animate);
}
init();
animate();

window.addEventListener('resize',
function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});


function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance = (( particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x)) + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y))
            
            if (distance < 2600) {
                opacityValue = 1 - (distance/2600);
                let dx = mouse.x - particleArray[a].x;
                let dy = mouse.y - particleArray[a].y;
                let mouseDistance = Math.sqrt(dx*dx+dy*dy);
                
                if (mouseDistance < mouse.radius / 2) {
                  ctx.strokeStyle='rgba(0,0,255,' + opacityValue + ')';
                } 
                
                else if (mouseDistance < mouse.radius - 50) {
                  ctx.strokeStyle='rgba(0,0,140,' + opacityValue + ')';
                } 
                
                else if (mouseDistance < mouse.radius + 20) {
                  ctx.strokeStyle='rgba(0,0,40,' + opacityValue + ')';
                } 
                
                else  {
                    ctx.strokeStyle='rgba(0,0,0,' + opacityValue + ')';
                }

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}
