import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "database.json");

// Synchronous read and write functions using fs.readFileSync and fs.writeFileSync
export const readData = () => {
  const jsonData = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(jsonData);
};

export const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
};


