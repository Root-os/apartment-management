// utils/normalizeUnit.js
export const normalizeUnit = (unit) => {
  const u = { ...unit };

  // Normalize fields that might come as JSON strings
  const arrayFields = ["availableEquipments", "problems", "images"];

  arrayFields.forEach((key) => {
    if (typeof u[key] === "string") {
      try {
        u[key] = JSON.parse(u[key]);
      } catch {
        u[key] = [];
      }
    }
    if (!Array.isArray(u[key])) {
      u[key] = [];
    }
  });

  return u;
};
