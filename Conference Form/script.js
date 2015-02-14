///////////////////////////////////////////////////////////////
// This Google Apps Script displays a form.html file upload form with support for five simulatenous uploads.
// The uploads are uploaded to a chosen Google Drive folder, and links are emailed to an admin along with
// the field inputs of an accompanying form entry
///////////////////////////////////////////////////////////////

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html'); // Return the 'form.html' file to the frontend (display upload inputs)
}

function uploadFiles(form) {
  
  try {
    
    // Initiate variables for folder names
    var dropbox = "Conference Form (Files)";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    var urls = "";
    
    // Check if the folder exists, and create it if not
    if (folders.hasNext()) {
      folder = folders.next();
    }
    else {
      folder = DriveApp.createFolder(dropbox);
    }
    
    // Save form file outputs as blobs
    var blob1 = form.file1;
    var blob2 = form.file2;
    var blob3 = form.file3;
    var blob4 = form.file4;
    var blob5 = form.file5;

    // If the blob is not empty, upload it and append the URL to 'urls'
    if (blob1.getDataAsString() != "") {
      var file1 = folder.createFile(blob1);
      urls += file1.getUrl() + "\n\n"; // 'urls' needs to be declared with 'var' here to be used as it is a global variable
    }
    if (blob2.getDataAsString() != "") {
      var file2 = folder.createFile(blob2);
      urls += file2.getUrl() + "\n\n";
    }
    if (blob3.getDataAsString() != "") {
      var file3 = folder.createFile(blob3);
      urls += file3.getUrl() + "\n\n";
    }
    if (blob4.getDataAsString() != "") {
      var file4 = folder.createFile(blob4);
      urls += file4.getUrl() + "\n\n";
    }
    if (blob5.getDataAsString() != "") {
      var file5 = folder.createFile(blob5);
      urls += file5.getUrl() + "\n\n";  
    }    
    
    var user = PropertiesService.getUserProperties();
    user.setProperty('urls',urls);
    
    // Output the success message and URLs
    return "Files successfully uploaded.\n";
   
  }
  

  // If there is an error in the 'try' portion, return an error
  catch (error) {    
    return error.toString();
  }
  
}

///////////////////////////////////////////////////////////////

function sendEmail(e) {
  
  try // If below code fails, error is logged
      {
        var email = "hsg-nutrition10@umich.edu"; // Email of admin (CAN BE CHANGED)
        var email2 = "hsg-nutrition12@umich.edu"; // ..and of admin (2)
        var email3 = "hsg-mealplans@umich.edu"; // ..and of admin (3)
        //  var emailClient = Session.getActiveUser().getEmail(); // Email of submitter extracted from form submission
        var subject = "Conference Form Submission"; // Subject for email to admin
        var s = SpreadsheetApp.getActiveSheet();
        var columns = s.getRange(1,1,1,s.getLastColumn()).getValues()[0];
        var fields = "", key, urls = "";
        
        var user = PropertiesService.getUserProperties();
        urls = user.getProperty('urls');
        
        for ( var i in columns )
        {
          key = columns[i];
          if ( e.namedValues[key] && (e.namedValues[key] != "") ) // Exclude blank fields from being sent
            fields += key + ': ' + e.namedValues[key] + "\n\n";   // Add fields to email to be sent to admin     
        }
        
        var message = fields + urls;
        
        MailApp.sendEmail(email, subject, message); // Send email to admin
        MailApp.sendEmail(email2, subject, message); // ..and admin (2)
        MailApp.sendEmail(email3, subject, message); // ..and admin (3)
        
        user.setProperty('urls', ''); // Empty property 'urls' to avoid repeat sending of previous 'urls' value
  }
  
  catch (e) {
        Logger.log(e.toString()); // Error is logged in case of fail
  }
}
  


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

/*


function doGet(e) {
  
  var app = UiApp.createApplication().setTitle("File Uploader");
  var form = app.createFormPanel().setId('frm').setEncoding('multipart/form-data');
  
  var formContent = app.createVerticalPanel();
  form.add(formContent);  
  formContent.add(app.createFileUpload().setName('file1'));
  formContent.add(app.createFileUpload().setName('file2'));
  formContent.add(app.createFileUpload().setName('file3'));
  formContent.add(app.createFileUpload().setName('file4'));
  formContent.add(app.createFileUpload().setName('file5'));
  formContent.add(app.createSubmitButton('Submit'));
  app.add(form);
  return app;
}

function doPost(e) {
  var folder = DocsList.getFolder('Conference Form (Files)');

  var fileBlob1 = e.parameter.file1; // Data returned are blobs for FileUpload widget
  var fileBlob2 = e.parameter.file2;
  var fileBlob3 = e.parameter.file3;
  var fileBlob4 = e.parameter.file4;
  var fileBlob5 = e.parameter.file5;
  
  var count = 5; // Count the number of successful file uploads by subtracting for each failed upload below
  try { var doc = folder.createFile(fileBlob1); }
  catch (e) { count--; }
    
  try { var doc = folder.createFile(fileBlob2); }
  catch (e) { count--; }
    
  try { var doc = folder.createFile(fileBlob3); }
  catch (e) { count--; }
    
  try { var doc = folder.createFile(fileBlob4); }
  catch (e) { count--; }
    
  try { var doc = folder.createFile(fileBlob5); }
  catch (e) { count--; }
  
  Logger.log(count);
  var app = UiApp.getActiveApplication();
  
  // Set and display a confirmation message
  // If..else to display correct output statement depending on number of files uploaded
  if (count == 0) { var label = app.createLabel('No files have been uploaded'); }
    else if (count == 1) { var label = app.createLabel('1 file has been uploaded'); }
    else if (count >= 2) { var label = app.createLabel(count + ' files have been uploaded'); }
    else { var label = app.createLabel('An unknown error has occurred'); }

  app.add(label);
  return app;
}


*/

///////////////////////////////////////////////////////////////

/*

function readRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
};

/*

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 
 
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Read Data",
    functionName : "readRows"
  }];
  spreadsheet.addMenu("Script Center Menu", entries);
};


*/