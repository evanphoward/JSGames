const num_rows  = 16;
const num_cols  = 30;
const num_mines = 99;

const table = document.querySelector("table")

function initializeBoard() {
    let mines = [];
    for(let i = 0; i < num_mines; i++){
        let new_mine = {};
        let new_mine_valid = false;
        while(!new_mine_valid){
            new_mine.row = Math.floor((Math.random() * num_rows));
            new_mine.col = Math.floor((Math.random() * num_cols));
            new_mine_valid = true;
            for(let j = 0; j < mines.length; j++){
                if((mines[j].row === new_mine.row) && (mines[j].col === new_mine.col))
                    new_mine_valid = false;
            }
        }
        mines.push(new_mine);
    }

    for(let r = 0; r < num_rows; r++){
        let tr = document.createElement("tr");
        for(let c = 0; c < num_cols; c++){
            let td = document.createElement("td")

            let box = document.createElement("div")
            td.addEventListener("click", onClick)
            box.classList.add("covered")
            box.id = r.toString()+","+c.toString()+",box"
            td.id = r.toString()+","+c.toString()+",td"
            td.appendChild(box)

            let contains_mine = false
            for(let j = 0; j < mines.length; j++){
                if((mines[j].row === r) && (mines[j].col === c))
                    contains_mine = true;
            }
            if(contains_mine){
                box.classList.add("mine")
            } else {
                // calculate number of adjacent mines
                let number = 0;
                for(let a = (r - 1); a <= (r + 1); a++){
                    for(let b = (c - 1); b <= (c + 1); b++){
                        for(let j = 0; j < mines.length; j++){
                            if((mines[j].row === a) && (mines[j].col === b)) number++;
                        }
                    }
                }
                if(number !== 0) {
                    box.textContent = number.toString()
                }
            }
            tr.appendChild(td)
        }
        table.append(tr);
    }
}

function onClick(event) {
    processClick(event.target.id, new Set())
}

function processClick(cellId, seen) {
    let cellRow = parseInt(cellId.split(",")[0])
    let cellCol = parseInt(cellId.split(",")[1])
    let cell = cells[cellRow * num_cols + cellCol]
    seen.add(cell)

    cell.classList.remove("covered")
    if(cell.classList.contains("mine"))
        return

    if(cell.textContent === "" || seen.size === 1) {
        if (cellRow !== num_rows - 1 && !seen.has(cells[(cellRow + 1) * num_cols + cellCol]))
            processClick(cells[(cellRow + 1) * num_cols + cellCol].id, seen)
        if (cellRow !== 0 && !seen.has(cells[(cellRow - 1) * num_cols + cellCol]))
            processClick(cells[(cellRow - 1) * num_cols + cellCol].id, seen)
        if (cellCol !== num_cols - 1 && !seen.has(cells[cellRow * num_cols + (cellCol + 1)]))
            processClick(cells[cellRow * num_cols + (cellCol + 1)].id, seen)
        if (cellCol !== 0 && !seen.has(cells[cellRow * num_cols + (cellCol - 1)]))
            processClick(cells[cellRow * num_cols + (cellCol - 1)].id, seen)
    }
}

initializeBoard()
const cells = document.querySelectorAll("div");