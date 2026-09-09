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
/* ======================================
   e-FILE MANAGEMENT
   ====================================== */

function loadEFiles() {

  const files = VirtualEOfficeFiles.getFiles();

  const tableBody = document.getElementById("filesTableBody");

  const totalFiles = document.getElementById("totalFiles");
  const draftFiles = document.getElementById("draftFiles");
  const processingFiles = document.getElementById("processingFiles");
  const approvedFiles = document.getElementById("approvedFiles");

  if (!tableBody) {
    return;
  }

  /* ======================================
     STATISTICS
     ====================================== */

  if (totalFiles) {
    totalFiles.textContent = files.length;
  }

  if (draftFiles) {
    draftFiles.textContent =
      files.filter(file => file.status === "draft").length;
  }

  if (processingFiles) {
    processingFiles.textContent =
      files.filter(file => file.status === "under-process").length;
  }

  if (approvedFiles) {
    approvedFiles.textContent =
      files.filter(file => file.status === "approved").length;
  }


  /* ======================================
     EMPTY STATE
     ====================================== */

  if (files.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-table">
          No e-Files found.
        </td>
      </tr>
    `;

    return;
  }


  /* ======================================
     FILE TABLE
     ====================================== */

  tableBody.innerHTML = files.map(file => {

    const user =
      VirtualEOfficeUsers.getUserById(file.currentUser);

    const userName =
      user ? user.name : file.currentUser || "--";

    const statusName =
      VirtualEOfficeFiles.getStatusName(file.status);

    return `
      <tr>

        <td>
          <strong>${file.fileNo}</strong>
        </td>

        <td>
          ${file.date || "--"}
        </td>

        <td>
          ${file.subject || "--"}
        </td>

        <td>
          ${file.section || "--"}
        </td>

        <td>
          ${file.receiptNo || "--"}
        </td>

        <td>
          <span class="status-badge">
            ${statusName}
          </span>
        </td>

        <td>
          ${userName}
        </td>

        <td>

          <button
            type="button"
            class="text-button view-file-button"
            data-file-id="${file.id}"
          >
            View
          </button>

        </td>

      </tr>
    `;

  }).join("");


  /* ======================================
     VIEW BUTTONS
     ====================================== */

  document.querySelectorAll(".view-file-button")
    .forEach(button => {

      button.addEventListener("click", function () {

        const fileId =
          this.dataset.fileId;

        showFileDetails(fileId);

      });

    });

}


/* ======================================
   LOAD RECEIPTS INTO FILE FORM
   ====================================== */

function loadReceiptOptionsForFile() {

  const receiptSelect =
    document.getElementById("fileReceipt");

  if (!receiptSelect) {
    return;
  }

  const receipts =
    VirtualEOfficeReceipts.getReceipts();

  receiptSelect.innerHTML = `
    <option value="">
      -- No Receipt --
    </option>
  `;

  receipts.forEach(receipt => {

    const option =
      document.createElement("option");

    option.value = receipt.id;

    option.textContent =
      `${receipt.receiptNo} — ${receipt.subject}`;

    receiptSelect.appendChild(option);

  });

}


/* ======================================
   SHOW NEW FILE FORM
   ====================================== */

function showNewFileForm() {

  const panel =
    document.getElementById("fileFormPanel");

  const detailsPanel =
    document.getElementById("fileDetailsPanel");

  if (detailsPanel) {
    detailsPanel.classList.add("hidden");
  }

  if (panel) {
    panel.classList.remove("hidden");
  }

  loadReceiptOptionsForFile();


  /* Default date */

  const dateInput =
    document.getElementById("fileDate");

  if (dateInput && !dateInput.value) {

    const today =
      new Date().toISOString().split("T")[0];

    dateInput.value = today;

  }

}


/* ======================================
   HIDE NEW FILE FORM
   ====================================== */

function hideNewFileForm() {

  const panel =
    document.getElementById("fileFormPanel");

  if (panel) {
    panel.classList.add("hidden");
  }

}


/* ======================================
   CREATE NEW e-FILE
   ====================================== */

function saveNewEFile(event) {

  event.preventDefault();

  const message =
    document.getElementById("fileFormMessage");

  const currentUser =
    localStorage.getItem("virtualEOfficeCurrentUser");

  if (!currentUser) {

    if (message) {
      message.textContent =
        "Please login before creating an e-File.";
    }

    return;
  }


  const fileNo =
    document.getElementById("fileNo").value.trim();

  const date =
    document.getElementById("fileDate").value;

  const section =
    document.getElementById("fileSection").value.trim();

  const category =
    document.getElementById("fileCategory").value;

  const priority =
    document.getElementById("filePriority").value;

  const receiptId =
    document.getElementById("fileReceipt").value;

  const subject =
    document.getElementById("fileSubject").value.trim();

  const description =
    document.getElementById("fileDescription").value.trim();


  /* ======================================
     BASIC VALIDATION
     ====================================== */

  if (!fileNo || !date || !section || !subject) {

    if (message) {
      message.textContent =
        "Please fill in all required fields.";
    }

    return;
  }


  /* ======================================
     CHECK DUPLICATE FILE NUMBER
     ====================================== */

  if (VirtualEOfficeFiles.getFileByNumber(fileNo)) {

    if (message) {
      message.textContent =
        "A file with this file number already exists.";
    }

    return;
  }


  /* ======================================
     CREATE FILE
     ====================================== */

  const newFile =
    VirtualEOfficeFiles.addFile({

      fileNo: fileNo,

      date: date,

      subject: subject,

      section: section,

      category: category,

      priority: priority,

      status: "draft",

      currentUser: currentUser,

      createdBy: currentUser,

      receiptId: receiptId || null,

      description: description

    });


  /* ======================================
     SUCCESS
     ====================================== */

  if (message) {

    message.textContent =
      `e-File ${newFile.fileNo} created successfully.`;

  }


  /* Refresh */

  loadEFiles();


  /* Reset form */

  document.getElementById("fileForm").reset();


  /* Hide form after short delay */

  setTimeout(() => {

    hideNewFileForm();

    if (message) {
      message.textContent = "";
    }

  }, 800);

}


/* ======================================
   SEARCH e-FILES
   ====================================== */

function searchEFiles() {

  const searchInput =
    document.getElementById("fileSearch");

  const tableBody =
    document.getElementById("filesTableBody");

  if (!searchInput || !tableBody) {
    return;
  }

  const searchTerm =
    searchInput.value.trim().toLowerCase();

  const files =
    VirtualEOfficeFiles.getFiles();

  const filteredFiles =
    files.filter(file => {

      return (

        (file.fileNo || "")
          .toLowerCase()
          .includes(searchTerm)

        ||

        (file.subject || "")
          .toLowerCase()
          .includes(searchTerm)

        ||

        (file.section || "")
          .toLowerCase()
          .includes(searchTerm)

      );

    });


  /* ======================================
     EMPTY SEARCH RESULT
     ====================================== */

  if (filteredFiles.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-table">
          No matching e-Files found.
        </td>
      </tr>
    `;

    return;

  }


  /* ======================================
     DISPLAY SEARCH RESULTS
     ====================================== */

  tableBody.innerHTML =
    filteredFiles.map(file => {

      const user =
        VirtualEOfficeUsers.getUserById(file.currentUser);

      const userName =
        user ? user.name : file.currentUser || "--";

      const statusName =
        VirtualEOfficeFiles.getStatusName(file.status);

      return `
        <tr>

          <td>
            <strong>${file.fileNo}</strong>
          </td>

          <td>
            ${file.date || "--"}
          </td>

          <td>
            ${file.subject || "--"}
          </td>

          <td>
            ${file.section || "--"}
          </td>

          <td>
            ${file.receiptNo || "--"}
          </td>

          <td>
            <span class="status-badge">
              ${statusName}
            </span>
          </td>

          <td>
            ${userName}
          </td>

          <td>

            <button
              type="button"
              class="text-button view-file-button"
              data-file-id="${file.id}"
            >
              View
            </button>

          </td>

        </tr>
      `;

    }).join("");


  /* Reconnect View buttons */

  document.querySelectorAll(".view-file-button")
    .forEach(button => {

      button.addEventListener("click", function () {

        showFileDetails(this.dataset.fileId);

      });

    });

}


