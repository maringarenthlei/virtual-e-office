/* ==========================================
   VIRTUAL e-OFFICE
   e-FILE MANAGEMENT
   ========================================== */

/*
   This module manages fictional electronic files
   for the Virtual e-Office training simulator.

   IMPORTANT:
   - This is NOT a real e-Office system.
   - No real government data should be entered.
   - Data is stored only in browser localStorage.
   - This module is designed to work with the
     VirtualEOfficeReceipts module.
*/

(function () {

  "use strict";


  /* ==========================================
     STORAGE
     ========================================== */

  const STORAGE_KEY =
    "virtualEOfficeFiles";


  /* ==========================================
     DEFAULT TRAINING e-FILES
     ========================================== */

  const defaultFiles = [

    {
      id: "FILE-2026-001",

      fileNo:
        "HTE/EDU/2026/001",

      fileDate:
        "2026-09-01",

      subject:
        "Request for Computer Systems",

      section:
        "Education Section",

      category:
        "General",

      priority:
        "Normal",

      status:
        "draft",

      currentUser:
        "renthlei",

      createdBy:
        "renthlei",

      receiptId:
        "REC-2026-001",

      receiptNo:
        "HTE/REC/2026/001",

      description:
        "File created from incoming receipt regarding request for additional computer systems.",

      createdAt:
        "2026-09-01T10:30:00",

      updatedAt:
        "2026-09-01T10:30:00"

    }

  ];


  /* ==========================================
     FILE STATUS NAMES
     ========================================== */

  const statusNames = {

    "draft":
      "Draft",

    "submitted":
      "Submitted",

    "forwarded":
      "Forwarded",

    "under-process":
      "Under Process",

    "approved":
      "Approved",

    "rejected":
      "Rejected",

    "returned":
      "Returned",

    "closed":
      "Closed"

  };


  /* ==========================================
     GET FILES
     ========================================== */

  function getFiles() {

    const storedFiles =
      localStorage.getItem(STORAGE_KEY);


    if (!storedFiles) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultFiles)
      );

      return [...defaultFiles];

    }


    try {

      const files =
        JSON.parse(storedFiles);


      if (Array.isArray(files)) {

        return files;

      }

    } catch (error) {

      console.error(
        "Unable to read e-Files:",
        error
      );

    }


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultFiles)
    );


    return [...defaultFiles];

  }


  /* ==========================================
     SAVE FILES
     ========================================== */

  function saveFiles(files) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(files)
    );

  }


  /* ==========================================
     GET FILE BY ID
     ========================================== */

  function getFileById(id) {

    const files =
      getFiles();


    return files.find(
      function (file) {

        return file.id === id;

      }
    );

  }


  /* ==========================================
     GET FILE BY FILE NUMBER
     ========================================== */

  function getFileByNumber(fileNo) {

    const files =
      getFiles();


    return files.find(
      function (file) {

        return file.fileNo === fileNo;

      }
    );

  }


  /* ==========================================
     GET FILES BY USER
     ========================================== */

  function getFilesByUser(userId) {

    const files =
      getFiles();


    return files.filter(
      function (file) {

        return (
          file.currentUser === userId
        );

      }
    );

  }


  /* ==========================================
     GET FILES BY STATUS
     ========================================== */

  function getFilesByStatus(status) {

    const files =
      getFiles();


    return files.filter(
      function (file) {

        return file.status === status;

      }
    );

  }


  /* ==========================================
     GET FILES LINKED TO RECEIPT
     ========================================== */

  function getFilesByReceipt(receiptId) {

    const files =
      getFiles();


    return files.filter(
      function (file) {

        return file.receiptId === receiptId;

      }
    );

  }


  /* ==========================================
     GENERATE FILE ID
     ========================================== */

  function generateFileId() {

    return (
      "FILE-" +
      new Date().getTime()
    );

  }


  /* ==========================================
     ADD / CREATE e-FILE
     ========================================== */

  function addFile(fileData) {

    const files =
      getFiles();


    /* ------------------------------------------
       REQUIRED FIELDS
       ------------------------------------------ */

    if (
      !fileData.fileNo ||
      !fileData.subject
    ) {

      return {

        success: false,

        message:
          "File number and subject are required."

      };

    }


    const fileNo =
      fileData.fileNo.trim();


    const subject =
      fileData.subject.trim();


    /* ------------------------------------------
       DUPLICATE FILE NUMBER
       ------------------------------------------ */

    const duplicate =
      files.find(
        function (file) {

          return (
            file.fileNo.toLowerCase() ===
            fileNo.toLowerCase()
          );

        }
      );


    if (duplicate) {

      return {

        success: false,

        message:
          "An e-File with this file number already exists."

      };

    }


    /* ------------------------------------------
       CHECK RECEIPT
       ------------------------------------------ */

    let receipt = null;


    if (fileData.receiptId) {

      if (
        typeof VirtualEOfficeReceipts !==
        "undefined"
      ) {

        receipt =
          VirtualEOfficeReceipts
            .getReceiptById(
              fileData.receiptId
            );


        if (!receipt) {

          return {

            success: false,

            message:
              "The selected receipt could not be found."

          };

        }


        /* --------------------------------------
           PREVENT DOUBLE LINKING
           -------------------------------------- */

        if (receipt.linkedFileId) {

          return {

            success: false,

            message:
              "This receipt is already linked to an e-File."

          };

        }

      }

    }


    /* ------------------------------------------
       CURRENT USER
       ------------------------------------------ */

    const currentUser =
      fileData.currentUser ||
      null;


    /* ------------------------------------------
       CREATE FILE
       ------------------------------------------ */

    const now =
      new Date().toISOString();


    const newFile = {

      id:
        generateFileId(),

      fileNo:
        fileNo,

      fileDate:
        fileData.fileDate ||
        new Date()
          .toISOString()
          .split("T")[0],

      subject:
        subject,

      section:
        (
          fileData.section ||
          ""
        ).trim(),

      category:
        fileData.category ||
        "General",

      priority:
        fileData.priority ||
        "Normal",

      status:
        "draft",

      currentUser:
        currentUser,

      createdBy:
        fileData.createdBy ||
        currentUser,

      receiptId:
        fileData.receiptId ||
        null,

      receiptNo:
        receipt
          ? receipt.receiptNo
          : (
              fileData.receiptNo ||
              null
            ),

      description:
        (
          fileData.description ||
          ""
        ).trim(),

      createdAt:
        now,

      updatedAt:
        now

    };


    files.push(newFile);

    saveFiles(files);


    /* ------------------------------------------
       LINK RECEIPT
       ------------------------------------------ */

    if (
      receipt &&
      typeof VirtualEOfficeReceipts !==
      "undefined"
    ) {

      const linkResult =
        VirtualEOfficeReceipts.linkToFile(
          receipt.id,
          newFile.id
        );


      if (!linkResult.success) {

        /*
           If the receipt cannot be linked,
           remove the newly created file so
           we do not leave inconsistent data.
        */

        const updatedFiles =
          files.filter(
            function (file) {

              return file.id !== newFile.id;

            }
          );


        saveFiles(updatedFiles);


        return {

          success: false,

          message:
            "The e-File was not created because the receipt could not be linked."

        };

      }

    }


    return {

      success: true,

      file:
        newFile

    };

  }


  /* ==========================================
     UPDATE e-FILE
     ========================================== */

  function updateFile(
    id,
    fileData
  ) {

    const files =
      getFiles();


    const index =
      files.findIndex(
        function (file) {

          return file.id === id;

        }
      );


    if (index === -1) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    const file =
      files[index];


    /* ------------------------------------------
       UPDATE BASIC INFORMATION
       ------------------------------------------ */

    if (
      fileData.subject !==
      undefined
    ) {

      file.subject =
        fileData.subject.trim();

    }


    if (
      fileData.section !==
      undefined
    ) {

      file.section =
        fileData.section.trim();

    }


    if (
      fileData.category !==
      undefined
    ) {

      file.category =
        fileData.category;

    }


    if (
      fileData.priority !==
      undefined
    ) {

      file.priority =
        fileData.priority;

    }


    if (
      fileData.description !==
      undefined
    ) {

      file.description =
        fileData.description.trim();

    }


    if (
      fileData.fileDate !==
      undefined
    ) {

      file.fileDate =
        fileData.fileDate;

    }


    file.updatedAt =
      new Date().toISOString();


    saveFiles(files);


    return {

      success: true,

      file:
        file

    };

  }


  /* ==========================================
     CHANGE FILE STATUS
     ========================================== */

  function setFileStatus(
    id,
    status
  ) {

    const files =
      getFiles();


    const file =
      files.find(
        function (item) {

          return item.id === id;

        }
      );


    if (!file) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    if (
      !statusNames[status]
    ) {

      return {

        success: false,

        message:
          "Invalid file status."

      };

    }


    file.status =
      status;


    file.updatedAt =
      new Date().toISOString();


    saveFiles(files);


    return {

      success: true,

      file:
        file

    };

  }


  /* ==========================================
     ASSIGN FILE TO USER
     ========================================== */

  function assignFile(
    id,
    userId
  ) {

    const files =
      getFiles();


    const file =
      files.find(
        function (item) {

          return item.id === id;

        }
      );


    if (!file) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    if (
      !userId ||
      userId.trim() === ""
    ) {

      return {

        success: false,

        message:
          "A user must be selected."

      };

    }


    /* ------------------------------------------
       VERIFY TRAINING USER
       ------------------------------------------ */

    if (
      typeof VirtualEOfficeUsers !==
      "undefined"
    ) {

      const user =
        VirtualEOfficeUsers.getUserById(
          userId
        );


      if (!user) {

        return {

          success: false,

          message:
            "The selected training user does not exist."

        };

      }


      if (
        user.status !== "active"
      ) {

        return {

          success: false,

          message:
            "The selected training user is inactive."

        };

      }

    }


    file.currentUser =
      userId;


    file.status =
      "under-process";


    file.updatedAt =
      new Date().toISOString();


    saveFiles(files);


    return {

      success: true,

      file:
        file

    };

  }


  /* ==========================================
     REMOVE FILE ASSIGNMENT
     ========================================== */

  function unassignFile(id) {

    const files =
      getFiles();


    const file =
      files.find(
        function (item) {

          return item.id === id;

        }
      );


    if (!file) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    file.currentUser =
      null;


    file.updatedAt =
      new Date().toISOString();


    saveFiles(files);


    return {

      success: true,

      file:
        file

    };

  }


  /* ==========================================
     LINK AN EXISTING RECEIPT
     ========================================== */

  function linkReceipt(
    fileId,
    receiptId
  ) {

    const files =
      getFiles();


    const file =
      files.find(
        function (item) {

          return item.id === fileId;

        }
      );


    if (!file) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    if (file.receiptId) {

      return {

        success: false,

        message:
          "This e-File is already linked to a receipt."

      };

    }


    if (
      typeof VirtualEOfficeReceipts ===
      "undefined"
    ) {

      return {

        success: false,

        message:
          "Receipt management module is not available."

      };

    }


    const receipt =
      VirtualEOfficeReceipts
        .getReceiptById(
          receiptId
        );


    if (!receipt) {

      return {

        success: false,

        message:
          "Receipt not found."

      };

    }


    if (receipt.linkedFileId) {

      return {

        success: false,

        message:
          "This receipt is already linked to another e-File."

      };

    }


    file.receiptId =
      receipt.id;


    file.receiptNo =
      receipt.receiptNo;


    file.updatedAt =
      new Date().toISOString();


    const linkResult =
      VirtualEOfficeReceipts.linkToFile(
        receipt.id,
        file.id
      );


    if (!linkResult.success) {

      return {

        success: false,

        message:
          linkResult.message

      };

    }


    saveFiles(files);


    return {

      success: true,

      file:
        file

    };

  }


  /* ==========================================
     UNLINK RECEIPT FROM FILE
     ========================================== */

  function unlinkReceipt(
    fileId
  ) {

    const files =
      getFiles();


    const file =
      files.find(
        function (item) {

          return item.id === fileId;

        }
      );


    if (!file) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    if (!file.receiptId) {

      return {

        success: false,

        message:
          "This e-File is not linked to a receipt."

      };

    }


    const receiptId =
      file.receiptId;


    if (
      typeof VirtualEOfficeReceipts !==
      "undefined"
    ) {

      VirtualEOfficeReceipts
        .unlinkFromFile(
          receiptId
        );

    }


    file.receiptId =
      null;


    file.receiptNo =
      null;


    file.updatedAt =
      new Date().toISOString();


    saveFiles(files);


    return {

      success: true,

      file:
        file

    };

  }


  /* ==========================================
     DELETE e-FILE
     ========================================== */

  function deleteFile(id) {

    const files =
      getFiles();


    const file =
      files.find(
        function (item) {

          return item.id === id;

        }
      );


    if (!file) {

      return {

        success: false,

        message:
          "e-File not found."

      };

    }


    /*
       For training purposes, do not allow
       deletion after processing has started.
    */

    if (
      file.status !== "draft"
    ) {

      return {

        success: false,

        message:
          "Only draft e-Files can be deleted."

      };

    }


    /*
       Unlink associated receipt first.
    */

    if (
      file.receiptId &&
      typeof VirtualEOfficeReceipts !==
      "undefined"
    ) {

      VirtualEOfficeReceipts
        .unlinkFromFile(
          file.receiptId
        );

    }


    const filteredFiles =
      files.filter(
        function (item) {

          return item.id !== id;

        }
      );


    saveFiles(filteredFiles);


    return {

      success: true

    };

  }


  /* ==========================================
     RESET TRAINING e-FILES
     ========================================== */

  function resetFiles() {

    /*
       Reset receipts linked to the
       default training files.
    */

    if (
      typeof VirtualEOfficeReceipts !==
      "undefined"
    ) {

      const receipts =
        VirtualEOfficeReceipts
          .getReceipts();


      receipts.forEach(
        function (receipt) {

          if (
            receipt.linkedFileId
          ) {

            VirtualEOfficeReceipts
              .unlinkFromFile(
                receipt.id
              );

          }

        }
      );

    }


    saveFiles(
      [...defaultFiles]
    );


    /*
       Restore the default receipt link.
    */

    if (
      typeof VirtualEOfficeReceipts !==
      "undefined"
    ) {

      const defaultFile =
        defaultFiles[0];


      if (
        defaultFile.receiptId
      ) {

        VirtualEOfficeReceipts
          .linkToFile(
            defaultFile.receiptId,
            defaultFile.id
          );

      }

    }


    return [...defaultFiles];

  }


  /* ==========================================
     STATUS DISPLAY NAME
     ========================================== */

  function getStatusName(status) {

    return (
      statusNames[status] ||
      status
    );

  }


  /* ==========================================
     PUBLIC API
     ========================================== */

  window.VirtualEOfficeFiles = {

    getFiles:
      getFiles,

    getFileById:
      getFileById,

    getFileByNumber:
      getFileByNumber,

    getFilesByUser:
      getFilesByUser,

    getFilesByStatus:
      getFilesByStatus,

    getFilesByReceipt:
      getFilesByReceipt,

    addFile:
      addFile,

    updateFile:
      updateFile,

    setFileStatus:
      setFileStatus,

    assignFile:
      assignFile,

    unassignFile:
      unassignFile,

    linkReceipt:
      linkReceipt,

    unlinkReceipt:
      unlinkReceipt,

    deleteFile:
      deleteFile,

    resetFiles:
      resetFiles,

    getStatusName:
      getStatusName

  };


  /* ==========================================
     INITIALIZE
     ========================================== */

  getFiles();


  console.log(
    "Virtual e-Office e-Files loaded:",
    getFiles()
  );


})();
