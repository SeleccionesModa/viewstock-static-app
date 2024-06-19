
// Get references to the form and input fields
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Get references to message containers
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Validate the input fields (same as before)
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('Please fill in both username and password.');
        return;
    }

    const apiUrl = 'http://2.136.89.187:85/api/Account/GetToken'; // SHOULD Use HTTPS
    const headers = {
        'accept': '*/*',
        'Authorization': 'Bearer', // No actual token here yet
        'Content-Type': 'application/json'
    };
    const data = {
        userName: username,
        password: password
    };

    try {
        // Fetch the token from the API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (response.ok) {
            //save user data
            localStorage.setItem('user', username)
            const result = await response.json();
            const token = result.token;
            console.log(token)
            console.log(username)
            // Show success message
            successMessage.style.display = 'block'; // Or 'visible'
            errorMessage.style.display = 'none'; // Hide error message

            // Now that you have the token, update the Authorization header
            headers.Authorization = `Bearer ${token}`;
            //save the token 
            localStorage.setItem('myAppToken', token)
            // Redirect to another page (e.g., dashboard.html)
            window.location.href = '/stock/stockpage.html'; 
            
        } else {
            // Show error message
            successMessage.style.display = 'none'; // Hide success message
            errorMessage.style.display = 'block'; // Or 'visible'
        }
    } catch (error) {
        // Update error message
        successMessage.style.display = 'none'; // Hide success message
        errorMessage.textContent = `Error fetching token: ${error.message}`;
    }
});


