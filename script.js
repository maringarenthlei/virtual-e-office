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
     /* ==========================================
     TRAINING USERS
     ========================================== */

  function loadTrainingUsers() {

    const tableBody =
      document.getElementById("trainingUsersTableBody");

    if (!tableBody) {
      return;
    }

    if (
      typeof VirtualEOfficeUsers === "undefined"
    ) {
      console.error(
        "Training User Management module not loaded."
      );
      return;
    }

    const users =
      VirtualEOfficeUsers.getUsers();

    tableBody.innerHTML = "";

    users.forEach(function (user) {

      const row =
        document.createElement("tr");

      const roleName =
        VirtualEOfficeUsers.getRoleName(user.role);

      const statusText =
        user.status === "active"
          ? "Active"
          : "Inactive";

      row.innerHTML = `
        <td>${user.id}</td>

        <td>
          <strong>${user.name}</strong>
        </td>

        <td>${roleName}</td>

        <td>${user.department}</td>

        <td>
          <span class="status ${
            user.status === "active"
              ? "approved"
              : "pending"
          }">
            ${statusText}
          </span>
        </td>

        <td>
          <button
            type="button"
            class="text-button"
            disabled
          >
            Edit
          </button>
        </td>
      `;

      tableBody.appendChild(row);

    });

  }
     /* ==========================================
     RECEIPT / DAK MODULE
     ========================================== */

  function loadReceipts() {

    const tableBody =
      document.getElementById("receiptsTableBody");

    if (!tableBody) {
      return;
    }

    if (
      typeof VirtualEOfficeReceipts === "undefined"
    ) {
      console.error(
        "Receipt Management module not loaded."
      );
      return;
    }


    const receipts =
      VirtualEOfficeReceipts.getReceipts();


    tableBody.innerHTML = "";


    /* ==========================================
       STATISTICS
       ========================================== */

    const totalElement =
      document.getElementById("totalReceipts");

    const newElement =
      document.getElementById("newReceipts");

    const linkedElement =
      document.getElementById("linkedReceipts");


    if (totalElement) {
      totalElement.textContent =
        receipts.length;
    }


    if (newElement) {

      newElement.textContent =
        receipts.filter(
          function (receipt) {
            return receipt.status === "new";
          }
        ).length;

    }


    if (linkedElement) {

      linkedElement.textContent =
        receipts.filter(
          function (receipt) {
            return receipt.status === "linked";
          }
        ).length;

    }


    /* ==========================================
       EMPTY STATE
       ========================================== */

    if (receipts.length === 0) {

      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td colspan="7" style="text-align:center;">
          No receipts registered.
        </td>
      `;

      tableBody.appendChild(row);

      return;
    }


    /* ==========================================
       DISPLAY RECEIPTS
       ========================================== */

    receipts.forEach(
      function (receipt) {

        const row =
          document.createElement("tr");


        let statusText =
          "New";

        let statusClass =
          "pending";


        if (receipt.status === "linked") {

          statusText =
            "Linked";

          statusClass =
            "approved";

        }


        row.innerHTML = `

          <td>
            <strong>
              ${receipt.receiptNo}
            </strong>
          </td>

          <td>
            ${receipt.receiptDate}
          </td>

          <td>
            ${receipt.from}
          </td>

          <td>
            ${receipt.subject}
          </td>

          <td>
            ${receipt.priority}
          </td>

          <td>
            <span class="status ${statusClass}">
              ${statusText}
            </span>
          </td>

          <td>

            <button
              type="button"
              class="text-button receipt-view-button"
              data-receipt-id="${receipt.id}"
            >
              View
            </button>

          </td>

        `;


        tableBody.appendChild(row);

      }
    );

  }


  /* ==========================================
     SHOW RECEIPT FORM
     ========================================== */

  function showReceiptForm() {

    const formPanel =
      document.getElementById(
        "receiptFormPanel"
      );

    if (!formPanel) {
      return;
    }


    formPanel.classList.remove(
      "hidden"
    );


    const today =
      new Date()
        .toISOString()
        .split("T")[0];


    const dateInput =
      document.getElementById(
        "receiptDate"
      );


    if (
      dateInput &&
      !dateInput.value
    ) {

      dateInput.value =
        today;

    }


    formPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


  /* ==========================================
     HIDE RECEIPT FORM
     ========================================== */

  function hideReceiptForm() {

    const formPanel =
      document.getElementById(
        "receiptFormPanel"
      );


    if (formPanel) {

      formPanel.classList.add(
        "hidden"
      );

    }

  }


  /* ==========================================
     SAVE RECEIPT
     ========================================== */

  function saveNewReceipt() {

    if (
      typeof VirtualEOfficeReceipts ===
      "undefined"
    ) {

      return;

    }


    const username =
      localStorage.getItem(
        "virtualEOfficeUsername"
      );


    const result =
      VirtualEOfficeReceipts.addReceipt({

        receiptNo:
          document.getElementById(
            "receiptNo"
          ).value,

        receiptDate:
          document.getElementById(
            "receiptDate"
          ).value,

        receiptType:
          document.getElementById(
            "receiptType"
          ).value,

        from:
          document.getElementById(
            "receiptFrom"
          ).value,

        toSection:
          document.getElementById(
            "receiptToSection"
          ).value,

        subject:
          document.getElementById(
            "receiptSubject"
          ).value,

        description:
          document.getElementById(
            "receiptDescription"
          ).value,

        priority:
          document.getElementById(
            "receiptPriority"
          ).value,

        createdBy:
          username

      });


    const message =
      document.getElementById(
        "receiptFormMessage"
      );


    if (!result.success) {

      if (message) {

        message.textContent =
          result.message;

        message.style.color =
          "#b91c1c";

      }

      return;

    }


    if (message) {

      message.textContent =
        "Receipt registered successfully.";

      message.style.color =
        "#15803d";

    }


    document
      .getElementById("receiptForm")
      .reset();


    loadReceipts();


    setTimeout(
      function () {

        hideReceiptForm();

        if (message) {
          message.textContent = "";
        }

      },
      1000
    );

  }


  /* ==========================================
     RECEIPT SEARCH
     ========================================== */

  function searchReceipts() {

    const searchInput =
      document.getElementById(
        "receiptSearch"
      );


    if (!searchInput) {
      return;
    }


    const searchTerm =
      searchInput.value
        .trim()
        .toLowerCase();


    const tableBody =
      document.getElementById(
        "receiptsTableBody"
      );


    if (!tableBody) {
      return;
    }


    const receipts =
      VirtualEOfficeReceipts.getReceipts();


    const filtered =
      receipts.filter(
        function (receipt) {

          return (

            receipt.receiptNo
              .toLowerCase()
              .includes(searchTerm)

            ||

            receipt.subject
              .toLowerCase()
              .includes(searchTerm)

            ||

            receipt.from
              .toLowerCase()
              .includes(searchTerm)

          );

        }
      );


    tableBody.innerHTML = "";


    if (filtered.length === 0) {

      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td colspan="7" style="text-align:center;">
          No matching receipts found.
        </td>
      `;

      tableBody.appendChild(row);

      return;

    }


    filtered.forEach(
      function (receipt) {

        const row =
          document.createElement("tr");


        const statusText =
          receipt.status === "linked"
            ? "Linked"
            : "New";


        const statusClass =
          receipt.status === "linked"
            ? "approved"
            : "pending";


        row.innerHTML = `

          <td>
            <strong>
              ${receipt.receiptNo}
            </strong>
          </td>

          <td>
            ${receipt.receiptDate}
          </td>

          <td>
            ${receipt.from}
          </td>

          <td>
            ${receipt.subject}
          </td>

          <td>
            ${receipt.priority}
          </td>

          <td>
            <span class="status ${statusClass}">
              ${statusText}
            </span>
          </td>

          <td>

            <button
              type="button"
              class="text-button receipt-view-button"
              data-receipt-id="${receipt.id}"
            >
              View
            </button>

          </td>

        `;


        tableBody.appendChild(row);

      }
    );

  }


  /* ==========================================
     RECEIPT EVENT HANDLERS
     ========================================== */

  const newReceiptButton =
    document.getElementById(
      "newReceiptButton"
    );


  if (newReceiptButton) {

    newReceiptButton.addEventListener(
      "click",
      showReceiptForm
    );

  }


  const cancelReceiptButton =
    document.getElementById(
      "cancelReceiptButton"
    );


  if (cancelReceiptButton) {

    cancelReceiptButton.addEventListener(
      "click",
      hideReceiptForm
    );

  }


  const receiptForm =
    document.getElementById(
      "receiptForm"
    );


  if (receiptForm) {

    receiptForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        saveNewReceipt();

      }
    );

  }


  const receiptSearch =
    document.getElementById(
      "receiptSearch"
    );


  if (receiptSearch) {

    receiptSearch.addEventListener(
      "input",
      searchReceipts
    );

  }


  /* ==========================================
     INITIAL LOAD
     ========================================== */

  loadReceipts();
     loadTrainingUsers();

});
