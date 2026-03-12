const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Convert price string to number
    const price = +productPrice;
    
    // Read existing cart file
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      
      // If file exists, parse it
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      
      // Check if product already in cart
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      
      let updatedProduct;
      
      if (existingProduct) {
        // Product exists - increase quantity
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // New product - add with quantity 1
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      
      // Update total price
      cart.totalPrice = cart.totalPrice + price;
      
      // Save back to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
};
