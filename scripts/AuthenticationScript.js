// ! ============================================ Toggle between Login and Register Forms ============================================

// Function to show the login form and hide the register form
function showLoginForm() {
    document.getElementById('tab-login').classList.add('active');
    document.getElementById('tab-register').classList.remove('active');
    document.getElementById('pills-login').style.display = 'block';
    document.getElementById('pills-register').style.display = 'none';
}
  
// Function to show the register form and hide the login form
function showRegisterForm() {
    document.getElementById('tab-register').classList.add('active');
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('pills-register').style.display = 'block';
    document.getElementById('pills-login').style.display = 'none';
}
  
// Display login form on page load
document.addEventListener('DOMContentLoaded', function() {
    showLoginForm(); 
});
  
// ! =================================================== Toggle Password Visibility =================================================

// Toggle password visibility in the login form
document.getElementById('togglePassword').addEventListener('click', function (e) {
    const passwordInput = document.getElementById('loginPassword');
    const icon = e.currentTarget.querySelector('i');

    // Toggle between showing and hiding the password
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});
  
// ! =========================================================== Login Function ====================================================

// Handle login functionality
let signInBtn = document.querySelector(".signIn");

signInBtn.addEventListener('click', (event) => {
    event.preventDefault(); 

    const username = document.getElementById('loginName').value; // Now using username instead of email
    const password = document.getElementById('loginPassword').value;
    const minUsernameLength = 5;
    const minPasswordLength = 8;

    // Validation: Check if username and password meet the length requirements
    if (username.trim() !== "" && password.trim() !== "" &&
        username.length >= minUsernameLength && password.length >= minPasswordLength) {

        // Send login request to the server
        axios.post('https://tarmeezacademy.com/api/v1/login', {
            username: username,
            password: password,
        })
        .then(function (response) {
            // If login is successful, store token and user data in localStorage and redirect
            if (response.data.token) {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('Currentuser', JSON.stringify(response.data.user));
                window.location.href = './Pages/main.html';
            }
        })
        .catch(function (error) {
            // Handle login error
            alert("Invalid username or password. Please try again or contact us for assistance.");
            console.log(error);
        });

    } else {
        // Handle validation errors
        if (username.length < minUsernameLength) {
            alert("Username must be at least " + minUsernameLength + " characters long.");
        } else if (password.length < minPasswordLength) {
            alert("Password must be at least " + minPasswordLength + " characters long.");
        } else {
            alert("Please enter both username and password.");
        }
    }
});
  
// ! ============================================================= SIGN UP Function ==============================================

// Handle sign up functionality
const form = document.querySelector('.registerForm');
form.addEventListener('submit', RegisterFunction);

function RegisterFunction(event) {
    event.preventDefault(); 

    const nameInput = document.querySelector('.registerName').value;
    const usernameInput = "@" + document.querySelector('.registerUsername').value; // Replacing email with username
    const imageInput = document.querySelector('.registerImage').files[0];
    const passwordInput = document.querySelector('.registerPassword').value;
    const repeatPasswordInput = document.querySelector('.registerRepeatPassword').value;

    // Check if passwords match
    if (passwordInput !== repeatPasswordInput) {
        alert("Passwords do not match!");
        return;
    }

    // Create FormData object to handle the form data including the image file
    const formData = new FormData();
    formData.append('name', nameInput);
    formData.append('username', usernameInput); // Using username here
    formData.append('password', passwordInput);
    formData.append('image', imageInput); // Append image file

    // Send registration request via axios
    axios.post('https://tarmeezacademy.com/api/v1/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    })
    .then(function (response) {
        // If registration is successful, store token and user data in localStorage and redirect
        console.log('Registration successful:', response.data);
        alert(`Registration successful!`);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('Currentuser', JSON.stringify(response.data.user));
        window.location.href = './Pages/main.html';
    })
    .catch(function (error) {
        // Handle registration error
        console.log('Error during registration:', error.response ? error.response.data : error.message);
        alert("Registration failed. Please check your input.");
    });
}

// ! ========================================================= Logout functionality =========================================================
let logoutbtn = document.querySelector(".logout-btn");
logoutbtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Currentuser');
    window.location.href = "../index.html";
});
