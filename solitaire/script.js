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


// Makes a card able to be dragged with the corresponding drag listeners
function setCardMovable(card) {
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", function(event) {
        event.stopImmediatePropagation()
        // Makes the correct card show when moving a card from the discard pile
        if(event.target.id === "discard") {
            setTimeout(function () {
                discard_index -= 2;
                drawCard()
            }, 1)
        }
        else {
            // Makes the card and all cards moved with it disappear
            setTimeout(function () {
                event.target.style.visibility = "hidden";
                let pile_id = parseInt(event.target.id.split(",")[0])
                let pile_offset = parseInt(event.target.id.split(",")[1])
                if(pile_offset !== pile_cards[pile_id].length - 1) {
                    for(let i = pile_offset + 1; i < piles[pile_id].length; i++) {
                        piles[pile_id][piles[pile_id].length - pile_cards[pile_id].length + i].style.visibility = "hidden";
                    }
                }
            }, 1)
        }
        event.dataTransfer.setData("text/plain", event.target.id);
    })
    card.addEventListener("dragend", function(event) {
        // Makes all necessary cards reappear
        event.stopImmediatePropagation()
        event.target.style.visibility = "visible";
        if(event.target.id === "discard") {
            drawCard()
        }
        else {
            let pile_id = parseInt(event.target.id.split(",")[0])
            let pile_offset = parseInt(event.target.id.split(",")[1])
            if(pile_offset !== pile_cards[pile_id].length - 1) {
                for(let i = pile_offset + 1; i < piles[pile_id].length; i++) {
                    piles[pile_id][piles[pile_id].length - pile_cards[pile_id].length + i].style.visibility = "visible";
                }
            }
        }
    })
}

// Returns an unused card
function getNewCard() {
    let card_name, suit
    do {
        card_name = Math.floor(Math.random() * 13)
        suit = Math.floor(Math.random() * 4)
    } while (used_cards.has(card_name.toString() + "," + suit.toString()))
    used_cards.add(card_name.toString()+","+suit.toString())
    return [card_name, suit]
}

// Sets a card element to a specific card. If attributes is unspecified it sets it to a random unused card
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
    // Set up the win piles
    for(let i = 0; i < 4; i++) {
        piles.push(pileNodes[i].children)
        pile_cards.push([])
        pileNodes[i].id = i.toString() + ",-1"
        pileNodes[i].setAttribute("ondragover", "event.preventDefault();")
        pileNodes[i].addEventListener("drop", dropCard)
    }
    // Generates the 24 cards in the draw pile
    for(let i = 0; i < 24; i++) {
        discard_cards.push(getNewCard());
    }
    document.getElementById("drawWrapper").addEventListener("click", drawCard)
    // Sets up the piles on the board
    for (let i = 4; i < pileNodes.length; i++) {
        pileNodes[i].addEventListener("drop", dropCard)
        piles.push(pileNodes[i].children)
        for (let j = 0; j < piles[i].length; j++) {
            piles[i][j].style.top = (j * 2).toString() + "vw";
            piles[i][j].addEventListener("drop", dropCard)
        }
        pile_cards.push([assignCard(piles[i][piles[i].length - 1])])
        piles[i][piles[i].length - 1].id = i.toString() + ",0"
        piles[i][piles[i].length - 1].setAttribute("ondragover", "event.preventDefault();")
    }
}

// Draws a card from the deck
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
    const pile_id = parseInt(event.target.id.split(",")[0])
    let attributes = []

    let first_attribute = data === "discard" ? discard_cards[discard_index] : pile_cards[parseInt(data.split(",")[0])][parseInt(data.split(",")[1])]

    // Checks if this is a valid move
    // Win piles
    if(pile_id < 4) {
        if(pile_cards[pile_id].length === 0 && first_attribute[0] !== 0)
            return
        if(pile_cards[pile_id].length > 0 && (first_attribute[1] !== pile_cards[pile_id][0][1] ||  first_attribute[0] - pile_cards[pile_id][pile_cards[pile_id].length - 1][0] !== 1))
            return
    }
    // Regular piles
    else {
        if(pile_cards[pile_id].length === 0 && first_attribute[0] !== 12)
            return
        if(pile_cards[pile_id].length > 0) {
            if(pile_cards[pile_id][pile_cards[pile_id].length - 1][0] - first_attribute[0] !== 1)
                return
            let drop_suit = pile_cards[pile_id][pile_cards[pile_id].length - 1][1]
            if((drop_suit < 2 && first_attribute[1] < 2) || (drop_suit > 1 && first_attribute[1] > 1))
                return
        }
    }


    // Pushes the cards to be moved into attributes and removes them from their old place
    if(data === "discard") {
        attributes.push(discard_cards[discard_index])
        discard_cards.splice(discard_index, 1)
        discard_index--;
    }
    else {
        let prev_pile = parseInt(data.split(",")[0])
        let pile_offset = parseInt(data.split(",")[1])

        if(pile_id < 4 && pile_cards[prev_pile].length - pile_offset !== 1)
            return

        for(let i = pile_offset; i < pile_cards[prev_pile].length; i++) {
            piles[prev_pile][piles[prev_pile].length - pile_cards[prev_pile].length + i].remove()
            attributes.push(pile_cards[prev_pile][i])
        }
        pile_cards[prev_pile].splice(pile_offset)

        // Deals with the card underneath the moved card
        if(piles[prev_pile].length > 0) {
            let prevCard = piles[prev_pile][piles[prev_pile].length - 1]
            prevCard.setAttribute("ondragover", "event.preventDefault();")

            if(!piles[prev_pile][piles[prev_pile].length - 1].classList.contains("up")) {
                prevCard.id = prev_pile.toString() + ",0"
                pile_cards[prev_pile].push(assignCard(piles[prev_pile][piles[prev_pile].length - 1]))
                prevCard.classList.add("up")
            }
            else {
                prevCard.id = prev_pile.toString() + "," + (pile_cards[prev_pile].length - 1).toString()
            }
        }
        else {
            pileNodes[prev_pile].id = prev_pile.toString() + ",-1"
            pileNodes[prev_pile].setAttribute("ondragover", "event.preventDefault();")
        }
    }

    let prevCard
    if(piles[pile_id].length > 0) {
        prevCard = piles[pile_id][piles[pile_id].length - 1]
        prevCard.removeAttribute("ondragover")
    }

    // Create a new card for every card to be moved, put it in right place
    let newCard
    let blankSpace = !(piles[pile_id].length > 0 && pile_id > 3)
    for(let i = 0; i < attributes.length; i++) {
        newCard = document.createElement("div")
        newCard.classList.add("card", "up")
        if(blankSpace)
            newCard.style.top = (i * 2).toString() + "vw"
        else
            newCard.style.top = (parseInt(prevCard.style.top.split("v")[0]) + 2 * i + 2) + "vw"
        newCard.id = pile_id.toString() + "," + pile_cards[pile_id].length.toString()
        assignCard(newCard, attributes[i])

        pileNodes[pile_id].appendChild(newCard)
        pile_cards[pile_id].push(attributes[i])

        if (piles[pile_id].length === 1) {
            pileNodes[pile_id].removeAttribute("ondragover")
        }
    }

    newCard.setAttribute("ondragover", "event.preventDefault();")
}

initializeBoard()