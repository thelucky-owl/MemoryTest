// import { wordList } from "../data/wordList"
const wordList = [
    {
        name:"hond",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"kat",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"paard",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"vis",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"fiets",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"motor",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"auto",
        picture:"empty",
        sound:"empty"
    },
    {
        name:"boot",
        picture:"empty",
        sound:"empty"
    },
];
const numberOfCards = 6;
const cardsContainer = document.getElementById("playfield");
let cardList = [];
let pickedCards = [];
let revealedCards = 0;
let selectedCard = null;
let awaitingEndOfTurn = false;

//push words into new object array
for (let i = 0; i < wordList.length; i++) {
    cardList.push({data:wordList[i],solved:false});
};


for (let i = 0; i < numberOfCards/2; i++) {
    const randomIndex = Math.floor(Math.random()*cardList.length);
    const card = cardList[randomIndex];
    cardList.splice(randomIndex, 1);
    pickedCards.push(card);
};
//make a matching value in the array, then randomize order
let pickedCardsDouble = [...pickedCards, ...pickedCards];
pickedCardsDouble = pickedCardsDouble.sort((a, b) => 0.5 - Math.random());

//create cards then append them
for (let card = 0; card < pickedCardsDouble.length; card++) {
    //create a new card
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    //add a clickhandler
    newCard.addEventListener("click", ()=>{
        //check if a turn is already happening
        if(awaitingEndOfTurn){
            return;
        }
        //on click add show word in html
        newCard.innerText = pickedCardsDouble[card].data.name;
        if(!selectedCard){
            selectedCard = newCard;
            return;
        };
        const match = selectedCard.innerText;
        if(match === newCard.innerText){
            console.log("yippie!");
            selectedCard.classList.add("correct");
            newCard.classList.add("correct");
            selectedCard = null;
            return;
        }
        awaitingEndOfTurn = true;
        selectedCard.classList.add("incorrect");
        newCard.classList.add("incorrect");
        setTimeout(()=>{
            newCard.innerText = null;
            selectedCard.innerText = null;
            selectedCard.classList.remove("incorrect");
            newCard.classList.remove("incorrect");
            awaitingEndOfTurn = false;
            selectedCard = null;
        },1000)
    });
    cardsContainer.appendChild(newCard);
};

