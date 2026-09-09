// ============================================
// Virtual e-Office - File Movement Management
// Learning / Training Simulator
// ============================================

const MOVEMENT_STORAGE_KEY = "virtualEOfficeMovements";

// Default sample movement history
const defaultMovements = [
  {
    id: "MOVE-2026-001",
    fileId: "FILE-2026-001",
    date: "2026-09-01",
    time: "10:30",
    action: "Created",
    fromUserId: null,
    toUserId: "renthlei",
    remarks: "e-File created from incoming receipt.",
    createdAt: "2026-09-01T10:30:00"
  },
  {
    id: "MOVE-2026-002",
    fileId: "FILE-2026-001",
    date: "2026-09-01",
    time: "11:00",
    action: "Note Added",
    fromUserId: "renthlei",
    toUserId: null,
    remarks: "Initial note added to the Note Sheet.",
    createdAt: "2026-09-01T11:00:00"
  }
];

function initializeMovements() {
  const existing = localStorage.getItem(MOVEMENT_STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(
      MOVEMENT_STORAGE_KEY,
      JSON.stringify(defaultMovements)
    );
  }
}

function getMovements() {
  initializeMovements();

  try {
    return JSON.parse(
      localStorage.getItem(MOVEMENT_STORAGE_KEY) || "[]"
    );
  } catch (error) {
    console.error("Error reading movements:", error);
    return [];
  }
}

function getMovementsByFile(fileId) {
  return getMovements()
    .filter(movement => movement.fileId === fileId)
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`);

      return dateA - dateB;
    });
}

function getLatestMovement(fileId) {
  const movements = getMovementsByFile(fileId);

  if (movements.length === 0) {
    return null;
  }

  return movements[movements.length - 1];
}

function addMovement(movementData) {
  const movements = getMovements();

  const movement = {
    id:
      movementData.id ||
      `MOVE-${new Date().getFullYear()}-${String(
        movements.length + 1
      ).padStart(3, "0")}`,

    fileId: movementData.fileId,

    date:
      movementData.date ||
      new Date().toISOString().split("T")[0],

    time:
      movementData.time ||
      new Date().toTimeString().slice(0, 5),

    action: movementData.action || "Processing",

    fromUserId: movementData.fromUserId || null,

    toUserId: movementData.toUserId || null,

    remarks: movementData.remarks || "",

    createdAt:
      movementData.createdAt ||
      new Date().toISOString()
  };

  movements.push(movement);

  localStorage.setItem(
    MOVEMENT_STORAGE_KEY,
    JSON.stringify(movements)
  );

  return movement;
}

function resetMovements() {
  localStorage.setItem(
    MOVEMENT_STORAGE_KEY,
    JSON.stringify(defaultMovements)
  );

  return getMovements();
}

// ============================================
// Public API
// ============================================

window.VirtualEOfficeMovements = {
  getMovements,
  getMovementsByFile,
  getLatestMovement,
  addMovement,
  resetMovements
};

// Initialize storage
initializeMovements();
