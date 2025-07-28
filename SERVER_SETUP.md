# UPC Dashboard Server Setup

This guide helps you set up a simple server for multi-user collaboration on the UPC Dashboard.

## Quick Setup (Express.js)

1. **Create a new directory for the server:**

```bash
mkdir upc-dashboard-server
cd upc-dashboard-server
npm init -y
```

2. **Install dependencies:**

```bash
npm install express cors body-parser
npm install --save-dev @types/express @types/cors @types/body-parser
```

3. **Create `server.js`:**

```javascript
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "products.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (for simplicity)
let products = [];

// Load data from file on startup
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    products = JSON.parse(data);
  } catch (error) {
    console.log("No existing data file, starting fresh");
    products = [];
  }
}

// Save data to file
async function saveData() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// Routes
app.get("/api/products", (req, res) => {
  res.json({ products });
});

app.post("/api/products", async (req, res) => {
  try {
    products = req.body.products;
    await saveData();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch("/api/products/:handle/upc", async (req, res) => {
  try {
    const { handle } = req.params;
    const { upc } = req.body;

    const productIndex = products.findIndex((p) => p.Handle === handle);
    if (productIndex !== -1) {
      products[productIndex]["Variant Barcode"] = upc;
      await saveData();
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/products/sync", async (req, res) => {
  try {
    products = req.body.products;
    await saveData();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
loadData().then(() => {
  app.listen(PORT, () => {
    console.log(`UPC Dashboard Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
});
```

4. **Start the server:**

```bash
node server.js
```

5. **Update the dashboard environment:**
   Create a `.env` file in your UPC dashboard project:

```
VITE_API_URL=http://localhost:3001/api
```

## Alternative: Simple JSON Server

For even simpler setup, you can use `json-server`:

1. **Install json-server:**

```bash
npm install -g json-server
```

2. **Create `db.json`:**

```json
{
  "products": []
}
```

3. **Start json-server:**

```bash
json-server --watch db.json --port 3001
```

## Environment Variables

The dashboard will automatically try to connect to `http://localhost:3001/api` if no `VITE_API_URL` is set.

## Features

- **Real-time sync**: Updates every 30 seconds
- **Multi-user support**: Multiple users can work simultaneously
- **Conflict resolution**: Server data takes precedence
- **Offline support**: Works locally even if server is down
- **Error handling**: Graceful degradation when server is unavailable

## Security Notes

This is a basic setup for development. For production:

1. Add authentication
2. Use HTTPS
3. Implement proper data validation
4. Add rate limiting
5. Use a proper database (PostgreSQL, MongoDB, etc.)
6. Add logging and monitoring

## Troubleshooting

- **Server not starting**: Check if port 3001 is available
- **CORS errors**: Ensure the server is running and accessible
- **Sync not working**: Check browser console for network errors
- **Data not persisting**: Ensure the server has write permissions
