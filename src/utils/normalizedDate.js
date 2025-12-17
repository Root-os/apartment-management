const normalizeDate = (date) => {
  if (!date) return "";
  if (typeof date === "string" && date.includes("T")) {
    return date.split("T")[0];
  }
  return date;
};
export default normalizeDate;