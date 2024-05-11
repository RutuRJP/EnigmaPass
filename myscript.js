document.addEventListener('DOMContentLoaded', function () {
    const questionsContainer = document.getElementById('questions-container');
    const selectedQuestionsContainer = document.getElementById('selected-questions');
    let selectedCount = 0;
    const selectedQuestions = [];
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    

    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "123456789";
    const characters = "!@#$%^&*(";

    // Set of questions to choose for the user
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

    // Define an array to store the indices
    const indices = [];

    // Loop through the questions array and store the index of each element
    questions.forEach((_, index) => {
        indices.push(index);
    });

    // Dynamically add questions to the form
    questions.forEach((question, index) => {
        const label = document.createElement('label');
        label.textContent = `${index + 1}. ${question}`;
        label.style.display = 'block'; // Display each question on a new line
        label.addEventListener('click', function () {
            const selectedIndex = indices[index];
            const selected = [selectedIndex, question];
            if (!label.classList.contains('question-selected')) {   // Checks for selected question for the 1st time
                label.classList.add('question-selected');           // adds question to the clicked label, means question is selected
                selectedCount++;
                selectedQuestions.push(selected);               // adds the selected question to the 'selected questions' array
            } else {                                            // condn when question is unselected
                label.classList.remove('question-selected');
                selectedCount--;
                const indexToRemove = selectedQuestions.indexOf(question);
                selectedQuestions.splice(indexToRemove, 1);
            }
            submitBtn.disabled = selectedCount !== 8;
        });

        questionsContainer.appendChild(label);
    });

    // Event listener for submit button
    const registrationForm = document.getElementById('registration-form');
    const submitBtn = document.getElementById('submit-btn');

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Clear selected questions container
        selectedQuestionsContainer.innerHTML = '';

        // Hide questions container
        questionsContainer.style.display = 'none';

        // console.log("selected questions", selectedQuestions);

        submitBtn.disabled = true;

        // Display input fields for selected questions
        selectedQuestions.forEach((question, index) => {
            const selectedIndex = question[0];
            const selectedQuestion = question[1];
            const label = document.createElement('label');
            // console.log("this is selected question", selectedQuestion, selectedIndex);
            label.textContent = `${index + 1}. ${selectedQuestion}`;
            label.style.display = 'block'; // Display each question on a new line

            // Specifications of the input field
            const inputField = document.createElement('input');

            if (selectedIndex < 5) {
                inputField.type = 'text'
            } else if (selectedIndex >= 5 && selectedIndex < 10) {
                inputField.type = 'number'
            } else {
                inputField.type = 'text'
            }
            inputField.maxLength = 1;   // Restrict input to one character
            inputField.placeholder = 'Enter your answer';
            inputField.style.border = 'none'; // Remove border
            inputField.style.background = 'none'; // Remove background
            inputField.style.borderBottom = '1px solid black'; // Add bottom border to simulate line appearance

            // Function to validate input based on the range of questions
            function validateInput(questionIndex, inputValue) {
                const selectedQuestion = selectedQuestions[questionIndex];
                const selectedIndex = selectedQuestion[0]; // Get the index of the selected question
                if (selectedIndex < 5) {
                    return /^[A-Za-z]$/.test(inputValue); // Validate if input is an alphabet
                } else if (selectedIndex >= 5 && selectedIndex < 10) {
                    return /^\d$/.test(inputValue); // Validate if input is a single digit number
                } else if (selectedIndex >= 10) {
                    return /^[^A-Za-z0-9]$/.test(inputValue); // Validate if input is a special character
                }
                return true; // For other types of questions, no validation needed
            }

            // Event listener for input fields
            inputField.addEventListener('input', function () {
                if (selectedIndex < 5) {
                    this.value = this.value.toUpperCase();
                }

                if (!validateInput(index, this.value)) {
                    // If the input is not valid, remove the last entered character
                    this.value = this.value.slice(0, -1);
                }

                let password = ''; // Initialize the password variable

                // Iterate through selected questions
                selectedQuestions.forEach((question, index) => {
                    const input = selectedQuestionsContainer.querySelectorAll('input')[index];
                    password += input.value; // Concatenate the value of each input field to the password string
                });

                
                const newPasswords = generateRandomPasswords(password);
                const currentUsername = sessionStorage.getItem('username');
                // Store the password and new passwords in localStorage
                localStorage.setItem(`${currentUsername}`, true);
                localStorage.setItem(`${currentUsername}-password`, password);
                localStorage.setItem(`${currentUsername}-other`, newPasswords);

                // Check if all input fields are filled
                const allFilled = selectedQuestions.every((q, i) => {
                    const input = selectedQuestionsContainer.querySelectorAll('input')[i];
                    return input.value.trim() !== ''; // Check if the input field is not empty
                });

                submitBtn.disabled = !allFilled; // Disable the submit button if any input field is empty

                // Show submit button if all input fields are filled
                if (allFilled) {
                    submitBtn.style.display = 'block';
                    submitBtn.addEventListener('click', function () {
                        // Show registration success message
                        alert('Congratulations! Your registration is successful. You may login now.');
                        // const passwordsArray = [password, ...newPasswords.split(',')];
                        // saveStringsToFile(passwordsArray);
                        // Redirect back to home page
                        window.location.href = 'home.html';
                    });
                }
            });

            // Add line gap between questions
            const lineGap = document.createElement('div');
            lineGap.style.height = '20px'; // Adjust height as needed

            selectedQuestionsContainer.appendChild(lineGap); // Append line gap
            selectedQuestionsContainer.appendChild(label);
            selectedQuestionsContainer.appendChild(inputField);
        });


        // get all the selected questions index
        const currentUsername = sessionStorage.getItem('username');
        const selectedQuestionsIndex = selectedQuestions.map((question) => question[0]);
        localStorage.setItem(`${currentUsername}-selected`, selectedQuestionsIndex);
        
    });     // End of registration event listener
});




