# Google API Wrapper

## Install
Simple Wrapper around Google Sheets &amp; Drive APIs

    npm install google-api-wrapper

This will add googleapis as dependency.

## Basic Usage

    const Google = require('google-api-wrapper');
    
    async function main() {
      Google.setCred(cred);
      Google.setToken(token);
      const sheet = Google.getSheet();
      const rows = await sheet.read('1nZqgw5otHxvg7by-qnYmjkyNdHAPQYgduv7Tbf5aKlw');
      console.log(rows);
    }
    
    main();

## Set Credentials

    Google.loadCredFile(credentails.json);
    Google.loadTokenFile(token.json);

Or,

    Google.setCred(cred);
    Google.setToken(token);

## Reading Sheet

    await sheet.read(id, range = 'Sheet1');
    
Returns two-dimensional array of rows and column values of sheet data.

## Writing Sheet

    sheet.set(id, range = 'Sheet1');
    await sheet.clear();
    await sheet.write(row1);
    await sheet.write(row2);
    await sheet.endWrite();
    
Batches up multiple rows and then write once at interval of 500 rows, or when endWrite() is called.

## Creating Sheet

    await sheet.create(name);
    await sheet.write([ 'hello', 'there' ]);
    await sheet.create(name, folderId);

## Reading File (Raw)

    const drive = Google.getDrive();
    await drive.readFile(id);
    
Returns string of file content.

## Move File

    const drive = Google.getDrive();
    await drive.move(fileId, folderId);


## Testing

To test the package,

1. Create / download credentails.json file from Google Console.
2. After OAuth2, capture the token returned in token.json file.
3. Create .env file with path to these two files as below

```
# .env file
CRED_PATH=/path/to/credentials.json
TOKEN_PATH=/path/to/token.json
```

4. run `npm test`


