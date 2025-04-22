// 📁 firestore.schema.json (Conceptual Representation)
{
  "collections": {
    "products": {
      "documentId": "auto-generated",
      "fields": {
        "id": "string",          // GH-VEG-001
        "name": "string",        // Organic Sukuma Wiki
        "description": "string", // Locally grown...
        "price": "number",       // 2000 (UGX)
        "category": "string",   // "vegetables"
        "subcategory": "string",// "leafy-greens"
        "stock": "number",      // 15
        "images": "array",      // ["products/vegs/sukuma.jpg"]
        "tags": "array",        // ["organic", "seasonal"]
        "farm": "reference",    // /farms/farm_kampala
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "isActive": "boolean"   // Soft delete flag
      },
      "indexes": [
        ["category", "price"],
        ["tags", "createdAt"]
      ]
    },
    
    "orders": {
      "documentId": "auto-generated",
      "fields": {
        "orderNumber": "string",    // GH-ORD-2023-001
        "customer": {
          "userId": "reference|null", // /users/uid or null (guest)
          "name": "string",
          "phone": "string",       // +256712345678
          "email": "string|null",
          "district": "string",    // Kampala
          "deliveryNotes": "string"
        },
        "items": [{
          "productId": "reference", // /products/GH-VEG-001
          "name": "string",         // Redundant for readability
          "quantity": "number",
          "unitPrice": "number",    // Snapshot of price at purchase
          "total": "number"        // unitPrice * quantity
        }],
        "payment": {
          "method": "string",      // "mtn-momo", "visa"
          "status": "string",      // pending/paid/failed
          "transactionId": "string",
          "amount": "number",
          "receiptUrl": "string"   // Flutterwave receipt link
        },
        "delivery": {
          "status": "string",      // pending/dispatched/delivered
          "estimatedDate": "timestamp",
          "agent": "string"       // Delivery partner name
        },
        "subtotal": "number",
        "deliveryFee": "number",
        "total": "number",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      },
      "indexes": [
        ["customer.userId", "createdAt"],
        ["payment.status", "delivery.status"]
      ]
    },
    
    "users": {
      "documentId": "Firebase Auth UID",
      "fields": {
        "role": "string",         // customer/farmer/admin
        "name": "string",
        "phone": "string",
        "favoriteProducts": "[reference]", // [/products/id1, ...]
        "deliveryAddresses": [{
          "district": "string",
          "details": "string",
          "isDefault": "boolean"
        }],
        "createdAt": "timestamp",
        "lastLogin": "timestamp"
      }
    },
    
    "farms": {
      "documentId": "auto-generated",
      "fields": {
        "name": "string",         // Kampala Organic Farm
        "location": "geopoint",   // {lat: 0.3136, lng: 32.5811}
        "certifications": "[string]", // ["EU Organic", "UG-ORG-001"]
        "contactPerson": "string",
        "products": "[reference]"  // Links to /products
      }
    },
    
    "blogPosts": {
      "documentId": "slug",       // organic-farming-uganda
      "fields": {
        "title": "string",
        "author": "reference",    // /users/uid
        "content": "string",      // Markdown/HTML
        "excerpt": "string",
        "categories": "[string]", // ["farming", "recipes"]
        "readTime": "number",     // Minutes
        "featuredImage": "string", // URL
        "publishedAt": "timestamp",
        "isFeatured": "boolean"
      }
    }
  }
}