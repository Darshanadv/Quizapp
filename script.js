const questionContainer = document.querySelector('#question-container')
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0
const highScoreDisplay = document.querySelector('#highScore')
const questionElement = document.querySelector('#question')
const answerButtton = document.querySelector('#answer-bottons')
const nextButton = document.querySelector('#next-btn')
const progressBar = document.querySelector('.process')
const scoreDisplay = document.querySelector('#score')

let questions = []
let currentQuestionIndex = 0;
let score = 0;
highScoreDisplay.innerHTML = `High Score: ${highScore}`

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple')
    const data = await response.json()
    questions = data.results;
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.innerText = `Current Score: ${score}`
    showQuesions();
}

function resetState() {
    answerButtton.innerHTML = ''
}

function showQuesions() {
    resetState()
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    let answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
    answers.sort(() => Math.random() - 0.5)

    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer
        button.addEventListener('click', () => selectAnswer(button, answer, currentQuestion.correct_answer))
        answerButtton.appendChild(button)
        updateProgress()
    })
}

function updateProgress() {
    let progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progressPercentage + '%'
}

function selectAnswer(button, selectAnswer, correctAnswer) {

    // disable all button
    Array.from(answerButtton.children).forEach(btn => {
        btn.disabled = true;
    })

    if (selectAnswer === correctAnswer) {
        button.classList.add("correct");
        score++
        scoreDisplay.innerText = `Current Score: ${score}`
    } else {
        button.classList.add("wrong");
    }
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuesions();
    } else {
        questionElement.innerHTML = `Quiz Complerted! Your Final Score is "${score}"`
        scoreDisplay.style.display = 'none'
        progressBar.style.display = 'none'
        answerButtton.innerHTML = ''
        nextButton.style.display = 'none'
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore)
        highScoreDisplay.innerHTML = `High Score: ${highScore}`
    }
})

fetchQuestions()





