// Set initial card list, variable card list for matches, and sectional selector variables
let cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-bicycle", "fa-leaf","fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-bicycle", "fa-leaf"];

// Set reference variables variables
let movesPanel = document.querySelector('.moves');
let restartButton = document.querySelector('.restart');
let time = document.querySelector('.timer');
const stars = document.querySelectorAll('.fa-star');
const winPanel = document.querySelector('.win-panel');
const closeWinPanel = document.querySelector('.fa-close');
let endMoves = document.querySelector('.end-moves');
let endStars = document.querySelector('.end-stars');
let endTime = document.querySelector('.end-time');

// Set click, timer, and move counter variables to modify with functions
let moves = 0;
let solved = 0;
let locked = false;
let clickOne = null;
let clickTwo = null;
let elementOne = null;
let elementTwo = null;
let starsCount = 4;
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

// Timer function inspired by https://stackoverflow.com/questions/20618355 by robbmj
function timer() {
  let mins = 0;
  let secs = 0;
  let decis = 0;
// Sets time interval to act at 1/10th of every second after starting
  timeInt = setInterval(function () {
    decis = parseInt(decis) +1;
    secs = parseInt(secs);
    mins = parseInt(mins);
// Converts 10 deciseconds into one second, turns 60 seconds into one minute
    if (decis >= 10) {
      secs += 1;
      decis = 0;
    }
    if (secs >= 60) {
      mins += 1;
      secs = 0;
    }
// Keeps characters of timer in place despite single digit values
    secs = secs < 10 ? "0" + secs : secs;
    mins = mins < 10 ? "0" + mins : mins;
    time.innerHTML = mins + ":" + secs + "." + decis;
  }, 100);
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

// Remove stars and reduce stars count dependent on number of moves
function hideStars() {
  if (moves === 16) {
    stars[0].classList.add('hidden');
    starsCount--;
    return true;
  } else if (moves === 20) {
    stars[1].classList.add('hidden');
    starsCount--;
  } else if (moves === 24) {
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

// Incremental moves counter and conditions for hideStars function
function movesCounter() {
  moves++;
  movesPanel.innerHTML = moves;
  if (moves <= 24 && moves !== 0) {
    hideStars()
  }
}

// Clear clickOne and clickTwo variables
function clearClick() {
  clickOne = null;
  clickTwo = null;
}

// Clear timer interval
function gameEnd() {
  clearInterval(timeInt);
}

// Show and hide the win panel
function winPanelShow() {
  winPanel.classList.remove('hidden');
}

function winPanelHide() {
  winPanel.classList.add('hidden');
}

// Reset game variables
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

// Assign card class to new card elements by adding class to html
const newCard = cardClass => {
  let li = document.createElement('li');
  li.classList.add('card');
  let icon = document.createElement('i');
  li.appendChild(icon);
  icon.classList.add('fa');
  icon.classList.add(cardClass);
  return li;
};

// Interaction with cards, including starting the timer, counting moves, and win conditions
const pickCard = card => {
  card.addEventListener('click',function(e) {
    if (startTime === 0) {
      timer();
      startTime++;
    }
  let li = e.currentTarget;
// Prevents from interacting with cards that are already flipped over
  if (locked || li.classList.contains('open') && li.classList.contains('show')) {
    return true;
  }
  let icon = li.getElementsByClassName('fa')[0].className;
// If neither click has a value, assign the clicked value
  if(clickOne === null && clickTwo === null) {
    clickOne = icon;
    elementOne = li;
// If the first click has a value, assign the next click the second value
  } else if (clickOne !== null && clickTwo === null) {
    clickTwo = icon;
    elementTwo = li;
    movesCounter();
// If the className of clickOne's value matches the className of clickTwo's value then match cards
    if (clickOne === clickTwo) {
      elementOne.classList.add('match');
      elementTwo.classList.add('match');
      solved++;
/*
 * Once 8 matches are counted, the timer interval is cleared,
 * the end of game variables for time, moves, and stars captured,
 * and the win panel is revealed.
 */
      if (solved === 8) {
        gameEnd();
        endMoves.innerHTML = moves;
        endTime.innerHTML = time.innerHTML;
        endStars.innerHTML = starsCount;
        winPanelShow();
      }
    } else {
// Adds unmatch class to indicate mismatch prior to returning card to unshown state
      elementOne.classList.add('unmatch');
      elementTwo.classList.add('unmatch');
      setTimeout(function () {
        unshowCard()
      }, 600)
    }
    clearClick();
  }
  showCard(li);
  })
};

// Clears variables and intervals before shuffling cards and ensuring win panel is hidden
function gameStart() {
  restartGame();
  clearClick();
  gameEnd();
  winPanel.classList.add('hidden');
  time.innerHTML = '00:00.0';
// Select the deck and clear all existing cards
  let list = document.getElementsByClassName('deck');
  list[0].innerHTML = '';
// Applies the supplied random shuffle function from http://stackoverflow.com/a/2450976
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

// Run gameStart function on page load
gameStart();

// Event listener for restart
restartButton.addEventListener('click', function () {
  gameStart()
});

// Close the win panel
closeWinPanel.addEventListener('click', function () {
  winPanelHide()
});