/* ======================================
   SHOW FILE DETAILS
   ====================================== */

function showFileDetails(fileId) {
     currentNoteFileId = fileId;

  const file =
    VirtualEOfficeFiles.getFileById(fileId);

  if (!file) {
    return;
  }


  const user =
    VirtualEOfficeUsers.getUserById(file.currentUser);

  const creator =
    VirtualEOfficeUsers.getUserById(file.createdBy);


  const userName =
    user ? user.name : file.currentUser || "--";

  const creatorName =
    creator ? creator.name : file.createdBy || "--";


  document.getElementById("fileDetailsTitle")
    .textContent = file.fileNo;

  document.getElementById("fileDetailsSubject")
    .textContent = file.subject || "--";

  document.getElementById("detailFileNo")
    .textContent = file.fileNo || "--";

  document.getElementById("detailFileDate")
    .textContent = file.date || "--";

  document.getElementById("detailFileSection")
    .textContent = file.section || "--";

  document.getElementById("detailFilePriority")
    .textContent = file.priority || "--";

  document.getElementById("detailFileStatus")
    .textContent =
      VirtualEOfficeFiles.getStatusName(file.status);

  document.getElementById("detailFileUser")
    .textContent = userName;

  document.getElementById("detailFileReceipt")
    .textContent =
      file.receiptNo || "--";

  document.getElementById("detailFileCreator")
    .textContent = creatorName;

  document.getElementById("detailFileDescription")
    .textContent =
      file.description || "No description provided.";


  /* Show details */

  document.getElementById("fileDetailsPanel")
    .classList.remove("hidden");

  document.getElementById("fileFormPanel")
    .classList.add("hidden");


  /* Scroll to details */

  document.getElementById("fileDetailsPanel")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

loadFileNotes(fileId);
}


