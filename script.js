const board=document.querySelector(".board");
const start=document.querySelector(".btn-start");
const restart=document.querySelector(".btn-restart");
const modal=document.querySelector(".modal");
const startGameModal=document.querySelector(".start-game");
const restartGameModal=document.querySelector(".restart-game")
const highScoreElement=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElement=document.querySelector("#time");


const blockwidth=50;
const blockheight=50;

let highScore=localStorage.getItem("highscore") || 0;
let Score=0;
let time=`00:00`

highScoreElement.innerText=highScore;


const cols=Math.floor(board.clientWidth/blockwidth);
const rows=Math.floor(board.clientHeight/blockheight);

const blocks=[];
let snake=[
    {x:1,y:3},
    ]
let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}


   
let direction="right";
let intervalId=null;
let timeIntervalId=null

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");

        if ((row + col) % 2 === 1) {
            block.classList.add("alt");
        }

        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}


//render funtion
function render(){

    let head=null;

    blocks[`${food.x}-${food.y}`].classList.add("food");


    if(direction==="left"){
        head={x:snake[0].x,y:snake[0].y-1}
    }else if(direction==="right"){
        head={x:snake[0].x,y:snake[0].y+1}

    }else if(direction==="down"){
        head={x:snake[0].x+1,y:snake[0].y}

    }else if(direction==="up"){
        head={x:snake[0].x-1,y:snake[0].y}

    }

    const hitsSegment = snake.some(seg => seg.x === head.x && seg.y === head.y);
    if (hitsSegment){
        clearInterval(intervalId);
        clearInterval(timeIntervalId);

        modal.style.display="flex"
        startGameModal.style.display="none"
        restartGameModal.style.display="flex"


        return;

    }



// collision
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        clearInterval(timeIntervalId);

        modal.style.display="flex"
        startGameModal.style.display="none"
        restartGameModal.style.display="flex"


        return;
    }

// food consume
    if(food.x==head.x && food.y==head.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        Score+=10;
        scoreElement.innerText=Score;
        if(Score>highScore){
            highScore=Score
            localStorage.setItem("highscore",highScore.toString())
        }

    }

    //remove the fill class
    snake.forEach(element=>{
        blocks[`${element.x}-${element.y}`].classList.remove("fill");

    })

    snake.unshift(head) //add head to the start of snake
    snake.pop()

    snake.forEach(element => {
    blocks[`${element.x}-${element.y}`].classList.add("fill");
    })
}




//restart

function restartGame(){

    snake.forEach(element=>{
        blocks[`${element.x}-${element.y}`].classList.remove("fill");

    })
    modal.style.display="none"
    snake=[{x:1,y:3},]
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
    direction="right";
    Score=0;
    time=`00:00`;
    highScoreElement.innerText = highScore;

    scoreElement.innerText=Score;
    timeElement.innerHTML=time;
    intervalId=setInterval(()=>{
    
    render();

    },300)
    timeIntervalId=setInterval(()=>{
        let [min,sec]=time.split(":").map(Number)

        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1
        }
        const mm = String(min).padStart(2, "0");
        const ss = String(sec).padStart(2, "0");
        time = `${mm}:${ss}`;
        timeElement.innerText = time;

    },1000)

    


}

restart.addEventListener("click",restartGame)




//start
start.addEventListener("click",()=>{
    modal.style.display="none"

    intervalId=setInterval(()=>{
    
    render();

    },300)
    timeIntervalId=setInterval(()=>{
        let [min,sec]=time.split(":").map(Number)

        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1
        }
        const mm = String(min).padStart(2, "0");
        const ss = String(sec).padStart(2, "0");
        time = `${mm}:${ss}`;
        timeElement.innerText = time;

    },1000)


})


addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});
