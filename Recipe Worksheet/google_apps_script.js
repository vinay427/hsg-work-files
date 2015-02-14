//////////////////////////////////////////////
// This script sends confirmation email after a recipe submission (see linked parent spreadsheet) to both an admin (email listed below) and the recipe submitter (based on login during submission)
// All non-blank fields and a link to the spreadsheet are concatenated into the email message with a generic email subject
//////////////////////////////////////////////
// Created by Vinay Hiremath - Summer 2014 - University of Michigan
// Tutorial for original script: http://www.labnol.org/?p=20884
//////////////////////////////////////////////

function Initialize() { // Sets up trigger for script run on form submission
      var triggers = ScriptApp.getScriptTriggers();
      for(var i in triggers) {
        ScriptApp.deleteTrigger(triggers[i]);
      }
      ScriptApp.newTrigger("SendGoogleForm")
      .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
      .onFormSubmit()
      .create();
}

function shortenUrl(url) {
  var url = UrlShortener.Url.insert({
    longUrl: url
  });
  Logger.log('Shortened URL is "%s".', url.id);
  return url;
}

function SendGoogleForm(e) { // Gathers submission data and sends emails
      try // If below code fails, error is logged
      {
        var email = "lincook@umich.edu"; // Email of admin (CAN BE CHANGED)
        var emailClient = Session.getActiveUser().getEmail(); // Email of submitter extracted from form submission
        var subject = "Recipe Form Submission"; // Subject for email to admin
        var subjectClient = "Your Recipe Has Been Submitted" // Subject for email to submitter
        var s = SpreadsheetApp.getActiveSheet();
        var columns = s.getRange(1,1,1,s.getLastColumn()).getValues()[0];
        var tags = s.getRange(2,1,1,s.getLastColumn()).getValues()[0];
        var fields = ""; // To hold field submission data to add after shortened URL
        var url="https://preview.c9.io/vinay427/recipe_worksheet/index.html?";
        
        for ( var index in columns )
        {
          var key = columns[index];
          if ( e.namedValues[key] && (e.namedValues[key] != "") ) // Exclude blank fields from being sent
          { 
            fields += key + ': ' + e.namedValues[key] + "\n\n"; // Add fields to email to be sent to admin
          }        
          
          var keyTag = tags[index];
          if ( keyTag && (keyTag != "") ) // Exclude blank fields from being added
            url += keyTag + '=' + e.namedValues[key] + "&"; // Add fields to URL
        }
   
        var urlShort = shortenUrl(url); // Run URL shortener and set output to urlShort
        
        // Add 'urlShort' to 'message' for testing
        var message = "The shortened URL to access this response on the stylized form is: " + urlShort.id + "\n\n"; // Add shortened URL to message to be sent to admin
        
        message += "Link to Recipe Worksheet Spreadsheet: https://docs.google.com/a/umich.edu/spreadsheet/ccc?key=0ArdO0_xA00IZdFp1U2hOY0JGT1hQakJEcjhRU1BnZWc" + "\n\n"; // Add header to message to be sent to admin
        var messageClient = "Thank you for your recipe submission." + "\n\n"; // Add header to message to be sent to submitter
        
        message += fields; // Add the fields data to the message to be sent to the admin
        messageClient += fields; // Add the fields data to the message to be sent to the submitter

        MailApp.sendEmail(email, subject, message); // Send email to admin
        MailApp.sendEmail(emailClient, subjectClient, messageClient); // Send email to submitter
        
        s.getRange(e.range.getLastRow(),1,1,1).setValue(urlShort.id);

      } catch (e) {
        Logger.log(e.toString()); // Error is logged in case of fail
      }
}