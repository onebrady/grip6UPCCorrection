// In-memory storage for serverless function
// Note: This data will be lost when the function cold starts, but it's the best option for Vercel
let syncData = {
  products: [],
  editedProducts: [],
  lastUpdated: Date.now(),
};

module.exports = function handler(req, res) {
  console.log('API request received:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      console.log('Handling GET request');
      console.log('Returning data:', {
        productsCount: syncData.products?.length || 0,
        editedProductsCount: syncData.editedProducts?.length || 0,
        lastUpdated: syncData.lastUpdated,
      });
      res.status(200).json({
        success: true,
        data: {
          products: syncData.products || [],
          editedProducts: syncData.editedProducts || [],
          lastUpdated: syncData.lastUpdated || Date.now(),
        },
      });
    } else if (req.method === 'POST') {
      console.log('Handling POST request');
      // Update data
      const { products, editedProducts } = req.body;
      console.log('Received data:', {
        productsCount: products?.length || 0,
        editedProductsCount: editedProducts?.length || 0,
      });

      // Update in-memory data
      syncData = {
        products: products || [],
        editedProducts: editedProducts || [],
        lastUpdated: Date.now(),
      };

      console.log('Data saved successfully in memory');
      console.log('Current sync data:', {
        productsCount: syncData.products.length,
        editedProductsCount: syncData.editedProducts.length,
        lastUpdated: syncData.lastUpdated,
      });

      res.status(200).json({
        success: true,
        message: 'Data updated successfully',
        data: {
          productsCount: syncData.products.length,
          editedProductsCount: syncData.editedProducts.length,
          lastUpdated: syncData.lastUpdated,
        },
      });
    } else {
      console.log('Method not allowed:', req.method);
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
};
