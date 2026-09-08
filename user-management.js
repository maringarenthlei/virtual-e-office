/* ==========================================
   VIRTUAL e-OFFICE
   TRAINING USER MANAGEMENT
   ========================================== */

/*
   This module manages fictional training users.

   IMPORTANT:
   - This is NOT real authentication.
   - User data is stored only in browser localStorage.
   - No real government/user data should be entered.
*/

(function () {

  "use strict";


  /* ==========================================
     STORAGE
     ========================================== */

  const STORAGE_KEY = "virtualEOfficeUsers";


  /* ==========================================
     DEFAULT TRAINING USERS
     ========================================== */

  const defaultUsers = [

    {
      id: "renthlei",
      name: "Renthlei",
      role: "dealing-assistant",
      department: "Education Section",
      status: "active"
    },

    {
      id: "lalhmingmawia",
      name: "Lalhmingmawia",
      role: "section-officer",
      department: "Education Section",
      status: "active"
    },

    {
      id: "zothanmawia",
      name: "Zothanmawia",
      role: "under-secretary",
      department: "Higher & Technical Education",
      status: "active"
    },

    {
      id: "director",
      name: "Director",
      role: "director",
      department: "Directorate",
      status: "active"
    }

  ];


  /* ==========================================
     ROLE NAMES
     ========================================== */

  const roleNames = {

    "dealing-assistant":
      "Dealing Assistant",

    "section-officer":
      "Section Officer",

    "under-secretary":
      "Under Secretary",

    "director":
      "Director"

  };


  /* ==========================================
     GET USERS
     ========================================== */

  function getUsers() {

    const storedUsers =
      localStorage.getItem(STORAGE_KEY);


    if (!storedUsers) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultUsers)
      );

      return [...defaultUsers];

    }


    try {

      const users =
        JSON.parse(storedUsers);

      if (Array.isArray(users)) {

        return users;

      }

    } catch (error) {

      console.error(
        "Unable to read training users:",
        error
      );

    }


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultUsers)
    );

    return [...defaultUsers];

  }


  /* ==========================================
     SAVE USERS
     ========================================== */

  function saveUsers(users) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(users)
    );

  }


  /* ==========================================
     FIND USER
     ========================================== */

  function getUserById(id) {

    const users = getUsers();

    return users.find(
      function (user) {
        return user.id === id;
      }
    );

  }


  /* ==========================================
     ADD USER
     ========================================== */

  function addUser(userData) {

    const users = getUsers();


    const existingUser =
      users.find(
        function (user) {
          return user.id.toLowerCase() ===
            userData.id.toLowerCase();
        }
      );


    if (existingUser) {

      return {
        success: false,
        message: "A user with this User ID already exists."
      };

    }


    const newUser = {

      id: userData.id.trim(),

      name: userData.name.trim(),

      role: userData.role,

      department:
        userData.department.trim(),

      status:
        userData.status || "active"

    };


    if (
      newUser.id === "" ||
      newUser.name === ""
    ) {

      return {
        success: false,
        message: "User ID and Name are required."
      };

    }


    users.push(newUser);

    saveUsers(users);


    return {
      success: true,
      user: newUser
    };

  }


  /* ==========================================
     UPDATE USER
     ========================================== */

  function updateUser(id, userData) {

    const users = getUsers();

    const index =
      users.findIndex(
        function (user) {
          return user.id === id;
        }
      );


    if (index === -1) {

      return {
        success: false,
        message: "User not found."
      };

    }


    users[index] = {

      ...users[index],

      name:
        userData.name.trim(),

      role:
        userData.role,

      department:
        userData.department.trim(),

      status:
        userData.status

    };


    saveUsers(users);


    return {
      success: true,
      user: users[index]
    };

  }


  /* ==========================================
     DELETE USER
     ========================================== */

  function deleteUser(id) {

    const users = getUsers();


    const user =
      users.find(
        function (item) {
          return item.id === id;
        }
      );


    if (!user) {

      return {
        success: false,
        message: "User not found."
      };

    }


    const filteredUsers =
      users.filter(
        function (item) {
          return item.id !== id;
        }
      );


    saveUsers(filteredUsers);


    return {
      success: true
    };

  }


  /* ==========================================
     CHANGE USER STATUS
     ========================================== */

  function toggleUserStatus(id) {

    const users = getUsers();


    const user =
      users.find(
        function (item) {
          return item.id === id;
        }
      );


    if (!user) {

      return {
        success: false,
        message: "User not found."
      };

    }


    user.status =
      user.status === "active"
        ? "inactive"
        : "active";


    saveUsers(users);


    return {
      success: true,
      user: user
    };

  }


  /* ==========================================
     RESET TRAINING USERS
     ========================================== */

  function resetUsers() {

    saveUsers(
      [...defaultUsers]
    );

    return [...defaultUsers];

  }


  /* ==========================================
     PUBLIC API
     ========================================== */

  window.VirtualEOfficeUsers = {

    getUsers:
      getUsers,

    getUserById:
      getUserById,

    addUser:
      addUser,

    updateUser:
      updateUser,

    deleteUser:
      deleteUser,

    toggleUserStatus:
      toggleUserStatus,

    resetUsers:
      resetUsers,

    getRoleName:
      function (role) {
        return roleNames[role] || role;
      }

  };


  /* ==========================================
     INITIALIZE
     ========================================== */

  getUsers();


  console.log(
    "Virtual e-Office Training Users loaded:",
    getUsers()
  );


})();
