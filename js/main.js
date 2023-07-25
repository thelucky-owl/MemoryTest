// import { wordList } from "../data/audio/"
//voice is google wave net nl-d
const wordList = [
    {
        name:"Juf",
        picture:"data/imgs/femaleTeacher.png",
        sound:"data/audio/juf.mp3"
    },
    {
        name:"School",
        picture:"data/imgs/school.png",
        sound:"data/audio/school.mp3"
    },
    {
        name:"Kist",
        picture:"data/imgs/chest.png",
        sound:"data/audio/kist.mp3"
    },
    {
        name:"Kleed",
        picture:"data/imgs/rug.png",
        sound:"data/audio/kleed.mp3"
    },
    {
        name:"Meester",
        picture:"data/imgs/teacherMale.png",
        sound:"data/audio/meester.mp3"
    },
    {
        name:"Stoel",
        picture:"data/imgs/chair.png",
        sound:"data/audio/stoel.mp3"
    },
    {
        name:"Lokaal",
        picture:"data/imgs/classroom.jpg",
        sound:"data/audio/lokaal.mp3"
    },
    {
        name:"Deur",
        picture:"data/imgs/door.png",
        sound:"data/audio/deur.mp3"
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
    //add audio
    let sound = new Audio(pickedCardsDouble[card].data.sound)
    //add image
    const newImg = document.createElement("img");
    newImg.src = pickedCardsDouble[card].data.picture;
    newImg.classList.add("img")
    newImg.classList.add("invisible")
    //add text
    const newText = document.createElement("div");
    newText.innerText = pickedCardsDouble[card].data.name;
    newText.classList.add("invisible")
    newCard.appendChild(newText);
    //add a clickhandler
    newCard.addEventListener("click", ()=>{
        sound.play();
        //check if a turn is already happening
        if(awaitingEndOfTurn){
            return;
        }
        //on click add show word in html
        // newCard.innerText = pickedCardsDouble[card].data.name;
        newText.classList.remove("invisible");
        newImg.classList.remove("invisible");
        newText.classList.add("visible");
        newImg.classList.add("visible");
        if(!selectedCard){
            selectedCard = newCard;
            return;
        };
        if( selectedCard.innerText=== newCard.innerText && selectedCard != newCard){
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
            selectedCard.classList.remove("incorrect");
            for (const child of selectedCard.children) {
               child.classList.remove("visible");
               child.classList.add("invisible");
              }
            newCard.classList.remove("incorrect");
            newText.classList.remove("visible");
            newImg.classList.remove("visible");
            newText.classList.add("invisible");
        newImg.classList.add("invisible");
            awaitingEndOfTurn = false;
            selectedCard = null;
        },1000)
    });
    newCard.appendChild(newImg);
    cardsContainer.appendChild(newCard);
};

