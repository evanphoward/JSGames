const maze = [
    '#','#','#','#','#','#','#','#','#','#','#',
    '#',' ',' ',' ',' ',' ',' ','#',' ',' ','#',
    '#','#','#','#','#',' ','#','#','#',' ','#',
    '#',' ',' ',' ','#',' ','#',' ',' ',' ','#',
    '#',' ','#',' ','#',' ',' ',' ','#',' ','#',
    '#',' ','#','#','#',' ','#','#','#',' ','#',
    '#',' ',' ',' ',' ',' ','#',' ','#',' ','#',
    '#',' ','#',' ','#',' ','#',' ','#',' ','#',
    '#',' ','#','#','#',' ','#',' ','#',' ','#',
    '#',' ','#',' ',' ',' ','#',' ',' ',' ','#',
    '#','#','#','#','#','#','#','#','#','#','#'
]

const mazeHeight = 11;
const mazeWidth = 11;

const screenWidth = 200;
const screenHeight = 356;

const canvas = document.querySelector("canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
const canvas_ctx = canvas.getContext('2d');


let playerX = 1.5;
let playerY = 1.5;
let playerA = 90;

let playerAV = 0;
let playerV = 0;

const FOV = 120;

function updateScreen() {
    playerA += playerAV
    if(playerV !== 0) {
        let newPlayerX = playerX + (playerV * Math.sin(playerA * Math.PI / 180))
        let newPlayerY = playerY - (playerV * Math.cos(playerA * Math.PI / 180))
        if(maze[Math.floor(newPlayerY) * mazeWidth + Math.floor(newPlayerX)] !== '#') {
            playerX = newPlayerX
            playerY = newPlayerY
        }
    }

    for(let x = 0; x < screenWidth; x++) {
        let rayAngle = (playerA - FOV / 2) + (x / screenWidth) * FOV;
        let distanceToWall = 0;
        let hitWall = false;

        rayX = Math.sin(rayAngle * Math.PI / 180);
        rayY = Math.cos(rayAngle * Math.PI / 180);

        while(!hitWall) {
            distanceToWall += 0.1;

            if(maze[Math.floor(playerY - rayY * distanceToWall) * mazeWidth + Math.floor(playerX + rayX * distanceToWall)] === '#') {
                hitWall = true;
            }
        }

        let color = ((1 - distanceToWall/mazeWidth) * 255);
        let ceilingHeight = (screenHeight / 2) - screenHeight / distanceToWall;

        for(let y = 0; y < screenHeight; y++) {
            if(y < ceilingHeight) {
                let ceilingColor = (1 - (y / (screenHeight / 3))) * 128;
                canvas_ctx.fillStyle = "rgba("+ceilingColor+",0,0,1)"
            }
            else if(y > screenHeight - ceilingHeight) {
                let ceilingColor = (1 - ((screenHeight - y) / ceilingHeight)) * 180;
                canvas_ctx.fillStyle = "rgba("+ceilingColor+",0,0,1)"
            }
            else {
                canvas_ctx.fillStyle = "rgba("+color+","+color+","+color+",1)"
            }
            canvas_ctx.fillRect(x, y, 1, 1);
        }
    }

    window.requestAnimationFrame(updateScreen);
}

document.addEventListener('keydown', (e) => {
    if(e.code === 'KeyD')
        playerAV = 8
    else if(e.code === 'KeyA')
        playerAV = -8
    else if(e.code === 'KeyW')
        playerV = 0.3
    else if(e.code === 'KeyS')
        playerV = -0.3
})

document.addEventListener('keyup', (e) => {
    if(e.code === 'KeyD' || e.code === 'KeyA')
        playerAV = 0
    else if(e.code === 'KeyW' || e.code === 'KeyS')
        playerV = 0
})

window.requestAnimationFrame(updateScreen);