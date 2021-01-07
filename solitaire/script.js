let piles = []

const suits = ["S", "C", "H", "D"]
const card_names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

let used_cards = new Set()

let discard = document.querySelector("#discard div");
let discard_cards = []
let discard_index = 0

let draw = document.querySelector("#draw div")


function setCardMovable(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", function(event) {
        event.target.classList.add("hide");
    })
    card.addEventListener("dragend", function(event) {
        event.target.classList.remove("hide")
    })
}

function getNewCard() {
    let card_name, suit
    do {
        card_name = Math.floor(Math.random() * 13)
        suit = Math.floor(Math.random() * 4)
    } while (used_cards.has(card_name.toString() + "," + suit.toString()))
    used_cards.add(card_name.toString()+","+suit.toString())
    return [card_name, suit]
}

function assignNewCard(card, attributes) {
    card.classList.add("card")
    if(attributes == null) {
        attributes = getNewCard()
    }
    card.style.backgroundImage = "url(\"img/cards/"+card_names[attributes[0]]+suits[attributes[1]]+".png\")"
    setCardMovable(card)
}

function initializeBoard() {
    for(let i = 0; i < 22; i++) {
        discard_cards.push(getNewCard());
    }
    document.getElementById("draw").addEventListener("click", drawCard)
    let pileNodes = document.querySelectorAll(".pile")
    for (let i = 0; i < pileNodes.length; i++) {
        piles.push(pileNodes[i].children)
        for (let j = 0; j < piles[i].length; j++) {
            piles[i][j].style.top = (j * 2).toString() + "vw";
        }
        assignNewCard(piles[i][piles[i].length - 1])
    }
}

function drawCard(event) {
    if(discard_index === discard_cards.length) {
        discard.style.visibility = "hidden"
        draw.style.visibility = "visible"
        discard_index = 0
        return
    }
    discard.style.visibility = "visible"
    assignNewCard(discard, discard_cards[discard_index])
    discard_index++;
    if(discard_index === discard_cards.length) {
        draw.style.visibility = "hidden"
    }
}

initializeBoard()