// Set initial card list, variable card list for matches, and sectional selector variables
let cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-bicycle", "fa-leaf","fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-bicycle", "fa-leaf"];
let openCardList = [];

// Set reference variables variables
let movesPanel = document.querySelector('.moves');
let restartButton = document.querySelector('.restart');
const stars = document.querySelectorAll('.fa-star');
const winPanel = document.querySelector('.win-panel');
let endMoves = document.querySelector('.end-moves');
let endStars = document.querySelector('.end-stars');
let endTime = document.querySelector('.end-time');

// Set click and move counter variables to modify with functions
let moves = 0;
let solved = 0;
let locked = false;
let clickOne = null, clickTwo = null;
let elementOne = null, elementTwo = null;
let starsCount = 4;


// Set variables for game timer
let time = document.querySelector('.timer');
let startTime = 0;
let timeInt;



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

// Timer function inspired by https://stackoverflow.com/questions/20618355 and Laura Enria
function timer() {
  let mins = 0;
  let secs = 0;
  timeInt = setInterval(function () {
    secs = parseInt(secs, 10) + 1;
    mins = parseInt(mins, 10);
    if (secs >= 60) {
      mins += 1;
      secs = 0;
    }
    secs = secs < 10 ? "0" + secs : secs;
    mins = mins < 10 ? "0" + mins : mins;
    time.innerHTML = mins + ":" + secs;
  }, 1000);
}



// Add reveal elements to card function
function showCard(elem) {
  elem.classList.add("open");
  elem.classList.add("show");
}

// Flip unmatched cards back over
function unshowCard() {
  let elems = document.getElementsByClassName('unmatch');
  Array.from(elems).forEach(elem => {
    elem.classList.remove('unmatch');
    elem.classList.remove('show');
    elem.classList.remove('open');
  })
}


// Remove stars dependent on number of moves
function hideStars() {
  if (moves === 12) {
    stars[0].classList.add('hidden');
    starsCount--;
    return true;
  } else if (moves === 16) {
    stars[1].classList.add('hidden');
    starsCount--;
  } else if (moves === 20) {
    stars[2].classList.add('hidden');
    starsCount--;
  }
}

// Return stars after being hidden
function showStars() {
  for (let i = 0; i < 3; i++) {
    stars[i].classList.remove('hidden');
  }
}

// Incremental moves counter
function movesCounter() {
  moves++;
  movesPanel.innerHTML = moves;
  if (moves <= 20 && moves !== 0) {
    hideStars()
  }
}

// Clear clickOne and clickTwo variables
function clearClick() {
  clickOne = null;
  clickTwo = null;
}

// End of game function
function gameEnd() {
  clearInterval(timeInt);
}

// Reset variables function
function restartGame() {
  moves = 0;
  movesPanel.innerHTML = 0;
  solved = 0;
  elementOne = 0;
  elementTwo = 0;
  startTime = 0;
  starsCount = 4;
  showStars();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const newCard = cardClass => {
  let li = document.createElement('li');
  li.classList.add('card');
  let icon = document.createElement('i');
  li.appendChild(icon);
  icon.classList.add('fa');
  icon.classList.add(cardClass);
  return li;
};

const pickCard = card => {
  card.addEventListener('click',function(e) {
    if (startTime === 0) {
      timer();
      startTime++;
    }

  let li = e.currentTarget;
  if (locked || li.classList.contains('open') && li.classList.contains('show')) {
    return true;
  }
  let icon = li.getElementsByClassName('fa')[0].className;
  if(clickOne === null && clickTwo === null) {
    clickOne = icon;
    elementOne = li;
  } else if (clickOne !== null && clickTwo === null) {
    clickTwo = icon;
    elementTwo = li;
    movesCounter();
    if (clickOne === clickTwo) {
      elementOne.classList.add('match');
      elementOne.classList.add('true');
      elementTwo.classList.add('match');
      elementTwo.classList.add('true');
      solved++;
      if (solved === 8) {
        gameEnd();
        endMoves.innerHTML = moves;
        endTime.innerHTML = time.innerHTML;
        endStars.innerHTML = starsCount;
        winPanel.classList.remove('hidden');

      }
    } else {
      elementOne.classList.add('unmatch');
      elementTwo.classList.add('unmatch');
      setTimeout(function () {
        unshowCard()
      }, 600)
    }
    clearClick();
//    movesCounter();
  }
  showCard(li);
  })
};

function gameStart() {
  restartGame();
  clearClick();
  gameEnd();
  winPanel.classList.add('hidden');
  time.innerHTML = '00:00';
  let list = document.getElementsByClassName('deck');
  list[0].innerHTML = '';
  let cardsShuffled = shuffle(cardList);
  for (let card of cardsShuffled) {
    let li = newCard(card);
    list[0].appendChild(li);
  }
  let cards = list[0].getElementsByClassName('card');
  for (let card of cards) {
    pickCard(card);
  }
}

//Run gameStart function on page load
gameStart();


//Event listener for restart

restartButton.addEventListener('click', function () {
  gameStart()
});
