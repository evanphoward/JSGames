let pileNodes = document.querySelectorAll(".pile")
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
                discard_index -= 2;
                drawCard()
            }, 1)
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
    for(let i = 0; i < 4; i++) {
        piles.push(pileNodes[i].children)
        pile_cards.push([])
        pileNodes[i].id = i.toString()
        pileNodes[i].setAttribute("ondragover", "event.preventDefault();")
        pileNodes[i].addEventListener("drop", dropCard)
    }
    for(let i = 0; i < 22; i++) {
        discard_cards.push(getNewCard());
    }
    document.getElementById("drawWrapper").addEventListener("click", drawCard)
    for (let i = 4; i < pileNodes.length; i++) {
        pileNodes[i].addEventListener("drop", dropCard)
        piles.push(pileNodes[i].children)
        for (let j = 0; j < piles[i].length; j++) {
            piles[i][j].style.top = (j * 2).toString() + "vw";
            piles[i][j].addEventListener("drop", dropCard)
        }
        pile_cards.push([assignCard(piles[i][piles[i].length - 1])])
        piles[i][piles[i].length - 1].id = i.toString()
        piles[i][piles[i].length - 1].setAttribute("ondragover", "event.preventDefault();")
    }
}

function drawCard() {
    if(discard_index === -1 || discard_index === discard_cards.length) {
        discard.style.visibility = "hidden"
        if(discard_cards.length > 1 || (discard_cards.length === 1 && discard_index !== -1))
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
    event.stopImmediatePropagation()
    const data = event.dataTransfer.getData("text/plain")
    const pile_id = parseInt(event.target.id)
    let attributes
    if(data === "discard") {
        attributes = discard_cards[discard_index]
        discard_cards.splice(discard_index, 1)
        discard_index--;
    }
    else {
        let prev_pile = parseInt(data)
        attributes = pile_cards[prev_pile].pop()
        piles[prev_pile][piles[prev_pile].length - 1].remove()
        if(piles[prev_pile].length > 0) {
            let prevCard = piles[prev_pile][piles[prev_pile].length - 1]
            prevCard.setAttribute("ondragover", "event.preventDefault();")
            prevCard.id = prev_pile
            if(!piles[prev_pile][piles[prev_pile].length - 1].classList.contains("up")) {
                pile_cards[prev_pile].push(assignCard(piles[prev_pile][piles[prev_pile].length - 1]))
                prevCard.classList.add("up")
            }
        }
        else {
            pileNodes[prev_pile].id = prev_pile.toString()
            pileNodes[prev_pile].setAttribute("ondragover", "event.preventDefault();")
        }
    }
    let prevCard
    if(piles[pile_id].length > 0) {
        prevCard = piles[pile_id][piles[pile_id].length - 1]
        prevCard.removeAttribute("ondragover")
        prevCard.setAttribute("draggable", "false")
        prevCard.removeAttribute("id")
    }

    let newCard = document.createElement("div")
    newCard.classList.add("card", "up")
    if(piles[pile_id].length > 0 && pile_id > 3)
        newCard.style.top = (parseInt(prevCard.style.top.split("v")[0]) + 2) + "vw"
    else
        newCard.style.top = "0vw"
    newCard.id = pile_id.toString()
    assignCard(newCard, attributes)

    pileNodes[pile_id].appendChild(newCard)
    pile_cards[pile_id].push(attributes)

    if(piles[pile_id].length === 1) {
        pileNodes[pile_id].removeAttribute("ondragover")
    }

    newCard.setAttribute("ondragover", "event.preventDefault();")
}

initializeBoard()