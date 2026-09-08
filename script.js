```javascript
/* ========================================
   Virtual e-Office
   Main JavaScript
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {

  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();

    if (username === "") {
      loginMessage.textContent = "Please enter your username.";
      return;
    }

    loginMessage.textContent =
      `Welcome, ${username}! Login functionality will be added in the next step.`;
  });

});
```
