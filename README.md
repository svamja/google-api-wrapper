# Google API Wrapper

Simple Wrapper around Google Sheets &amp; Drive APIs

    npm install google-api-wrapper

This will add googleapis as dependency.


    const Google = require('google-api-wrapper');
    
    async main() {
      Google.setCred(cred);
      Google.setToken(token);
      const sheets = Google.getSheets();
      const rows = await sheets.read('1nZqgw5otHxvg7by-qnYmjkyNdHAPQYgduv7Tbf5aKlw');
      console.log(rows);
    }
