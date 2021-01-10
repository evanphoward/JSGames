let piles = []
let pile_cards = []

const suits = ["S", "C", "H", "D"]
const card_names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

let used_cards = new Set()

let discard = document.getElementById("discard");
let discard_cards = []
let discard_index = 0

let draw = document.getElementById("draw")


function setCardMovable(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", function(event) {
        event.stopImmediatePropagation()
        if(event.target.id === "discard") {
            setTimeout(function () {
                console.log(discard_index)
                discard_index -= 2;
                drawCard()
            }, 20)
        }
        else {
            setTimeout(function () {
                event.target.style.visibility = "hidden";
            }, 1)
        }
        event.dataTransfer.setData("text/plain", event.target.id);
    })
    card.addEventListener("dragend", function(event) {
        event.stopImmediatePropagation()
        event.target.style.visibility = "visible";
        if(event.target.id === "discard") {
            drawCard()
            console.log(discard_index)
        }
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

function assignCard(card, attributes) {
    card.classList.add("card")
    if(attributes == null) {
        attributes = getNewCard()
    }
    card.style.backgroundImage = "url(\"img/cards/"+card_names[attributes[0]]+suits[attributes[1]]+".png\")"
    setCardMovable(card)
    return attributes
}

function initializeBoard() {
    for(let i = 0; i < 22; i++) {
        discard_cards.push(getNewCard());
    }
    document.getElementById("drawWrapper").addEventListener("click", drawCard)
    let pileNodes = document.querySelectorAll(".pile")
    for (let i = 0; i < pileNodes.length; i++) {
        piles.push(pileNodes[i].children)
        for (let j = 0; j < piles[i].length; j++) {
            piles[i][j].style.top = (j * 2).toString() + "vw";
        }
        pile_cards.push(assignCard(piles[i][piles[i].length - 1]))
        piles[i][piles[i].length - 1].id = i.toString()
        piles[i][piles[i].length - 1].addEventListener("drop", dropCard)
        piles[i][piles[i].length - 1].setAttribute("ondragover", "event.preventDefault();")
    }
}

function drawCard(event) {
    if(discard_index === -1 || discard_index === discard_cards.length) {
        discard.style.visibility = "hidden"
        draw.style.visibility = "visible"
        discard_index = 0
        return
    }
    discard.style.visibility = "visible"
    assignCard(discard, discard_cards[discard_index])
    discard_index++;
    if(discard_index === discard_cards.length) {
        draw.style.visibility = "hidden"
    }
}

function dropCard(event) {
    const data = event.dataTransfer.getData("text/plain")
    if(data === "discard") {
        discard_cards.splice(discard_index, 1)
        discard_index--;
    }
    else {

    }
}

initializeBoard()