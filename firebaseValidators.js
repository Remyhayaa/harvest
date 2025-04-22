// 📁 utils/firebaseValidators.js
const productValidator = (data) => {
  const errors = [];
  
  // Required Fields
  if (!data.name) errors.push("Product name is required");
  if (data.price <= 0) errors.push("Price must be positive");
  
  // Stock Validation
  if (data.stock && !Number.isInteger(data.stock)) {
    errors.push("Stock must be an integer");
  }
  
  // Image URL Validation
  if (data.images) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    const invalidUrls = data.images.filter(url => !urlRegex.test(url));
    if (invalidUrls.length > 0) {
      errors.push(`Invalid image URLs: ${invalidUrls.join(', ')}`);
    }
  }
  
  return errors.length === 0 ? null : errors;
};

const orderValidator = (data) => {
  const errors = [];
  
  // Customer Info
  if (!data.customer?.phone?.match(/^\+256\d{9}$/)) {
    errors.push("Valid Ugandan phone number required (+256...)");
  }
  
  // Items Validation
  if (!data.items || data.items.length === 0) {
    errors.push("Order must contain at least one item");
  } else {
    data.items.forEach((item, index) => {
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be positive`);
      }
    });
  }
  
  return errors.length === 0 ? null : errors;
};