function generateRandomPasswords(password) {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "123456789";
    const specialChars = "!@#$%^&*(";

    let newPasswords = "";

    // Generate 4 random passwords
    for (let j = 0; j < 4; j++) {
        let newPassword = '';

        // Generate random password
        for (let i = 0; i < password.length; i++) {
            let selectedChars;
            let randomIndex;

            if (/[A-Za-z]/.test(password[i])) {
                // Choose from alphabets
                selectedChars = alphabets;
                randomIndex = Math.floor(Math.random() * selectedChars.length);
                newPassword += selectedChars[randomIndex];
            } else if (/[0-9]/.test(password[i])) {
                // Choose from numbers
                selectedChars = numbers;
                randomIndex = Math.floor(Math.random() * selectedChars.length);
                newPassword += selectedChars[randomIndex];
            } else if (/[!@#$%^&*(]/.test(password[i])) {
                // Choose from special characters
                selectedChars = specialChars;
                randomIndex = Math.floor(Math.random() * selectedChars.length);
                newPassword += selectedChars[randomIndex];
            }
        }

        newPasswords += newPassword + ",";
    }

    return newPasswords;
}

// store password to file
function saveStringsToFile(strings) {
    // Join the strings with newline character
    const data = strings.join('\n');

    // Create a Blob containing the data
    const blob = new Blob([data], { type: 'text/plain' });

    // Create a link element
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    // Set the link's attributes
    a.href = url;
    a.download = 'strings.txt';

    // Append the link to the body and click it programmatically
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// function displayQuestions() {
//     if (currentQuestionIndex < questions.length && selectedCount === 8) {
//         // Create input field for current question
//         const inputField = document.createElement('input');
//         inputField.type = 'text';
//         inputField.placeholder = questions[currentQuestionIndex];
//         questionsContainer.appendChild(inputField);

//         // Increment current question index
//         currentQuestionIndex++;
//     }
//     else {
//         // Enable submit button again if all questions are displayed
//         submitBtn.disabled = false;
//     }
// }
