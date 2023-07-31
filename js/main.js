// import { wordList } from "../data/audio/"
//voice is google wave net nl-d
const wordList = [
    {
        name:"Juf",
        picture:"data/imgs/femaleTeacher.png",
        sound:"data/audio/juf.mp3",
        solved:false 
    },
    {
        name:"School",
        picture:"data/imgs/school.png",
        sound:"data/audio/school.mp3",
        solved:false 
    },
    {
        name:"Kist",
        picture:"data/imgs/chest.png",
        sound:"data/audio/kist.mp3",
        solved:false 
    },
    {
        name:"Kleed",
        picture:"data/imgs/rug.png",
        sound:"data/audio/kleed.mp3",
        solved:false 
    },
    {
        name:"Meester",
        picture:"data/imgs/teacherMale.png",
        sound:"data/audio/meester.mp3",
        solved:false 
    },
    {
        name:"Stoel",
        picture:"data/imgs/chair.png",
        sound:"data/audio/stoel.mp3",
        solved:false 
    },
    {
        name:"Lokaal",
        picture:"data/imgs/classroom.png",
        sound:"data/audio/lokaal.mp3",
        solved:false 
    },
    {
        name:"Deur",
        picture:"data/imgs/door.png",
        sound:"data/audio/deur.mp3",
        solved:false 
    },
];
let solvedPlayer1 = []
let solvedPlayer2 = []
const numberOfCards = 8;
const cardsContainer = document.getElementById("playfield");
let pickedCards = [];
let revealedCards = 0;
let selectedCard = null;
let playerTurn = false
let awaitingEndOfTurn = false;


for (let i = 0; i < numberOfCards/2; i++) {
    let randomIndex = Math.floor(Math.random()*wordList.length)
    const card = wordList[randomIndex];
    wordList.splice(randomIndex, 1);
    pickedCards.push(card);
    console.log(randomIndex)
};
//make a matching value in the array, then randomize order
let pickedCardsDouble = [...pickedCards, ...pickedCards];
pickedCardsDouble = pickedCardsDouble.sort((a, b) => 0.5 - Math.random());
//get player html elements
const player1Html  = document.getElementById("player-1");
const player2Html  = document.getElementById("player-2");
player1Html.classList.add("turn")

const player1Ui = document.getElementById("player-1-solved")
const player2Ui = document.getElementById("player-2-solved")

//create cards then append them
for (let card = 0; card < pickedCardsDouble.length; card++) {
    createNewCard(cardsContainer,pickedCardsDouble[card].sound,pickedCardsDouble[card].picture,pickedCardsDouble[card].name);
    //create a new card
    // const newCard = document.createElement("div");
    // newCard.classList.add("card");
    // //add audio
    // const newSound = new Audio(pickedCardsDouble[card].sound)
    // //add image
    // const newImg = document.createElement("img");
    // newImg.src = pickedCardsDouble[card].picture;
    // newImg.classList.add("img")
    // newImg.classList.add("invisible")
    // //add text
    // const newText = document.createElement("div");
    // newText.innerText = pickedCardsDouble[card].name;
    // newText.classList.add("invisible")
    // newCard.appendChild(newText);
    // newCard.appendChild(newImg);
    // cardsContainer.appendChild(newCard);
    // //add a clickhandler
    // newCard.addEventListener("click", ()=> clickhandler(newCard,newImg,newText,newSound));
};
console.log(pickedCards)
function clickhandler(card,img,text,sound){

    sound.play();
    //check if a turn is already happening
    if(awaitingEndOfTurn){
        return;
    }

    //on click add show word in html
    // newCard.innerText = pickedCardsDouble[card].name;
    text.classList.remove("invisible");
    img.classList.remove("invisible");
    text.classList.add("visible");
    img.classList.add("visible");
    if(!selectedCard){
        selectedCard = card;
        return;
    };
    if( selectedCard.innerText=== card.innerText && selectedCard != card){
        selectedCard.classList.add("correct");
        card.classList.add("correct");
        console.log(pickedCardsDouble)
        console.log(playerTurn);
        findSolvedCard(card.innerText);
        switch(playerTurn){
            case false:        
                    replaceCard(card,selectedCard);
                    addCardToScore(img.src,text.innerText);

                    // player1Ui.appendChild(card);
                    // selectedCard.remove();
                break;
            case true:
                    console.log("player2")
                    replaceCard(card,selectedCard);
                    // player2Ui.appendChild(card);
                    // selectedCard.remove();
                break;
            };
                //add new cards
        selectedCard = null;
        return;
    }
    awaitingEndOfTurn = true;
    selectedCard.classList.add("incorrect");
    card.classList.add("incorrect");
    setTimeout(()=>{
        playerTurn = !playerTurn
        selectedCard.classList.remove("incorrect");
        for (const child of selectedCard.children) {
           child.classList.remove("visible");
           child.classList.add("invisible");
          }
        card.classList.remove("incorrect");
        text.classList.remove("visible");
        img.classList.remove("visible");
        text.classList.add("invisible");
    img.classList.add("invisible");
    switch(playerTurn){
        case true:
            player1Html.classList.remove("turn");
            player2Html.classList.add("turn");
        break;
        case false:
            player2Html.classList.remove("turn");
            player1Html.classList.add("turn");
        break;
        }
        awaitingEndOfTurn = false;
        selectedCard = null;
    },1000)
}
function createNewCard(parent,soundSrc,imgSrc,textSrc){
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    const newSound = new Audio(soundSrc)
    //add image
    const newImg = document.createElement("img");
    newImg.src = imgSrc;
    newImg.classList.add("img");
    newImg.classList.add("invisible");
    //add text
    const newText = document.createElement("div");
    newText.innerText = textSrc;
    newText.classList.add("invisible");
    newCard.appendChild(newText);
    newCard.appendChild(newImg);
    parent.appendChild(newCard);
    newCard.addEventListener("click", ()=> clickhandler(newCard,newImg,newText,newSound));
}
function findSolvedCard(solvedCard){
    for (let i = pickedCardsDouble.length -1; i >= 0; i--) {
        if(solvedCard === pickedCardsDouble[i].name){
            switch(playerTurn){
                case false:
                    solvedPlayer1.push(pickedCardsDouble[i])
                    console.log(solvedPlayer1)

                break;
                case true:
                    solvedPlayer2.push(pickedCardsDouble[i])
                    console.log(solvedPlayer2)
                break;
                }
                pickedCardsDouble.splice(i,1) 
                }
    }
}
function replaceCard(card1,card2){
    while (card1.firstChild) {
        card1.removeChild(card1.lastChild);
      }
      while (card2.firstChild) {
        card2.removeChild(card2.lastChild);
      }
}
function addCardToScore(imgSrc,textSrc){
    const parent = document.getElementById("player-1-solved");
    const newSolvedCard = document.createElement("div");
    newSolvedCard.classList.add("card","solved");
    const newSolvedImg = document.createElement("img");
    newSolvedImg.src = imgSrc;
    newSolvedImg.classList.add("img")
    const newSolvedText = document.createElement("div");
    newSolvedText.innerText = textSrc;
    parent.appendChild(newSolvedCard)
    newSolvedCard.appendChild(newSolvedText);
    newSolvedCard.appendChild(newSolvedImg);
    // lastSolvedCard.classList.remove("invisible");
}
function pickRandom(array){
    let randomIndex = Math.floor(Math.random()*array.length);
    return randomIndex
}
