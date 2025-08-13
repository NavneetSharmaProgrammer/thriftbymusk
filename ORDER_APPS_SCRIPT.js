/**
 * =================================================================================
 *  Thrift by Musk - Google Apps Script for Automated Order Management
 * =================================================================================
 *
 * This script is designed to be deployed as a Google Apps Script Web App.
 * It listens for POST requests from the website's checkout form, parses the
 * order data, and logs it into a designated Google Sheet.
 *
 * --- SETUP INSTRUCTIONS ---
 * 1.  Open your Google Sheet that contains your products.
 * 2.  Go to Extensions > Apps Script.
 * 3.  Delete any existing code in the `Code.gs` file.
 * 4.  Copy this entire file's content and paste it into the editor.
 * 5.  Save the project (File > Save or Ctrl+S).
 * 6.  Click "Deploy" > "New deployment".
 * 7.  Click the gear icon and select "Web app".
 * 8.  Configure the deployment:
 *     - Description: "Thrift by Musk Order Form"
 *     - Execute as: "Me"
 *     - Who has access: "Anyone" (This is crucial for the website to be able to send data).
 * 9.  Click "Deploy".
 * 10. Authorize the script when prompted. You may need to go to "Advanced" and "Go to... (unsafe)".
 * 11. Copy the "Web app URL" provided after deployment.
 * 12. Paste this URL into the `GOOGLE_APPS_SCRIPT_URL` variable in your website's `constants.ts` file.
 *
 * =================================================================================
 */

// The main function that handles incoming POST requests from the website.
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait up to 30 seconds for other processes to finish.

  try {
    // Open the spreadsheet that this script is bound to.
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');

    // If the "Orders" sheet doesn't exist, create it and set up headers.
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
      var headers = [
        'Timestamp', 'Customer Name', 'Phone', 'Address', 'City', 'State', 'Pincode',
        'Items (ID)', 'Items (Name)', 'Items (Size)', 'Items (Price)', 'Total Amount'
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // Parse the JSON data sent from the website's checkout form.
    // The data is now sent as a plain text string in the request body.
    var orderData = JSON.parse(e.postData.contents);
    var customer = orderData.customerDetails;
    var items = orderData.cartItems;

    // Format the order items into strings for logging in the sheet.
    var itemIds = items.map(function(item) { return item.id; }).join(',\n');
    var itemNames = items.map(function(item) { return item.name; }).join(',\n');
    var itemSizes = items.map(function(item) { return item.size; }).join(',\n');
    var itemPrices = items.map(function(item) { return item.price; }).join(',\n');
    
    // Calculate the total price of the order.
    var total = items.reduce(function(sum, item) { return sum + item.price; }, 0);

    // Create the new row to be appended to the sheet.
    var newRow = [
      new Date(),
      customer.name,
      customer.phone,
      customer.address,
      customer.city,
      customer.state,
      customer.pincode,
      itemIds,
      itemNames,
      itemSizes,
      itemPrices,
      total
    ];
    
    // Append the new row to the "Orders" sheet.
    sheet.appendRow(newRow);

    // Return a success response to the website.
    // This response is mainly for debugging; the website will proceed on a successful request.
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'data': JSON.stringify(orderData) }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // If an error occurs, log it and return an error response to the website.
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    // Always release the lock to allow other processes to run.
    lock.releaseLock();
  }
}