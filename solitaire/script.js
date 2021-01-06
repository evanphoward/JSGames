let piles = []
let used_cards = []
const pileNodes = document.querySelectorAll(".pile")

function initializeBoard() {
    for (let i = 0; i < pileNodes.length; i++) {
        piles.push(pileNodes[i].children)
        for (let j = 0; j < piles[i].length; j++) {
            piles[i][j].style.top = (j * 2).toString() + "vw";
        }
    }
}

initializeBoard()