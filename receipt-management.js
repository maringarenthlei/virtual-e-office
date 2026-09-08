/* ==========================================
   VIRTUAL e-OFFICE
   RECEIPT / DAK MANAGEMENT
   ========================================== */

/*
   This module manages fictional incoming
   Receipt / Dak records.

   IMPORTANT:
   - This is a training simulator.
   - No real government correspondence
     should be entered.
   - Data is stored only in browser
     localStorage.
*/

(function () {

  "use strict";


  /* ==========================================
     STORAGE
     ========================================== */

  const STORAGE_KEY =
    "virtualEOfficeReceipts";


  /* ==========================================
     DEFAULT TRAINING RECEIPTS
     ========================================== */

  const defaultReceipts = [

    {
      id: "REC-2026-001",

      receiptNo: "HTE/REC/2026/001",

      receiptDate: "2026-09-01",

      receiptType: "Letter",

      from:
        "Directorate of School Education",

      toSection:
        "Education Section",

      subject:
        "Request for Computer Systems",

      description:
        "Request for additional computer systems for training purposes.",

      priority:
        "Normal",

      status:
        "new",

      linkedFileId:
        null,

      createdBy:
        "renthlei",

      createdAt:
        "2026-09-01T10:00:00"

    },

    {
      id: "REC-2026-002",

      receiptNo: "HTE/REC/2026/002",

      receiptDate: "2026-09-02",

      receiptType: "Office Memorandum",

      from:
        "Higher & Technical Education Department",

      toSection:
        "Education Section",

      subject:
        "Training Programme Proposal",

      description:
        "Proposal for conducting a departmental training programme.",

      priority:
        "High",

      status:
        "new",

      linkedFileId:
        null,

      createdBy:
        "renthlei",

      createdAt:
        "2026-09-02T11:30:00"

    }

  ];


  /* ==========================================
     GET RECEIPTS
     ========================================== */

  function getReceipts() {

    const storedReceipts =
      localStorage.getItem(STORAGE_KEY);


    if (!storedReceipts) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultReceipts)
      );

      return [...defaultReceipts];

    }


    try {

      const receipts =
        JSON.parse(storedReceipts);

      if (Array.isArray(receipts)) {

        return receipts;

      }

    } catch (error) {

      console.error(
        "Unable to read receipts:",
        error
      );

    }


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultReceipts)
    );

    return [...defaultReceipts];

  }


  /* ==========================================
     SAVE RECEIPTS
     ========================================== */

  function saveReceipts(receipts) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(receipts)
    );

  }


  /* ==========================================
     GET RECEIPT BY ID
     ========================================== */

  function getReceiptById(id) {

    const receipts =
      getReceipts();

    return receipts.find(
      function (receipt) {
        return receipt.id === id;
      }
    );

  }


  /* ==========================================
     GET RECEIPT BY RECEIPT NUMBER
     ========================================== */

  function getReceiptByNumber(receiptNo) {

    const receipts =
      getReceipts();

    return receipts.find(
      function (receipt) {
        return receipt.receiptNo === receiptNo;
      }
    );

  }


  /* ==========================================
     ADD RECEIPT
     ========================================== */

  function addReceipt(receiptData) {

    const receipts =
      getReceipts();


    const id =
      "REC-" +
      new Date().getTime();


    const newReceipt = {

      id: id,

      receiptNo:
        receiptData.receiptNo.trim(),

      receiptDate:
        receiptData.receiptDate,

      receiptType:
        receiptData.receiptType,

      from:
        receiptData.from.trim(),

      toSection:
        receiptData.toSection.trim(),

      subject:
        receiptData.subject.trim(),

      description:
        receiptData.description.trim(),

      priority:
        receiptData.priority || "Normal",

      status:
        "new",

      linkedFileId:
        null,

      createdBy:
        receiptData.createdBy || null,

      createdAt:
        new Date().toISOString()

    };


    if (
      !newReceipt.receiptNo ||
      !newReceipt.subject
    ) {

      return {

        success: false,

        message:
          "Receipt number and subject are required."

      };

    }


    const duplicate =
      receipts.find(
        function (receipt) {

          return receipt.receiptNo
            .toLowerCase() ===
            newReceipt.receiptNo.toLowerCase();

        }
      );


    if (duplicate) {

      return {

        success: false,

        message:
          "A receipt with this number already exists."

      };

    }


    receipts.push(newReceipt);

    saveReceipts(receipts);


    return {

      success: true,

      receipt: newReceipt

    };

  }


  /* ==========================================
     UPDATE RECEIPT
     ========================================== */

  function updateReceipt(id, receiptData) {

    const receipts =
      getReceipts();


    const index =
      receipts.findIndex(
        function (receipt) {
          return receipt.id === id;
        }
      );


    if (index === -1) {

      return {

        success: false,

        message:
          "Receipt not found."

      };

    }


    receipts[index] = {

      ...receipts[index],

      receiptDate:
        receiptData.receiptDate,

      receiptType:
        receiptData.receiptType,

      from:
        receiptData.from.trim(),

      toSection:
        receiptData.toSection.trim(),

      subject:
        receiptData.subject.trim(),

      description:
        receiptData.description.trim(),

      priority:
        receiptData.priority

    };


    saveReceipts(receipts);


    return {

      success: true,

      receipt:
        receipts[index]

    };

  }


  /* ==========================================
     LINK RECEIPT TO FILE
     ========================================== */

  function linkToFile(
    receiptId,
    fileId
  ) {

    const receipts =
      getReceipts();


    const receipt =
      receipts.find(
        function (item) {
          return item.id === receiptId;
        }
      );


    if (!receipt) {

      return {

        success: false,

        message:
          "Receipt not found."

      };

    }


    receipt.linkedFileId =
      fileId;

    receipt.status =
      "linked";


    saveReceipts(receipts);


    return {

      success: true,

      receipt: receipt

    };

  }


  /* ==========================================
     UNLINK RECEIPT
     ========================================== */

  function unlinkFromFile(
    receiptId
  ) {

    const receipts =
      getReceipts();


    const receipt =
      receipts.find(
        function (item) {
          return item.id === receiptId;
        }
      );


    if (!receipt) {

      return {

        success: false,

        message:
          "Receipt not found."

      };

    }


    receipt.linkedFileId =
      null;

    receipt.status =
      "new";


    saveReceipts(receipts);


    return {

      success: true,

      receipt: receipt

    };

  }


  /* ==========================================
     DELETE RECEIPT
     ========================================== */

  function deleteReceipt(id) {

    const receipts =
      getReceipts();


    const receipt =
      receipts.find(
        function (item) {
          return item.id === id;
        }
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
          "This receipt is linked to an e-File and cannot be deleted."

      };

    }


    const filtered =
      receipts.filter(
        function (item) {
          return item.id !== id;
        }
      );


    saveReceipts(filtered);


    return {

      success: true

    };

  }


  /* ==========================================
     RESET TRAINING RECEIPTS
     ========================================== */

  function resetReceipts() {

    saveReceipts(
      [...defaultReceipts]
    );

    return [...defaultReceipts];

  }


  /* ==========================================
     PUBLIC API
     ========================================== */

  window.VirtualEOfficeReceipts = {

    getReceipts:
      getReceipts,

    getReceiptById:
      getReceiptById,

    getReceiptByNumber:
      getReceiptByNumber,

    addReceipt:
      addReceipt,

    updateReceipt:
      updateReceipt,

    linkToFile:
      linkToFile,

    unlinkFromFile:
      unlinkFromFile,

    deleteReceipt:
      deleteReceipt,

    resetReceipts:
      resetReceipts

  };


  /* ==========================================
     INITIALIZE
     ========================================== */

  getReceipts();


  console.log(
    "Virtual e-Office Receipts loaded:",
    getReceipts()
  );


})();
