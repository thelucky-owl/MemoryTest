//voice is google wave net nl-d
const ogWordList = [
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
let wordList = [...ogWordList];
let solvedPlayer1 = [];
let solvedPlayer2 = [];
let scorePlayer1= 0 ;
let scorePlayer2= 0 ;
const numberOfCards = 8;
let pickedCards = [];
let revealedCards = 0;
let selectedCard = null;
let playerTurn = false;
let awaitingEndOfTurn = false;
let pickedCardsDouble;
let offFieldCardsDouble;
let solvedCards = 0;

//select random words from wordList
pickRandomWords();


//get html elements
const body = document.getElementById('body');
const stockCards = document.getElementById('off-field-cards');
const cardsContainer = document.getElementById('playfield');
const player1Html  = document.getElementById('player-1');
const player2Html  = document.getElementById('player-2');
const restartBtn = document.getElementById('restart-button');
const arrow = document.getElementById('arrow');
const solvedCardPopup = document.getElementById('solved-popup');
const player1Ui = document.getElementById('player-1-solved');
const player2Ui = document.getElementById('player-2-solved');
const animationCard1 = document.getElementById('animation-card-1');
const animationCard2 = document.getElementById('animation-card-2');

//add event listeners and classes to memorycards and player
restartBtn.addEventListener('click',restartGame);
solvedCardPopup.classList.add('card');
body.addEventListener('click', (e)=> globalClickHandler(e));
player1Ui.classList.add('your-turn');
//create cards
fillPlayfield();
//add the number of cards that can still be added
stockCards.children[0].textContent = offFieldCardsDouble.length;

function fillPlayfield(){
    //create cards then append them
    for (let card = 0; card < pickedCardsDouble.length; card++) {
        //create a new card
        createNewCard(cardsContainer,pickedCardsDouble[card].sound,pickedCardsDouble[card].picture,pickedCardsDouble[card].name);
    };

}
function globalClickHandler(clickedElement){
    console.log(clickedElement)
    //check if the clicked element has the card class
    if(clickedElement.target.classList.contains('card')){
    let card = clickedElement.target;
    //check if a turn is already happening
    if(awaitingEndOfTurn){
        return;
    }
    //play the audio element of the clicked card
    let sound = card.children[1];
    sound.play();
    //on click make content visible
    card.firstChild.classList.remove('invisible');
    card.lastChild.classList.remove('invisible');
    card.firstChild.classList.add('visible');
    card.lastChild.classList.add('visible');
    //check if there is a selected card, if not the clicked card becomes the selected card
    if(!selectedCard){
        selectedCard = card;
        return;
    };
    //check if card is already solved
    if(selectedCard.classList.contains('correct') || card.classList.contains('correct')){
        awaitingEndOfTurn = true;
    setTimeout(()=>{
        awaitingEndOfTurn = false;
        selectedCard = null;
    },1000)
        return;
    };
    //check if cards match
    if( selectedCard.firstChild.textContent=== card.firstChild.textContent && selectedCard != card){
        //maybe delete this and instead use offFieldCardsdouble.length
        solvedCards++;
        //show that the set
        selectedCard.classList.add('correct');
        card.classList.add('correct');
        //delete card from pickedCardsDouble array, push to playerSolved array
        solvedCardToPlayerArray(card.textContent);
        awaitingEndOfTurn = true;
        //set solved cards invisible
        card.classList.remove('visible');
        selectedCard.classList.remove('visible');
        card.classList.add('invisible');
        selectedCard.classList.add('invisible');
        setChildrenInvisible(card);
        setChildrenInvisible(selectedCard);
        //show pop-up with the solved card
        showSolvedCard(selectedCard.firstChild.textContent,selectedCard.lastChild.src,sound,selectedCard,card);
        setTimeout(()=>{
            switch(playerTurn){
                case false:       
                    scorePlayer1++;
                    addCardToScore(document.getElementById('player-1-solved'),card.lastChild.src,card.firstChild.textContent,scorePlayer1);
                    replaceCard(card,selectedCard);
                    animationCard1.style.transform= 'scale(0.3)';
                    animationCard2.style.transform= 'scale(0.3)';
                    animationScoreCards(player1Ui);
                    setTimeout(()=>{
                        animationNewCards(selectedCard,animationCard1);
                        animationNewCards(card,animationCard2);
                    },1000);
                break;
                case true:
                    scorePlayer2++;
                    addCardToScore(document.getElementById('player-2-solved'),card.lastChild.src,card.firstChild.textContent,scorePlayer2);
                    replaceCard(card,selectedCard);
                    animationScoreCards(player2Ui);
                    setTimeout(()=>{
                        animationNewCards(selectedCard,animationCard1);
                        animationNewCards(card,animationCard2);
                    },1000);
                    break;
                    //reset the awaiting turn and selected card inside the animation new card
                };
        },3000);
        return;
    };
    awaitingEndOfTurn = true;
    selectedCard.classList.add('incorrect');
    card.classList.add('incorrect');
    setTimeout(()=>{
        playerTurn = !playerTurn;
        selectedCard.classList.remove('incorrect');
        for (const child of selectedCard.children) {
           child.classList.remove('visible');
           child.classList.add('invisible');
          };
        card.classList.remove('incorrect');
        for (const child of card.children) {
            child.classList.remove('visible');
            child.classList.add('invisible');
           };
    switch(playerTurn){
        case true:
            arrow.classList.remove('change-turn-left');
            arrow.classList.add('change-turn-right');
            player1Ui.classList.remove('your-turn');
            player2Ui.classList.add('your-turn');
        break;
        case false:
            arrow.classList.remove('change-turn-right');
            arrow.classList.add('change-turn-left');
            player2Ui.classList.remove('your-turn');
            player1Ui.classList.add('your-turn');
        break;
        };
        awaitingEndOfTurn = false;
        selectedCard = null;
    },1000);
    }
}
function createNewCard(parent,soundSrc,imgSrc,textSrc){
    //create new html element
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    const newSound = new Audio(soundSrc);
    //add image
    const newImg = document.createElement('img');
    newImg.src = imgSrc;
    newImg.classList.add('img');
    newImg.classList.add('invisible');
    //add text
    const newText = document.createElement('div');
    newText.innerText = textSrc;
    newText.classList.add('invisible');
    //append everything
    newCard.appendChild(newText);
    newCard.appendChild(newSound);
    newCard.appendChild(newImg);
    parent.appendChild(newCard);
}
function solvedCardToPlayerArray(solvedCard){
    //with a for loop, push solved card to the array of the player that solved it
    //and delete it from the pickedCardsDouble array
    for (let i = pickedCardsDouble.length -1; i >= 0; i--) {
        if(solvedCard === pickedCardsDouble[i].name){
            switch(playerTurn){
                case false:
                    solvedPlayer1.push(pickedCardsDouble[i]);
                    console.log(solvedPlayer1);
                break;
                case true:
                    solvedPlayer2.push(pickedCardsDouble[i]);
                    console.log(solvedPlayer2);
                break;
                }
                pickedCardsDouble.splice(i,1);
                };
    };
};
function replaceCard(card1,card2){
    //remove all the correct cards children
    while (card1.firstChild) {
        card1.removeChild(card1.lastChild);
    };
    while (card2.firstChild) {
        card2.removeChild(card2.lastChild);
    };
    if(offFieldCardsDouble.length<1){
        return;
    };
    card1.classList.remove('visible');
    card2.classList.remove('visible');
    card1.classList.add('invisible');
    card2.classList.add('invisible');
    
    card1.classList.remove('correct');
    card2.classList.remove('correct');

    //select a new card at random
    let randomIndex = Math.floor(Math.random()*offFieldCardsDouble.length);
    //new audio
    const newSound = new Audio(offFieldCardsDouble[randomIndex].sound);
    //add image
    const newImg = document.createElement('img');
    newImg.src = offFieldCardsDouble[randomIndex].picture;
    newImg.classList.add('img');
    newImg.classList.add('invisible');
    //add text
    const newText = document.createElement('div');
    newText.innerText = offFieldCardsDouble[randomIndex].name;
    newText.classList.add('invisible');
    //append everything
    card1.appendChild(newText);
    card1.appendChild(newSound);
    card1.appendChild(newImg);
    offFieldCardsDouble.splice(randomIndex, 1);
    console.log(offFieldCardsDouble,randomIndex);

    //repeat for the second card
    let randomIndex2 = Math.floor(Math.random()*offFieldCardsDouble.length);
    const newSound2 = new Audio(offFieldCardsDouble[randomIndex2].sound);
    //add image
    const newImg2 = document.createElement('img');
    newImg2.src = offFieldCardsDouble[randomIndex2].picture;
    newImg2.classList.add('img');
    newImg2.classList.add('invisible');
    //add text
    const newText2 = document.createElement('div');
    newText2.innerText = offFieldCardsDouble[randomIndex2].name;
    newText2.classList.add('invisible');
    //append everything
    card2.appendChild(newText2);
    card2.appendChild(newSound2);
    card2.appendChild(newImg2);
    offFieldCardsDouble.splice(randomIndex2, 1);
    stockCards.children[0].textContent = offFieldCardsDouble.length;
};
function addCardToScore(parentHtml,imgSrc,textSrc,playerScore){
    const parent = parentHtml;
    const newContainer =document.createElement('div');
    const newSolvedCard = document.createElement('div');
    const newSolvedImg = document.createElement('img');
    const newScoreNumber = document.createElement('div');

    //add classes
    newContainer.classList.add('solved-card-container');
    newScoreNumber.classList.add('solved-card-number');
    newSolvedCard.classList.add('card','solved');
    newSolvedImg.classList.add('img');
    //add src
    newScoreNumber.textContent = playerScore;
    newSolvedImg.src = imgSrc;
    const newSolvedText = document.createElement('div');
    newSolvedText.innerText = textSrc;
    //append
    newSolvedCard.appendChild(newSolvedText);
    newSolvedCard.appendChild(newSolvedImg);
    newContainer.appendChild(newSolvedCard);
    newContainer.appendChild(newScoreNumber);
    parent.appendChild(newContainer);
    //check if all cards have been solved and if so check which player solved the most
    if(solvedCards >=8){
    switch(true){
        case (solvedPlayer1.length>solvedPlayer2.length):        
            console.log('player 1 wins!');
        break;
        case (solvedPlayer1.length<solvedPlayer2.length):
            console.log('player 2 wins!');
            break;
        };
    };
};
//dont use this function during test
function restartGame(){
    //player 1 should start again
wordList =[...ogWordList];
pickedCards =[];
pickedCardsDouble = [];
deleteChilderen(player1Ui);
deleteChilderen(player2Ui);
deleteChilderen(cardsContainer);
pickRandomWords();
fillPlayfield();
}
function deleteChilderen(htmlElement){
  while (htmlElement.firstChild) {
    htmlElement.removeChild(htmlElement.firstChild);
    console.log("removed");
};
}
function pickRandomWords(){
    //pick random words
    for (let i = 0; i < numberOfCards/2; i++) {
        let randomIndex = Math.floor(Math.random()*wordList.length);
        const card = wordList[randomIndex];
        wordList.splice(randomIndex, 1);
        pickedCards.push(card);
    };
    //double the randomly selected words, then randomize their order
    pickedCardsDouble = [...pickedCards, ...pickedCards];
    pickedCardsDouble = pickedCardsDouble.sort((a, b) => 0.5 - Math.random());
    //double the rest of the words for later use
    offFieldCardsDouble=[...wordList,...wordList];
    offFieldCardsDouble = offFieldCardsDouble.sort((a, b) => 0.5 - Math.random());
}
function showSolvedCard(text,img,sound,correctCard1,correctCard2){
    const imageHtml = solvedCardPopup.children[solvedCardPopup.children.length-1];
    const textHtml = solvedCardPopup.children[0];
    const animationCardText1 = animationCard1.children[0];
    const animationCardText2 = animationCard2.children[0];
    const animationCardImg1 = animationCard1.children[animationCard1.children.length-1];
    const animationCardImg2 = animationCard2.children[animationCard2.children.length-1];

    animationCardText1.textContent = text;
    animationCardText2.textContent = text;
    animationCardImg1.src = img;
    animationCardImg2.src = img;
    animationCard1.classList.remove('invisible');
    animationCard2.classList.remove('invisible');
    
    animationCardImg1.classList.remove('invisible');
    animationCardImg2.classList.remove('invisible');
    animationCardText1.classList.remove('invisible');
    animationCardText2.classList.remove('invisible');

    setElementLocation(correctCard1,animationCard1,'0s',87);
    setElementLocation(correctCard2,animationCard2,'0s',87);
    correctCard1.classList.remove('visible');
    correctCard2.classList.remove('visible');
    correctCard1.classList.add('invisible');
    correctCard2.classList.add('invisible');
    setElementLocation(solvedCardPopup,animationCard1,'0.3s',87);
    setElementLocation(solvedCardPopup,animationCard2,'0.3s',87);
    setTimeout(()=>{
        textHtml.textContent = text;
        imageHtml.src = img;
        solvedCardPopup.classList.add('visible');
        solvedCardPopup.classList.remove('invisible');
        textHtml.classList.add('visible');
        textHtml.classList.remove('invisible');
        imageHtml.classList.add('visible');
        imageHtml.classList.remove('invisible'); 
        sound.play();
    },2000);
    setTimeout(()=>{
        imageHtml.classList.add('invisible');
        imageHtml.classList.remove('visible');
        textHtml.classList.add('invisible');
        textHtml.classList.remove('visible');
        solvedCardPopup.classList.remove('visible');
        solvedCardPopup.classList.add('invisible');
    },3000);
}
function setChildrenInvisible(parentElement){
   for (const child of parentElement.children) {
    child.classList.remove('visible');
    child.classList.add('invisible');
   };
}
function animationScoreCards(scoreElement){
    setElementLocation(solvedCardPopup,animationCard1,'0s',87);
    setElementLocation(solvedCardPopup,animationCard2,'0s',87);
    let xposition = (scoreElement.children[scoreElement.children.length-1].getBoundingClientRect().x - animationCard1.offsetLeft - animationCard1.offsetWidth/2);
    let yposition = (scoreElement.children[scoreElement.children.length-1].getBoundingClientRect().y - animationCard1.offsetTop - animationCard1.offsetHeight/2);
    xposition = xposition+87;
    yposition= yposition+87;
    animationCard1.style.transition='0.3s';
    animationCard1.style.height = '100px'
    animationCard1.style.width = '100px'
    animationCard1.style.transform = 'translate('+ xposition + 'px,' + yposition + 'px) ';
    animationCard2.style.transition=' 0.3s';
    animationCard2.style.height = '100px'
    animationCard2.style.width = '100px'
    animationCard2.style.transform = 'translate('+ xposition + 'px,' + yposition + 'px)';
}
function animationNewCards(clickedCard,animationCard){
    animationCard.style.height = '170px'
    animationCard.style.width = '170px'
    animationCard.children[0].classList.add('invisible');
    animationCard.children[1].classList.add('invisible');
    setElementLocation(stockCards,animationCard,'0s',87);
    animationCard.classList.remove('invisible');
    setElementLocation(clickedCard,animationCard,'0.3s',51);
    console.log(animationCard1)
    setTimeout(()=>{
        clickedCard.classList.remove('invisible');
        clickedCard.classList.add('visible');
    },1000);
    setTimeout(()=>{
        setElementLocation(stockCards,animationCard,'0s',87);
        awaitingEndOfTurn = false;
        selectedCard = null;
    },1000);
}

function setElementLocation(elementRef,elementToAnimate,transitionSpeed,offset){
    let xposition = (elementRef.getBoundingClientRect().x - elementToAnimate.offsetLeft - elementToAnimate.offsetWidth/2);
    let yposition = (elementRef.getBoundingClientRect().y - elementToAnimate.offsetTop - elementToAnimate.offsetHeight/2);
    xposition = xposition+offset;
    yposition= yposition+offset;
    elementToAnimate.style.transition=transitionSpeed;
    elementToAnimate.style.transform = 'translate('+ xposition + 'px,' + yposition + 'px)';
}