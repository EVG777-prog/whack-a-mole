// const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelectorAll('.score');
// const moles = document.querySelectorAll('.mole');
const game = document.querySelector('.game');
const audioChangeDifficulty = document.querySelector('#audio-change-difficulty');
const audioResetTopScore = document.querySelector('#audio-reset-top-score');
const bonk = document.querySelector('#bonk');
const win = document.querySelector('#win');
const lose = document.querySelector('#lose');
const start = document.querySelector('#start');

let moles, holes, dateStart, dateEnd, timerInfo, sec, milSec, nanoSec, timerS, gameTime;
let timePlay, timeEnd = false,
    lastHole = -1,
    hole = -1,
    counter = 0,
    lastBonk = -1,
    difficulty = 'EASY';

const topScores = {
    'EASY': 'topScoreEasy',
    'MEDIUM': 'topScoreMedium',
    'HARD': 'topScoreHard'
}

localStorage.setItem('EASY', 0);
localStorage.setItem('MEDIUM', 0);
localStorage.setItem('HARD', 0);
document.querySelectorAll('.score')[0].textContent = localStorage.getItem(topScores[difficulty]);

showHoles();


function randomTime(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function play() {


    do {
        hole = holes[Math.floor(holes.length * Math.random())];
    } while (lastHole == hole)
    lastHole = hole;
    const time = randomTime(300, 1000);
    // console.log(`Добавляем up - ${hole.classList}`);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeEnd) play();
    }, time);

}

function startAudio() {
    start.play();
    setTimeout(startGame, 5000);
}

function startGame() {
    clearTimeout(gameTime);
    dateStart = new Date();
    document.querySelector('#timer-table').style.color = 'black';
    console.log(`dateStart = ${dateStart}`);
    timer();
    timeEnd = false;
    counter = 0;
    showHoles();
    document.querySelectorAll('.score')[1].textContent = counter;

    holes = document.querySelectorAll('.hole');

    moles = document.querySelectorAll('.mole');
    moles.forEach(el => el.addEventListener('click', (elem) => {
        if (elem.isTrusted && lastBonk != el && !timeEnd) {
            bonk.currentTime = 0;
            bonk.play();
            counter++;
            lastBonk == el;
        }
        console.log(`Удаляем up - ${el.parentNode.classList}`);
        el.parentNode.classList.remove('up');

        document.querySelectorAll('.score')[1].textContent = counter;
    }))

    gameTime = setTimeout(() => {
        timeEnd = true;
        clearInterval(timerS);
        document.querySelector('#timer-table').textContent = '00:00';
        console.log('End Game!');
        console.log(`Your final score is ${counter}!`);
        if (localStorage.getItem(topScores[difficulty]) < counter) {
            win.play();
            localStorage.setItem(topScores[difficulty], counter);
        } else {
            lose.play();
        }
        document.querySelectorAll('.score')[0].textContent = localStorage.getItem(topScores[difficulty]);
    }, 10000);
    play();
}


// moles.forEach(el => el.addEventListener('click', (elem) => {
//     if (elem.isTrusted && lastBonk != el && !timeEnd) {
//         counter++;
//         lastBonk == el;
//     }
//     console.log(`Удаляем up - ${el.parentNode.classList}`);
//     el.parentNode.classList.remove('up');

//     document.querySelectorAll('.score')[1].textContent = counter;
// }))

document.querySelector('#btn-reset').addEventListener('click', () => {
    timeEnd = true;
    document.querySelector('#timer-table').style.color = 'black';
    clearTimeout(gameTime);
    clearInterval(timerS);
    document.querySelector('#timer-table').textContent = '10:00';
    counter = 0;
    document.querySelectorAll('.score')[1].textContent = counter;
    audioResetTopScore.currentTime = 0;
    audioResetTopScore.play();
    localStorage.setItem(topScores[difficulty], 0);
    document.querySelectorAll('.score')[0].textContent = localStorage.getItem('topScore');
});

document.querySelector('#btn-start').addEventListener('click', startAudio);

document.querySelectorAll(`input[type="radio"]`).forEach(el => el.addEventListener('click', () => {
    timeEnd = true;
    document.querySelector('#timer-table').style.color = 'black';
    clearTimeout(gameTime);
    clearInterval(timerS);
    document.querySelector('#timer-table').textContent = '10:00';
    counter = 0;
    document.querySelectorAll('.score')[1].textContent = counter;
    audioChangeDifficulty.currentTime = 0;
    audioChangeDifficulty.play();
    difficulty = el.value;
    document.querySelectorAll('.score')[0].textContent = localStorage.getItem(topScores[difficulty]);
    showHoles();
}));

function showHoles() {

    const myNode = document.querySelector(".game");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    switch (difficulty) {
        case 'EASY':
            game.style.width = "600px";
            document.documentElement.style.setProperty('--size-hole', '1 0 33.33%');
            addHole(6);
            break;
        case 'MEDIUM':
            game.style.width = "800px";
            document.documentElement.style.setProperty('--size-hole', '1 0 25.00%');
            addHole(8);
            break;
        case 'HARD':
            game.style.width = "1000px";
            document.documentElement.style.setProperty('--size-hole', '1 0 20.00%');
            addHole(10);
            break;
    }

    function addHole(num) {

        for (let i = 0; i < num; i++) {
            document.querySelector('.game').innerHTML +=
                `
        <div class="hole hole${i}">
            <div class="mole"></div>
        </div>
        `
        }
    }
}

function timer() {
    dateEnd = new Date();

    timerS = setInterval(() => {
        dateEnd = new Date();
        sec = Math.trunc(10 - (dateEnd - dateStart) / 1000);
        milSec = Math.trunc(100 - (((dateEnd - dateStart) / 1000) - Math.trunc((dateEnd - dateStart) / 1000)) * 100);

        timerInfo = `${sec < 10 ? '0' + sec : sec}:${milSec < 10 ? '0' + milSec : milSec}`;

        if (sec <= 3) document.querySelector('#timer-table').style.color = 'red';
        document.querySelector('#timer-table').textContent = timerInfo;

    }, 50)
}

console.log(`
    Score: 30 / 30 
    Игра whack-a-mole
  - [x] повторить исходный проект 
  - [x] Дополнил игру постепенно усложняющимися уровнями (3 уровня сложности), 
        сохранением набранного количества баллов в LocalStorage (для каждого уровня сложности отдельно), 
        и отображением его на странице игры после перезагрузки (есть кнопка для сброса).
  - [x] добавил звуки,
        добавил таймер обратного отсчета
  `);