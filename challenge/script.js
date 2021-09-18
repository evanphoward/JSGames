const cells = document.querySelectorAll(".opNum, .numberWrapper, .opAns")
const numberCells = document.querySelectorAll(".number")
const opCells = document.querySelectorAll(".op")
const equalCells = document.querySelectorAll(".equals")

let ansLoc = [6, 9, 12]
let numbers = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
let answer = [-1, -1, -1, -1, -1, -1, -1, -1, -1]

function initializeCells() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].id = i.toString();
        cells[i].setAttribute("ondrop", "onDrop(event);")
        if(cells[i].className === "numberWrapper" || cells[i].className === "opAns")
            cells[i].setAttribute("onDragStart", "dragStart(event);")
        else
            cells[i].setAttribute("ondragover", "event.preventDefault();")
    }
    for(let i = 0; i < 3; i++) {
        opCells[i].addEventListener("click", function() {
            switch(opCells[i].textContent) {
                case "+": opCells[i].textContent = "-"
                    break
                case "-": opCells[i].textContent = "×"
                    break
                case "×": opCells[i].textContent = "÷"
                    break
                case "÷": opCells[i].textContent = "+"
                    break
            }
            updateCells(3*i+4)
        })
    }
}

function generateNumbers() {
    while(!generateAnswer()) {
        for (let i = 0; i < 4; i++) {
            numbers[i] = Math.floor(Math.random() * 12 + 1)
            numberCells[i].textContent = numbers[i].toString();
        }
    }
}

function generateAnswer() {
    if(numbers[0] === -1)
        return false
    // TODO: Maybe think of a better way to do this??
    for(let first = 0; first < 4; first++) {
        for(let sec = 0; sec < 4; sec++) {
            if(first === sec)
                continue
            for(let first_op = 0; first_op < 4; first_op++) {
                numbers[4] = do_op(first, sec, first_op)
                for(let third = 0; third < 5; third++) {
                    if(third === first || third === sec)
                        continue
                    for(let fourth = 0; fourth < 5; fourth++) {
                        if(fourth === third || fourth === sec || fourth === first)
                            continue
                        for(let sec_op = 0; sec_op < 4; sec_op++) {
                            numbers[5] = do_op(third, fourth, sec_op)
                            for(let fifth = 0; fifth < 6; fifth++) {
                                if(fifth === fourth || fifth === third || fifth === sec || fifth === first)
                                    continue
                                for(let sixth = 0; sixth < 6; sixth++) {
                                    if(sixth === fifth || sixth === fourth || sixth === third || sixth === sec || sixth === first)
                                        continue
                                    for(let third_op = 0; third_op < 4; third_op++) {
                                        if(do_op(fifth, sixth, third_op) === 24) {
                                            answer = [first, sec, first_op, third, fourth, sec_op, fifth, sixth, third_op]
                                            return true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false
}

function do_op(first, second, op) {
    switch(op) {
        case 0: return numbers[first] + numbers[second]
        case 1: return numbers[first] - numbers[second]
        case 2: return numbers[first] * numbers[second]
        case 3: return numbers[first] / numbers[second]
    }
}

function clearCell(cell) {
    cell.removeAttribute("onDragStart");

    if(cell.className !== "opAns")
        cell.setAttribute("ondragover", "event.preventDefault();")

    cell.setAttribute("draggable", "false")

    if(cell.className === "numberWrapper")
        numberCells[parseInt(cell.id)].textContent = "";
    else if(cell.className !== "opAns")
        cell.textContent = "";
    numbers[parseInt(cell.id)] = -1
}

function setCell(cell, num) {
    if(parseInt(cell.id) === 12) {
        cell.textContent = num.toString()
        return
    }
    cell.removeAttribute("ondragover");
    cell.setAttribute("onDragStart", "dragStart(event);")
    cell.setAttribute("draggable", "true")
    if(cell.className === "numberWrapper")
        numberCells[parseInt(cell.id)].textContent = num.toString()
    else
        cell.textContent = num.toString();
    numbers[parseInt(cell.id)] = num;
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDrop(event) {
    const data = parseInt(event.dataTransfer.getData("text/plain"))
    const cur_id = parseInt(event.target.id)

    setCell(event.target, numbers[data])
    clearCell(cells[data])

    if(ansLoc.includes(data))
        ansLoc[ansLoc.indexOf(data)] = cur_id

    if(cells[data].className === "opNum")
        updateCells(data)
    if(cells[cur_id].className === "opNum")
        updateCells(cur_id);

    numbers[data] = -1;
}

function updateCells(numCell) {
    let add = numCell % 3 === 1 ? 1 : 0
    let first = parseInt(cells[numCell - 1 + add].textContent)
    let second = parseInt(cells[numCell + add].textContent)
    let ans = numCell + 1 + add

    let row = Math.floor((numCell - 1) / 3) - 1
    if(Number.isInteger(first) && Number.isInteger(second)) {
        let result
        switch (opCells[row].textContent) {
            case "+":
                result = first + second
                break
            case "-":
                result = first - second
                break
            case "×":
                result = first * second
                break
            case "÷":
                result = first / second
                break
        }
        if(Number.isInteger(result) && result < 100) {
            numbers[ans] = result
            cells[ans].textContent = result.toString()
            setCell(cells[ansLoc[row]], result)
            numbers[ansLoc[row]] = result
            if(![6, 9, 12].includes(ansLoc[row]))
                updateCells(ansLoc[row])
            if(ans == 12)
                if(![numbers[4], numbers[5], numbers[7], numbers[8], numbers[10], numbers[11]].includes(-1))
                    cells[ans].style.color = result == 24 ? "green" : "black"
            equalCells[row].textContent = "="
            equalCells[row].style.color = "black"
        }
        else {
            equalCells[row].textContent = "≠"
            equalCells[row].style.color = "darkred"
            numbers[ansLoc[row]] = -1
            cells[ans].textContent = ""
            clearCell(cells[ansLoc[row]])
            if(![6, 9, 12].includes(ansLoc[row]))
                updateCells(ansLoc[row])
            ansLoc[row] = row * 3 + 6
        }
    }
    else {
        equalCells[row].style.color = "black"
        equalCells[row].textContent = "="
        numbers[ansLoc[row]] = -1
        cells[ans].textContent = ""
        clearCell(cells[ansLoc[row]])
        if(![6, 9, 12].includes(ansLoc[row]))
            updateCells(ansLoc[row])
        ansLoc[row] = row * 3 + 6
    }
}

initializeCells();
generateNumbers();