/* ======================================
   CLOSE FILE DETAILS
   ====================================== */

function closeFileDetails() {

  const panel =
    document.getElementById("fileDetailsPanel");

  if (panel) {
    panel.classList.add("hidden");
  }

}


/* ======================================
   e-FILE EVENT HANDLERS
   ====================================== */

const newFileButton =
  document.getElementById("newFileButton");

if (newFileButton) {

  newFileButton.addEventListener(
    "click",
    showNewFileForm
  );

}


const cancelFileButton =
  document.getElementById("cancelFileButton");

if (cancelFileButton) {

  cancelFileButton.addEventListener(
    "click",
    hideNewFileForm
  );

}


const closeFileDetailsButton =
  document.getElementById("closeFileDetailsButton");

if (closeFileDetailsButton) {

  closeFileDetailsButton.addEventListener(
    "click",
    closeFileDetails
  );

}


const fileForm =
  document.getElementById("fileForm");

if (fileForm) {

  fileForm.addEventListener(
    "submit",
    saveNewEFile
  );

}


const fileSearch =
  document.getElementById("fileSearch");

if (fileSearch) {

  fileSearch.addEventListener(
    "input",
    searchEFiles
  );

}


/* ======================================
   INITIAL LOAD
   ====================================== */

loadEFiles();
   /* ======================================
   NOTE SHEET MANAGEMENT
   ====================================== */

let currentNoteFileId = null;


/* ======================================
   LOAD NOTES FOR FILE
   ====================================== */

function loadFileNotes(fileId) {

  const notesList =
    document.getElementById("fileNotesList");

  if (!notesList) {
    return;
  }


  const notes =
    VirtualEOfficeNotes.getNotesByFile(fileId);


  /* ======================================
     EMPTY STATE
     ====================================== */

  if (notes.length === 0) {

    notesList.innerHTML = `
      <div class="empty-module">

        <div class="empty-icon">
          ▤
        </div>

        <p>
          No notes have been added to this file.
        </p>

      </div>
    `;

    return;

  }


  /* ======================================
     DISPLAY NOTES
     ====================================== */

  notesList.innerHTML =
    notes.map(note => {

      const author =
        VirtualEOfficeUsers.getUserById(
          note.authorId
        );

      const authorName =
        author
          ? author.name
          : note.authorId || "--";


      return `
        <div class="note-card">

          <div class="note-header">

            <div>

              <strong>
                Note No. ${note.noteNo}
              </strong>

              <span>
                ${note.date || "--"}
              </span>

            </div>

            <span class="note-author">
              ${authorName}
            </span>

          </div>


          <div class="note-body">

            ${note.text}

          </div>

        </div>
      `;

    }).join("");

}


