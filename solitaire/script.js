let piles = []

const suits = ["S", "C", "H", "D"]
const card_names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

let used_cards = new Set()

function assignNewCard(card) {
    let card_name, suit
    do {
        card_name = Math.floor(Math.random() * 13)
        suit = Math.floor(Math.random() * 4)
    } while(used_cards.has(card_name.toString()+","+suit.toString()))
    used_cards.add(card_name.toString()+","+suit.toString())
    card.style.backgroundImage = "url(\"img/cards/"+card_names[card_name]+suits[suit]+".png\")"
}

function initializeBoard() {
    let pileNodes = document.querySelectorAll(".pile")
    for (let i = 0; i < pileNodes.length; i++) {
        piles.push(pileNodes[i].children)
        for (let j = 0; j < piles[i].length; j++) {
            piles[i][j].style.top = (j * 2).toString() + "vw";
        }
        assignNewCard(piles[i][piles[i].length - 1])
    }
}

initializeBoard()