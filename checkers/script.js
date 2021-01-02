const board = [
    -1, 0, -1, 1, -1, 2, -1, 3,
    4, -1, 5, -1, 6, -1, 7, -1,
    -1, 8, -1, 9, -1, 10, -1, 11,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    12, -1, 13, -1, 14, -1, 15, -1,
    -1, 16, -1, 17, -1, 18, -1, 19,
    20, -1, 21, -1, 22, -1, 23, -1
]

const moves = [7, 9, 14, 18, -7, -9, -14, -18]

// DOM References
const cells = document.querySelectorAll("td");
let redPieces = document.querySelectorAll("div.redPiece");
let blackPieces = document.querySelectorAll("div.blackPiece");
const redTurn = document.querySelector(".redTurn");
const blackTurn = document.querySelector(".blackTurn");
const divider = document.querySelector("#divider");

// Player Properties
let turn = true;
let redScore = 12;
let blackScore = 12;
let playerPieces;

let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    spaces: [false, false, false, false, false, false, false, false]
}

function givePiecesEventListeners() {
    playerPieces = turn ? redPieces : blackPieces;
    for(let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].addEventListener("click", selectPiece);
    }
}

function selectPiece() {
    removeCellOnclick();

    // Reset all borders to unselected
    for(let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }

    // Update current selected piece parameters
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = board.indexOf(selectedPiece.pieceId);
    selectedPiece.isKing = document.getElementById(selectedPiece.pieceId).classList.contains("king");
    selectedPiece.spaces = [false, false, false, false, false, false, false, false];

    // Get all possible moves
    for(let i = 0; i < 8; i++) {
        if(board[selectedPiece.indexOfBoardPiece + moves[i]] === -1 && !cells[selectedPiece.indexOfBoardPiece + moves[i]].classList.contains("noPiece")) {
            if(i === 0 || i === 1 || i === 4 || i === 5) {
                selectedPiece.spaces[i] = true;
            }
            else {
                let intermediatePiece = board[selectedPiece.indexOfBoardPiece + (moves[i] / 2)]
                if(intermediatePiece !== -1 && ((intermediatePiece >= 12 && turn) || (intermediatePiece < 12 && !turn))) {
                    selectedPiece.spaces[i] = true;
                }
            }
            if(!selectedPiece.isKing && ((turn && i >= 4) || (!turn && i < 4))) {
                selectedPiece.spaces[i] = false;
            }
        }
    }

    // If there are possible moves, change the border and update the possible move locations with listeners
    if(selectedPiece.spaces.includes(true)) {
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
        for (let i = 0; i < 8; i++) {
            if (selectedPiece.spaces[i]) {
                cells[selectedPiece.indexOfBoardPiece + moves[i]].setAttribute("onclick", "makeMove(" + moves[i] + ")")
            }
        }
    }
}

function removeCellOnclick() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

function makeMove(number) {
    document.getElementById(selectedPiece.pieceId).remove();
    let text = (turn ? `redPiece` : `blackPiece`) + (selectedPiece.isKing ? ` king` : ``);
    cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<div class="${text}" id="${selectedPiece.pieceId}"></div>`;

    redPieces = document.querySelectorAll("div.redPiece");
    blackPieces = document.querySelectorAll("div.blackPiece");

    let indexOfPiece = selectedPiece.indexOfBoardPiece
    if (number === 14 || number === -14 || number === 18 || number === -18) {
        changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
    } else {
        changeData(indexOfPiece, indexOfPiece + number);
    }
}

function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = -1;
    board[modifiedIndex] = parseInt(selectedPiece.pieceId);
    if ((turn && selectedPiece.pieceId < 12 && modifiedIndex >= 57) ||
        (!turn && selectedPiece.pieceId >= 12 && modifiedIndex <= 7)) {
        document.getElementById(selectedPiece.pieceId).classList.add("king")
    }
    if (removePiece) {
        board[removePiece] = -1;
        if (turn && selectedPiece.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--
        }
        if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--
        }
    }

    selectedPiece.pieceId = -1;
    selectedPiece.indexOfBoardPiece = -1;
    selectedPiece.isKing = false;
    selectedPiece.spaces = [false, false, false, false, false, false, false, false]

    removeCellOnclick();

    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].removeEventListener("click", selectPiece);
    }

    if(blackScore === 0 || redScore === 0) {
        divider.style.display = "none";
        if(blackScore === 0) {
            redTurn.style.color = "black";
            blackTurn.style.display = "none";
            redTurn.textContent = "RED WINS!";
        }
        else if(redScore === 0) {
            blackTurn.style.color = "black";
            redTurn.style.display = "none";
            blackTurn.textContent = "BLACK WINS!";
        }
    }

    if (turn) {
        turn = false;
        redTurn.style.color = "lightGrey";
        blackTurn.style.color = "black";
    } else {
        turn = true;
        blackTurn.style.color = "lightGrey";
        redTurn.style.color = "black";
    }

    givePiecesEventListeners();
}

givePiecesEventListeners();