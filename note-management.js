/* ======================================
   VIRTUAL e-OFFICE
   NOTE SHEET MANAGEMENT
   ====================================== */

(function () {

  const STORAGE_KEY = "virtualEOfficeNotes";


  /* ======================================
     DEFAULT SAMPLE NOTE
     ====================================== */

  const defaultNotes = [
    {
      id: "NOTE-2026-001",

      fileId: "FILE-2026-001",

      noteNo: 1,

      date: "2026-09-01",

      authorId: "renthlei",

      text:
        "The matter regarding the request for additional computer systems may be examined and necessary action may be taken.",

      createdAt: "2026-09-01T11:00:00"
    }
  ];


  /* ======================================
     INITIALIZE STORAGE
     ====================================== */

  function initializeNotes() {

    const existing =
      localStorage.getItem(STORAGE_KEY);

    if (!existing) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultNotes)
      );

    }

  }


  /* ======================================
     GET ALL NOTES
     ====================================== */

  function getNotes() {

    initializeNotes();

    try {

      return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || [];

    } catch (error) {

      console.error(
        "Unable to read notes:",
        error
      );

      return [];

    }

  }


  /* ======================================
     GET NOTE BY ID
     ====================================== */

  function getNoteById(noteId) {

    return getNotes().find(
      note => note.id === noteId
    ) || null;

  }


  /* ======================================
     GET NOTES BY FILE
     ====================================== */

  function getNotesByFile(fileId) {

    return getNotes()
      .filter(note => note.fileId === fileId)
      .sort((a, b) => {

        return a.noteNo - b.noteNo;

      });

  }


  /* ======================================
     GET NOTES BY USER
     ====================================== */

  function getNotesByUser(userId) {

    return getNotes()
      .filter(note => note.authorId === userId);

  }


  /* ======================================
     ADD NOTE
     ====================================== */

  function addNote(noteData) {

    const notes = getNotes();

    if (!noteData.fileId) {

      throw new Error(
        "File ID is required."
      );

    }

    if (!noteData.authorId) {

      throw new Error(
        "Author ID is required."
      );

    }

    if (!noteData.text ||
        !noteData.text.trim()) {

      throw new Error(
        "Note text is required."
      );

    }


    /* ======================================
       DETERMINE NEXT NOTE NUMBER
       ====================================== */

    const fileNotes =
      getNotesByFile(noteData.fileId);

    const nextNoteNo =
      fileNotes.length > 0
        ? Math.max(
            ...fileNotes.map(
              note => Number(note.noteNo) || 0
            )
          ) + 1
        : 1;


    /* ======================================
       CREATE NOTE ID
       ====================================== */

    const noteId =
      "NOTE-" +
      Date.now();


    /* ======================================
       CREATE NOTE
       ====================================== */

    const newNote = {

      id: noteId,

      fileId: noteData.fileId,

      noteNo:
        noteData.noteNo ||
        nextNoteNo,

      date:
        noteData.date ||
        new Date().toISOString().split("T")[0],

      authorId:
        noteData.authorId,

      text:
        noteData.text.trim(),

      createdAt:
        noteData.createdAt ||
        new Date().toISOString()

    };


    /* ======================================
       SAVE
       ====================================== */

    notes.push(newNote);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    );


    return newNote;

  }


  /* ======================================
     UPDATE NOTE
     ====================================== */

  function updateNote(noteId, updates) {

    const notes = getNotes();

    const index =
      notes.findIndex(
        note => note.id === noteId
      );

    if (index === -1) {

      throw new Error(
        "Note not found."
      );

    }


    notes[index] = {

      ...notes[index],

      ...updates,

      id: notes[index].id,

      fileId: notes[index].fileId,

      authorId: notes[index].authorId

    };


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    );


    return notes[index];

  }


  /* ======================================
     DELETE NOTE
     ====================================== */

  function deleteNote(noteId) {

    const notes = getNotes();

    const note =
      notes.find(
        item => item.id === noteId
      );

    if (!note) {
      return false;
    }


    const updatedNotes =
      notes.filter(
        item => item.id !== noteId
      );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedNotes)
    );


    return true;

  }


  /* ======================================
     RESET NOTES
     ====================================== */

  function resetNotes() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultNotes)
    );

    return getNotes();

  }


  /* ======================================
     PUBLIC API
     ====================================== */

  window.VirtualEOfficeNotes = {

    getNotes,

    getNoteById,

    getNotesByFile,

    getNotesByUser,

    addNote,

    updateNote,

    deleteNote,

    resetNotes

  };


  /* ======================================
     INITIALIZE
     ====================================== */

  initializeNotes();

})();
