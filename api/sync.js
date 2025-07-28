import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "sync-data.json");

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({
      products: [],
      editedProducts: [],
      lastUpdated: Date.now(),
    })
  );
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      // Read current data
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      res.status(200).json({
        success: true,
        data: {
          products: data.products || [],
          editedProducts: data.editedProducts || [],
          lastUpdated: data.lastUpdated || Date.now(),
        },
      });
    } else if (req.method === "POST") {
      // Update data
      const { products, editedProducts } = req.body;

      const newData = {
        products: products || [],
        editedProducts: editedProducts || [],
        lastUpdated: Date.now(),
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));

      res.status(200).json({
        success: true,
        message: "Data updated successfully",
      });
    } else {
      res.status(405).json({ success: false, error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
}
