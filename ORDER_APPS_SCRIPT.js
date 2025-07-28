/**
 * =================================================================================
 *  Thrift by Musk - Google Apps Script for Order Management
 * =================================================================================
 * 
 * This script handles order submissions from the website and logs them into a
 * Google Sheet.
 *
 * --- SETUP INSTRUCTIONS ---
 * 1.  Open the Google Sheet that you use for your products.
 * 2.  In the menu, go to Extensions > Apps Script.
 * 3.  Delete any code in the `Code.gs` file and paste this entire script.
 * 4.  **IMPORTANT:** At the top of the script, replace 'YOUR_GOOGLE_SHEET_ID_HERE'
 *     with your actual Google Sheet ID. You can find this in your sheet's URL
 *     (it's the long string of characters between "/d/" and "/edit").
 * 5.  Save the project (File > Save or Ctrl+S).
 * 6.  Deploy the script as a Web App:
 *     a. Click the "Deploy" button > "New deployment".
 *     b. For "Select type", choose "Web app".
 *     c. In the configuration:
 *        - Description: "Thrift by Musk Order Handler"
 *        - Execute as: "Me (your.email@gmail.com)"
 *        - Who has access: "Anyone"
 *     d. Click "Deploy".
 *     e. Authorize the script when prompted. You may see a "Google hasn't verified this app"
 *        warning. Click "Advanced" and then "Go to (unsafe)". This is normal for
 *        your own scripts.
 * 7.  After deployment, copy the "Web app URL" provided.
 * 8.  Paste this URL into the `GOOGLE_APPS_SCRIPT_URL` variable in your website's
 *     `constants.ts` file.
 */

// !!! IMPORTANT: REPLACE WITH YOUR GOOGLE SHEET ID !!!
var SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
var ORDERS_SHEET_NAME = "Orders";

/**
 * Handles HTTP POST requests from the website's checkout form.
 * @param {Object} e The event parameter for a POST request.
 * @return {ContentService.TextOutput} A JSON response indicating success or failure.
 */
function doPost(e) {
  try {
    // Open the spreadsheet and the specific sheet for orders.
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(ORDERS_SHEET_NAME);

    // If the "Orders" sheet doesn't exist, create it and add headers.
    if (!sheet) {
      sheet = spreadsheet.insertSheet(ORDERS_SHEET_NAME);
      sheet.appendRow([
        "Timestamp", "Status", "Customer Name", "Phone", "Address", "Total", "Items"
      ]);
      // Make headers bold
      sheet.getRange("A1:G1").setFontWeight("bold");
    }

    // Parse the JSON data from the request body.
    var orderData = JSON.parse(e.postData.contents);
    var customer = orderData.customerDetails;
    var items = orderData.cartItems;
    var total = orderData.total;

    // Format the items for display in a single cell.
    var itemsString = items.map(function(item) {
      return item.name + " (ID: " + item.id + ", Size: " + item.size + ", Price: ₹" + item.price + ")";
    }).join("\n");
    
    var address = customer.address + ", " + customer.city + ", " + customer.state + " - " + customer.pincode;

    // Append the new order as a row in the sheet.
    sheet.appendRow([
      new Date(),       // Timestamp
      "New",            // Status
      customer.name,    // Customer Name
      customer.phone,   // Phone
      address,          // Full Address
      total,            // Total
      itemsString       // Items
    ]);
    
    // Return a success response.
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Order placed successfully.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging.
    Logger.log(error.toString());

    // Return an error response.
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Failed to place order: ' + error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}