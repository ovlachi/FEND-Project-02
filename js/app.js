/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



 /*Global variables*/
const deck = document.querySelector(".deck")
let openCards = []
const cardsToShuffle = Array.from(document.querySelectorAll(".card"))
let moves = 0
let clockStop = true
let time = 0
let timeCounter
let matched = 0
const totalMachedPairs = 8

/*Function to show Modal!*/
function modalResults() {
    const timeTest = document.querySelector(".modal__time")
    const clockTime = document.querySelector(".clock").textContent
    const movesTest = document.querySelector(".modal__moves")
    const starsTest = document.querySelector(".modal__stars")
    const stars = getStars()

    //textContent uses straight text, does not parse HTML, and is faster then inner.HTML
    timeTest.textContent = `Time = ${clockTime}`
    movesTest.textContent = `Moves = ${moves}`
    starsTest.textContent = `Stars = ${stars}`
}

function getStars() {
    stars = document.querySelectorAll(".stars li")
    starCount = 0
    for (star of stars) {
        if (star.style.display !== "none") {
            starCount++
        }       
        //console.log(starCount)
    }
    return starCount 
}

/*Close Modal */
document.querySelector(".modal__close").addEventListener("click", function () {
    toggleModal()
})

/*Play again */
document.querySelector(".modal__replay").addEventListener("click", replayGame)

function replayGame () {
    resetGame()
    toggleModal()
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*Shuffling the cards with the provided shuffle function: The elements I want to be shuffled are the “li”s inside the deck element*/
function shuffleTheDeck() {
   const shuffledCards = shuffle(cardsToShuffle)
   for (card of shuffledCards) {
       deck.appendChild(card)
   }
}
shuffleTheDeck()

/*Setting up a “click” event listener for the cards: with Event delegation on the parent element (deck)  */
deck.addEventListener("click", function() {
    const clickCard = event.target
    
    if (clickValid (clickCard)) {
        if (clockStop) {
            startTimer()
            clockStop = false
        }
        flippCards (clickCard)
        addOpenCards(clickCard)
        if (openCards.length === 2) {
        checkMatching(clickCard)
        addMoves()
        checkScore()
        }
    } 
})

/*Function to validate the click*/
function clickValid (clickCard) {
    return (
        clickCard.classList.contains("card") && 
        !clickCard.classList.contains("match") &&
        openCards.length < 2 && 
        !openCards.includes(clickCard))
}
    
/*Function to flipp over the cards*/
function flippCards (clickCard) {
        clickCard.classList.toggle("open")
        clickCard.classList.toggle("show")
}
       
/*Function to add the clicked open cards to the openCards array*/
function addOpenCards () {
    const clickCard = event.target
    openCards.push(clickCard)
    //console.log("openCards")
}

/*Function to check if the two cards are matching*/
function checkMatching (clickCard) {
    if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
        openCards[0].classList.toggle("bounce") //bounce effect if success
		openCards[1].classList.toggle("bounce") 
        openCards[0].classList.toggle("match")
        openCards[1].classList.toggle("match")
        openCards = []
        matched++
        setTimeout(function() {
			win();
		}, 700)
         } else {
            setTimeout (() => {
                flippCards(openCards[0])
                flippCards(openCards[1])
                openCards = []
            }, 800)
        }
}

/* Function to handle the “moves” counter */
function addMoves() {
moves++
const movesText = document.querySelector(".moves")
movesText.innerText = moves
}

/*Function to check Score */
function checkScore() {
    if (moves === 12 || moves === 24)
    { reduceStars() 
    }
}

/*Function to reduce the number of Stars */
function reduceStars() {
    const starsList = document.querySelectorAll(".stars li")
    for (star of starsList) {
      if (star.style.display !== "none") {
          star.style.display = "none"
          break
      }
    }
}

/*Function to start the Timer */
function startTimer() {
      timeCounter = setInterval(function(){
      time++
      displayTimer()
      console.log(time)
    }, 1000);
}

/*Function to stop the Timer */
function stopTimer() {
    clearInterval(timeCounter)
}

/*Function to display Timer in the browser*/
function displayTimer() {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    const clock = document.querySelector(".clock")
    console.log(clock)
    clock.innerHTML = time
    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    }  else {
        clock.innerHTML = `${minutes}:${seconds}`;
 }  
}

/*Function to Toggle the modal on and off */
function toggleModal() {
    const modal = document.querySelector(".modal")
    modal.classList.toggle("hide")
}
toggleModal() //open modal
toggleModal() //close modal

/*Function to reset the Game */
function resetGame () {
    resetTimerAndClock ()
    resetMoves()
    resetStars()
    resetCards()
    shuffleTheDeck()
}

/*Function to reset the Timer and Clock- add to resetGame*/
function resetTimerAndClock () {
    stopTimer()
    clockStop = true
    time = 0
    displayTimer()
}

/*Function to reset Moves- add to resetGame*/
function resetMoves () {
    moves = 0
    document.querySelector(".moves").textContent = moves
}

/*Function to reset Stars- resetGame*/
function resetStars () {
    const starsList = document.querySelectorAll(".stars li")
    for (star of starsList) {
        star.style.display = "inline"
    }
}

/*Add event listener to the restart button*/
document.querySelector(".restart").addEventListener("click", resetGame)


/* Function to check gameOver and show the modal*/
// Checking for win condition
function win() {
	if(matched === totalMachedPairs) {
		gameOver();
	}
}

function gameOver () {
    stopTimer()
    modalResults()
    toggleModal()
    resetCards()
}

/* Function that resets the cards*/
function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}
}






/* ORIGINAL UDACITY COMMENTS
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one) DONE!
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
