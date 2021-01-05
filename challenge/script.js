const numberCells = document.querySelectorAll(".number");
for(let i = 0; i < 4; i++) {
    numberCells[i].setAttribute("onDragStart","dragStart(event);")
    numberCells[i].setAttribute("ondragover", "event.preventDefault();")
    numberCells[i].setAttribute("ondrop", "onDrop(event);")
}
const opCells = document.querySelectorAll(".op");
const opNumCells = document.querySelectorAll(".opNum");
for(let i = 0; i < opNumCells.length; i++) {
    opNumCells[i].setAttribute("onDragStart","dragStart(event);")
    opNumCells[i].setAttribute("ondragover", "event.preventDefault();")
    opNumCells[i].setAttribute("ondrop", "onDrop(event);")
}
const opAnsCells = document.querySelectorAll(".opAns");
for(let i = 0; i < opAnsCells.length; i++) {
    opAnsCells[i].setAttribute("onDragStart", "dragStart(event);")
}

let numbers = [-1, -1, -1, -1, -1, -1]

let answer = [-1, -1, -1, -1, -1, -1, -1, -1, -1]

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

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDrop(event) {
    const data = event.dataTransfer.getData("text/plain");
    if(event.target.id !== "") {
        return
    }
    event.target.textContent = numbers[data].toString();
    for(let i = 0; i < opNumCells.length; i++) {
        if(opNumCells[i].id === data) {
            opNumCells[i].textContent = "";
            opNumCells[i].id = "";
        }
    }
    event.target.id = data;
    numberCells[data].textContent = "";
    event.preventDefault();
}

generateNumbers();