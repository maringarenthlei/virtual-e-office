```javascript
/* ==========================================
   VIRTUAL e-OFFICE
   Training Simulator
   Main JavaScript
   ========================================== */


/* ==========================================
   APPLICATION STARTUP
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ------------------------------------------
     Elements
     ------------------------------------------ */

  const loginScreen = document.getElementById("loginScreen");
  const app = document.getElementById("app");

  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  const usernameInput = document.getElementById("username");
  const roleInput = document.getElementById("role");

  const displayUsername =
    document.getElementById("displayUsername");

  const displayRole =
    document.getElementById("displayRole");

  const userAvatar =
    document.getElementById("userAvatar");

  const logoutButton =
    document.getElementById("logoutButton");

  const sidebarToggle =
    document.getElementById("sidebarToggle");

  const currentDate =
    document.getElementById("currentDate");


  /* ==========================================
     LOGIN
     ========================================== */

  loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
      usernameInput.value.trim();

    const password =
      document.getElementById("password").value;

    const role =
      roleInput.value;


    /* ------------------------------------------
       Training simulator login

       This is NOT real authentication.
       Any non-empty username/password is accepted.
       ------------------------------------------ */

    if (username === "" || password === "") {

      loginMessage.textContent =
        "Please enter your username and password.";

      return;
    }


    /* Save training user locally */

    const user = {
      username: username,
      role: role
    };

    localStorage.setItem(
      "virtualEOfficeUser",
      JSON.stringify(user)
    );


    /* Update application */

    showApplication(user);

  });


  /* ==========================================
     SHOW APPLICATION
     ========================================== */

  function showApplication(user) {

    loginScreen.classList.add("hidden");

    app.classList.remove("hidden");


    /* Username */

    displayUsername.textContent =
      user.username;


    /* Role */

    displayRole.textContent =
      formatRole(user.role);


    /* Avatar */

    userAvatar.textContent =
      user.username.charAt(0).toUpperCase();


    /* Date */

    updateDate();


    /* Start at Dashboard */

    showPage("dashboard");

  }


  /* ==========================================
     FORMAT ROLE
     ========================================== */

  function formatRole(role) {

    const roles = {

      "dealing-assistant":
        "Dealing Assistant",

      "section-officer":
        "Section Officer",

      "under-secretary":
        "Under Secretary",

      "director":
        "Director"

    };

    return roles[role] || role;

  }


  /* ==========================================
     LOGOUT
     ========================================== */

  logoutButton.addEventListener(
    "click",
    function () {

      localStorage.removeItem(
        "virtualEOfficeUser"
      );

      app.classList.add("hidden");

      loginScreen.classList.remove("hidden");

      loginForm.reset();

      loginMessage.textContent = "";

      document.body.classList.remove(
        "sidebar-collapsed"
      );

      document.body.classList.remove(
        "sidebar-mobile-open"
      );

    }
  );


  /* ==========================================
     SIDEBAR NAVIGATION
     ========================================== */

  const navItems =
    document.querySelectorAll(".nav-item");


  navItems.forEach(function (item) {

    item.addEventListener(
      "click",
      function () {

        const page =
          item.getAttribute("data-page");

        showPage(page);


        /* Close mobile sidebar */

        if (
          window.innerWidth <= 800
        ) {

          document.body.classList.remove(
            "sidebar-mobile-open"
          );

        }

      }
    );

  });


  /* ==========================================
     PAGE NAVIGATION
     ========================================== */

  function showPage(pageName) {

    /* Hide all pages */

    const pages =
      document.querySelectorAll(".page");

    pages.forEach(function (page) {

      page.classList.remove(
        "active-page"
      );

    });


    /* Show requested page */

    const selectedPage =
      document.getElementById(
        "page-" + pageName
      );

    if (selectedPage) {

      selectedPage.classList.add(
        "active-page"
      );

    }


    /* Update sidebar */

    navItems.forEach(function (item) {

      item.classList.remove("active");

      if (
        item.getAttribute("data-page") ===
        pageName
      ) {

        item.classList.add("active");

      }

    });

  }


  /* ==========================================
     QUICK ACTIONS
     ========================================== */

  const pageLinks =
    document.querySelectorAll(
      "[data-page-link]"
    );


  pageLinks.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const page =
          button.getAttribute(
            "data-page-link"
          );

        showPage(page);

      }
    );

  });


  /* ==========================================
     SIDEBAR TOGGLE
     ========================================== */

  sidebarToggle.addEventListener(
    "click",
    function () {

      if (window.innerWidth <= 800) {

        document.body.classList.toggle(
          "sidebar-mobile-open"
        );

      } else {

        document.body.classList.toggle(
          "sidebar-collapsed"
        );

      }

    }
  );


  /* ==========================================
     DATE
     ========================================== */

  function updateDate() {

    const now = new Date();

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    currentDate.textContent =
      now.toLocaleDateString(
        "en-IN",
        options
      );

  }


  /* ==========================================
     RESTORE LOGIN SESSION
     ========================================== */

  const savedUser =
    localStorage.getItem(
      "virtualEOfficeUser"
    );


  if (savedUser) {

    try {

      const user =
        JSON.parse(savedUser);

      showApplication(user);

    } catch (error) {

      localStorage.removeItem(
        "virtualEOfficeUser"
      );

    }

  }


});
```
