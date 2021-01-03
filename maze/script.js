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

const screenWidth = 120;
const screenHeight = 58;

const pixels = document.querySelectorAll("td");

let playerX = 1;
let playerY = 1;
let playerA = 90;

const FOV = 120;

function updateScreen() {
    for(let x = 0; x < screenWidth; x++) {
        let rayAngle = (playerA - FOV / 2) + (x / screenWidth) * FOV;
        let distanceToWall = 0;
        let hitWall = false;

        rayX = Math.sin(rayAngle * Math.PI / 180);
        rayY = Math.cos(rayAngle * Math.PI / 180);

        while(!hitWall) {
            distanceToWall += 0.1;

            if(maze[Math.floor(playerY + rayY * distanceToWall) * mazeWidth + Math.floor(playerX + rayX * distanceToWall)] === '#') {
                hitWall = true;
            }
        }

        let color = ((1 - distanceToWall/mazeWidth) * 255);
        let ceilingHeight = (screenHeight / 2) - screenHeight / distanceToWall;

        for(let y = 0; y < screenHeight; y++) {
            if(y < ceilingHeight) {
                let ceilingColor = ((ceilingHeight - y) / ceilingHeight) * 180;
                pixels[y * screenWidth + x].style.backgroundColor = "rgb("+ceilingColor+", 0, 0)";
            }
            else if(y > screenHeight - ceilingHeight) {
                let ceilingColor = (1 - ((screenHeight - y) / ceilingHeight)) * 180;
                pixels[y * screenWidth + x].style.backgroundColor = "rgb("+ceilingColor+", 0, 0)";
            }
            else {
                pixels[y * screenWidth + x].style.backgroundColor = "rgb("+color+", "+color+", "+color+")";
            }
        }
    }

    window.requestAnimationFrame(updateScreen);
}

document.addEventListener('keypress', (e) => {
    if(e.code === 'KeyD')
        playerA += 3
    else if(e.code === 'KeyA')
        playerA -= 3
    else if(e.code === 'KeyW') {
        let newPlayerX = playerX + Math.sin(playerA * Math.PI / 180)
        let newPlayerY = playerY + Math.cos(playerA * Math.PI / 180)
        if(maze[Math.floor(newPlayerY) * mazeWidth + Math.floor(newPlayerX)] !== '#') {
            playerX = newPlayerX
            playerY = newPlayerY
        }
    }
    else if(e.code === 'KeyS') {
        let newPlayerX = playerX - Math.sin(playerA * Math.PI / 180)
        let newPlayerY = playerY - Math.cos(playerA * Math.PI / 180)
        if(maze[Math.floor(newPlayerY) * mazeWidth + Math.floor(newPlayerX)] !== '#') {
            playerX = newPlayerX
            playerY = newPlayerY
        }
    }
})

window.requestAnimationFrame(updateScreen);