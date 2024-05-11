// Array to store key and its coordinates
let finalPassword = '';
const currentUsername = sessionStorage.getItem('username');

// Function to generate keypad buttons
function generateKeypad() {
    const characters = shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+?~');
    const keypadDiv = document.getElementById('keypad');

    // Define grid size
    const rows = 7;
    const cols = 7;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const button = document.createElement('button');
            const index = i * cols + j;
            if (index < characters.length) {
                const character = characters[index];
                button.textContent = character;
                button.className = 'key';
                button.onclick = function() {
                    displayKey(character);
                };
                keypadDiv.appendChild(button);
            }
        }
    }
}

// Function to display the entered key and its coordinates
function displayKey(key) {
    const display = document.getElementById('passwordDisplay');
    display.textContent += key;
}

function backspace() {
    const display = document.getElementById('passwordDisplay');
    const currentText = display.textContent;
    display.textContent = currentText.slice(0, -1);
}

// Function to shuffle an array
function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function submitPassword() {
    const passwordDisplay = document.getElementById('passwordDisplay');
    finalPassword = passwordDisplay.textContent;
    passwordDisplay.textContent = '';
    const accessMessage = document.getElementById('access-message');
    accessMessage.style.display = 'block'
    ;
    const correctPassword = localStorage.getItem(`${currentUsername}-password`);
    if (finalPassword === correctPassword) {
        accessMessage.textContent = 'Access granted!';
        accessMessage.style.backgroundColor = 'green';

        // Redirect to home page after 2 seconds
        setTimeout(function() {
            window.location.href = 'index.html'; // Replace 'home.html' with the URL of your home page
            }, 2000); // 2000 milliseconds = 2 seconds
    } else {
        const otherPasswords = localStorage.getItem(`${currentUsername}-other`).split(',');
        if (otherPasswords.includes(finalPassword)) {
            accessMessage.textContent = 'Data breach detected!';
            accessMessage.style.backgroundColor = 'red';
            window.location.href = 'alert.html'
        } else {
            accessMessage.textContent = 'Password is incorrect, Please try again!';
            accessMessage.style.backgroundColor = 'red';
        }
    }

    console.log(finalPassword);
}

// Generate the keypad when the page loads
generateKeypad();

const username = document.getElementById('username');
const usernameParagraph = document.getElementById('usernameParagraph');
// get username from session storage and display it
if(currentUsername) {
    usernameParagraph.style.display = "flex";
    username.textContent = currentUsername;
}


const questions = [
    "What is the last letter of your favourite game?",
    "What is the first letter of your favourite movie genre?",
    "What is the most used alphabet on your keyboard?",
    "What is the first letter of your favourite movie?",
    "What is the first letter of the book you read in a library?",
    "What is the last digit of the phone number you call often?",
    "Your average time spent on mobile phone?",
    "How many pizza slices can you eat in a sitting?",
    "How many asanas do you practice daily?",
    "What is the singular sum of digits of your favourite number?",
    "Which is the most used special character in your keyboard?",
    "What special character describes you?",
    "What special character represents your favourite emoji?",
    "What is your favourite special character you use for formatting?",
    "Which special character represents danger?"
];

// get all the selected questions from local storage
const selectedQuestions = localStorage.getItem(`${currentUsername}-selected`).split(',');
if(selectedQuestions) {
    const selectedQuestionsContainer = document.getElementById('selected-questions');
    selectedQuestions.forEach((questionIndex, index) => {
        const label = document.createElement('label');
        // get corresponding question from the questions array
        const question = questions[parseInt(questionIndex)];
        label.textContent = `${index + 1}. ${question}`;
        label.style.display = 'block';
        selectedQuestionsContainer.appendChild(label);
    });
}
