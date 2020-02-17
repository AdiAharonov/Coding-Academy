// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
let replay = document.getElementById('replay');
let popup = document.getElementById('popup');
var isProcessing = false;
// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;
var timeRunning = false;
var gameTime = 0;
// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');
// This function is called whenever the user click a card
function cardClicked(elCard) {
  // time running?

  if (!timeRunning) {
    runTimer();

    // we dont want to init this function for every click.
    timeRunning = true;
  }

  if (isProcessing === true) {
    return;
  }
  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains('flipped')) {
    return;
  }

  // Flip it
  elCard.classList.add('flipped');

  // This is a first card, only keep it in the global variable
  if (elPreviousCard === null) {
    elPreviousCard = elCard;
  } else {
    // get the data-card attribute's value from both cards
    var card1 = elPreviousCard.getAttribute('data-card');
    var card2 = elCard.getAttribute('data-card');

    // No match, schedule to flip them back in 1 second
    if (card1 !== card2) {
      isProcessing = true;
      setTimeout(function() {
        elCard.classList.remove('flipped');
        elPreviousCard.classList.remove('flipped');
        elPreviousCard = null;
        audioWrong.play();
        isProcessing = false;
      }, 1000);
    } else {
      // Yes! a match!
      flippedCouplesCount++;
      elPreviousCard = null;
      audioRight.play();

      // All cards flipped!
      if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {

        audioWin.play();
        clearTime();
        updateRecord();

        flippedCouplesCount = 0;
      }
    }
  }
}
function replayGame() {
  var divs = document.querySelectorAll('div');
  for (i = 0; i < divs.length; i++) {
    divs[i].classList.remove('flipped');
  }
  clearTime();
  updateTime(0);

}

replay.addEventListener('click', replayGame);

let userName = prompt('Enter Name: ');
let showName = document.getElementById('showName');
showName.innerText = userName;

localStorage.setItem('name', userName);
var name = localStorage.getItem('name');

function getUserName() {
  let currentUser = prompt('Enter name: ');
  showName.innerText = currentUser;
}

let changeUserBtn = document.getElementById('changeUser');
changeUserBtn.addEventListener('click', getUserName);

// var card = document.querySelectorAll('card');
// let card = document.getElementById('card');
// card.onclick = timer;

var h2 = document.getElementsByTagName('h2')[0];
// seconds = 0, minutes = 0, hours = 0,
// t;

let timeCallback, now;

function runTimer() {
  let clickedDate = new Date();
  gameTime = 0;

  timeCallback = setInterval(() => {
    const now = new Date();
    gameTime = now.getTime() - clickedDate.getTime();
    updateTime(gameTime);
  }, 1000);
}

function parseTime(millisec) {
    const hours = Math.floor((millisec / (1000 * 60 * 60)));
    const minutes = Math.floor((millisec / (1000 * 60)) - (hours * 60));
    const seconds =  Math.floor((millisec / 1000)) - (60 * minutes);


    return {
        hours,
        minutes,
        seconds
    }
}

function updateTime(millisec) {
    
    const time = parseTime(millisec);

    const hours = time.hours;
    const minutes = time.minutes;
    const seconds = time.seconds;

  h2.textContent =
    (hours ? (hours > 9 ? hours : '0' + hours) : '00') +
    ':' +
    (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
    ':' +
    (seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00');
}

function clearTime() {

  if (timeCallback) {
    clearInterval(timeCallback);

    timeRunning = false;
  }
}

let resetBtn = document.getElementById('reset');

function resetGame() {
  var cards = document.querySelectorAll('div');
  for (i = 0; i < cards.length; i++) {
    cards[i].classList.remove('flipped');
  }
}

resetBtn.addEventListener('click', resetGame);

let revelBtn = document.getElementById('revel');

function revelCards() {
  var cards = document.querySelectorAll('div');
  for (i = 0; i < cards.length; i++) {
    cards[i].classList.add('flipped');
  }
}
revelBtn.addEventListener('click', changeBtn);

function changeBtn() {
  if (revelBtn.innerText == 'Revel') {
    revelCards();
    revelBtn.innerText = 'Hide';
  } else {
    resetGame();
    revelBtn.innerText = 'Revel';
  }
}


function updateRecord() {

    const record = localStorage.getItem('record');

    if (record) {

        const recordTime = +record;


        if (gameTime < recordTime) {
            localStorage.setItem('record',gameTime);
            showPopup(gameTime)
        }


    } else {
        localStorage.setItem('record',gameTime);
        showPopup(gameTime)
    }
}

function showPopup(recordTime) {
    popup.style.display = 'flex';
    const time = parseTime(recordTime);

    document.getElementById('record-time').innerText = `${time.hours}:${time.minutes}:${time.seconds}`

    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}

