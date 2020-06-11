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
      const sheet = Google.getSheet();
      const rows = await sheet.read('1nZqgw5otHxvg7by-qnYmjkyNdHAPQYgduv7Tbf5aKlw');
      console.log(rows);
    }

## Reading

    await sheet.read(id, range = 'Sheet1');
    
Returns two-dimensional array of rows and column values of sheet data.

## Writing

    sheet.set(id, range = 'Sheet1');
    await sheet.clear();
    await sheet.write(row1);
    await sheet.write(row2);
    await sheet.endWrite();
    
Batches up multiple rows and then write once at interval of 500 rows, or when endWrite() is called.




