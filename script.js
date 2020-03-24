const cellElements = document.querySelectorAll('[data-cell]')
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
let circleTurn = false;


const board = document.querySelector('.board');
board.classList.add('x');


function startGame()
{
    document.querySelector('[data-winning-message-text]').textContent = '';
    document.querySelector('.winning-message').classList.remove('show');
    cellElements.forEach(cell=>{
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click',handleClick);
        cell.addEventListener('click', handleClick, {once: true})
    })
    circleTurn = true;
    swapTurns();
}

document.querySelector('#restartButton').addEventListener('click',startGame)

const winList = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function handleClick(e){
    //place marker
    const cell = e.target;
    currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    //check for win
    if(draw()){
        document.querySelector('[data-winning-message-text]').textContent = 'Draw!';
        document.querySelector('.winning-message').classList.add('show')
    }
    if(checkWin()){
        document.querySelector('[data-winning-message-text]').textContent = `${ circleTurn? 'O\'s' :'X\'s'} Won!`;
        document.querySelector('.winning-message').classList.add('show')
    }
    //check for draw
    //switch player
    swapTurns();
}

function placeMark(cell, currentClass)
{
    cell.classList.add(currentClass);
}

function swapTurns()
{
    if(circleTurn)
    {
        circleTurn = false;
        board.classList.add(X_CLASS);
        board.classList.remove(CIRCLE_CLASS);
    }
    else{
        circleTurn = true;
        board.classList.remove(X_CLASS);
        board.classList.add(CIRCLE_CLASS);
    }
}



function draw()
{
    return [...cellElements].every(cell=>{
        return cell.classList.contains(CIRCLE_CLASS)||cell.classList.contains(X_CLASS);
    })
    
}

function checkWin()
{
    return winList.some(triplet=>{
       return triplet.every(index=>{
            return cellElements[index].classList.contains(currentClass);
        })
    })
}

startGame();

//AI CODE//
/*
function AI_Turn()
{
    let blanks = [];
    cellElements.forEach(element => {
        if(!(element.classList.contains(X_CLASS)||element.classList.contains(CIRCLE_CLASS)))
        {
            element.classList.add(currentClass);
            let score = minimax();
            element.classList.remove(currentClass);
        }
    });
    console.log(blanks)
}


function minimax(cell, blanks ,maxplayer)
{
    cell.classList.add(currentClass);
    if(checkWin())
    {
        cell.classList.remove(currentClass);
        return 1;
    }
    
    
    if(draw())
    {
        cell.classList.remove(currentClass);
        return 0;
    }


    if(maxplayer)
    {
        maxScore = -Infinity;

    }
}
*/