/* ======================================
   SHOW ADD NOTE FORM
   ====================================== */

function showAddNoteForm() {

  if (!currentNoteFileId) {
    return;
  }


  const panel =
    document.getElementById("noteFormPanel");

  if (!panel) {
    return;
  }


  panel.classList.remove("hidden");


  const dateInput =
    document.getElementById("noteDate");

  if (dateInput && !dateInput.value) {

    dateInput.value =
      new Date()
        .toISOString()
        .split("T")[0];

  }


  const textInput =
    document.getElementById("noteText");

  if (textInput) {
    textInput.focus();
  }

}


/* ======================================
   HIDE ADD NOTE FORM
   ====================================== */

function hideAddNoteForm() {

  const panel =
    document.getElementById("noteFormPanel");

  if (panel) {
    panel.classList.add("hidden");
  }


  const form =
    document.getElementById("noteForm");

  if (form) {
    form.reset();
  }


  const message =
    document.getElementById("noteFormMessage");

  if (message) {
    message.textContent = "";
  }

}


/* ======================================
   SAVE NOTE
   ====================================== */

function saveNewNote(event) {

  event.preventDefault();


  const message =
    document.getElementById("noteFormMessage");


  const savedUser =
  localStorage.getItem(
    "virtualEOfficeUser"
  );

let currentUser = null;

if (savedUser) {

  try {

    const user =
      JSON.parse(savedUser);

    currentUser =
      user.username;

  } catch (error) {

    console.error(
      "Unable to read logged-in user:",
      error
    );

  }

}

  if (!currentUser) {

    if (message) {

      message.textContent =
        "Please login before adding a note.";

    }

    return;

  }


  if (!currentNoteFileId) {

    if (message) {

      message.textContent =
        "No e-File has been selected.";

    }

    return;

  }


  const noteDate =
    document.getElementById("noteDate")
      .value;


  const noteText =
    document.getElementById("noteText")
      .value
      .trim();


  /* ======================================
     VALIDATION
     ====================================== */

  if (!noteDate || !noteText) {

    if (message) {

      message.textContent =
        "Please enter the date and note.";

    }

    return;

  }


  /* ======================================
     CREATE NOTE
     ====================================== */

  try {

    VirtualEOfficeNotes.addNote({

      fileId:
        currentNoteFileId,

      date:
        noteDate,

      authorId:
        currentUser,

      text:
        noteText

    });


    /* Refresh note list */

    loadFileNotes(
      currentNoteFileId
    );


    if (message) {

      message.textContent =
        "Note added successfully.";

    }


    /* Reset form */

    document.getElementById(
      "noteForm"
    ).reset();


    /* Set current date again */

    document.getElementById(
      "noteDate"
    ).value =
      new Date()
        .toISOString()
        .split("T")[0];


    /* Hide after short delay */

    setTimeout(() => {

      hideAddNoteForm();

    }, 700);


  } catch (error) {

    console.error(
      "Unable to save note:",
      error
    );


    if (message) {

      message.textContent =
        error.message ||
        "Unable to save note.";

    }

  }

}


/* ======================================
   EVENT HANDLERS
   ====================================== */

const addNoteButton =
  document.getElementById(
    "addNoteButton"
  );

if (addNoteButton) {

  addNoteButton.addEventListener(
    "click",
    showAddNoteForm
  );

}


const cancelNoteButton =
  document.getElementById(
    "cancelNoteButton"
  );

if (cancelNoteButton) {

  cancelNoteButton.addEventListener(
    "click",
    hideAddNoteForm
  );

}


const noteForm =
  document.getElementById(
    "noteForm"
  );

if (noteForm) {

  noteForm.addEventListener(
    "submit",
    saveNewNote
  );

}
});
