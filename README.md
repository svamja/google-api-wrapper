# Google API Wrapper

## Install
Simple Wrapper around Google Sheets &amp; Drive APIs

    npm install google-api-wrapper

This will add googleapis as dependency.

## Basic Usage

    const Google = require('google-api-wrapper');
    
    async main() {
      Google.setCred(cred);
      Google.setToken(token);
      const sheets = Google.getSheets();
      const rows = await sheets.read('1nZqgw5otHxvg7by-qnYmjkyNdHAPQYgduv7Tbf5aKlw');
      console.log(rows);
    }

## Reading

    await sheets.read(id, range = 'Sheet1');
    
Returns two-dimensional array of rows and column values of sheet data.

## Writing

    sheets.set(id, range = 'Sheet1');
    sheets.write(row);
    sheets.endWrite();
    
Batches up multiple rows and then write once at interval of 500 rows, or when endWrite() is called.




