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

## Get File Info by Id

    const drive = Google.getDrive();
    const file = drive.byId(fileId);

It returns a file object with `{ id, name, mimeType }` attributes.

## Get File Info by Name

    drive.byName(name, type = null, folderId = null);

Example:

    const drive = Google.getDrive();
    let file;
    file = drive.byName('My Document');
    file = drive.byName('example.csv', 'type/csv', parentFolderId);
    file = drive.byName('Example', null, parentFolderId);

It returns a file object with `{ id, name, mimeType }` attributes.

## List Files in a Folder

    drive.list(folderId);

Example: to list all files under a folder named "My Folder"

    const drive = Google.getDrive();
    const folder = drive.byName('My Folder');
    const files = drive.list(folder.id);

It returns an array of file objects with `{ id, name, mimeType }` attributes.

## Reading File (Raw)

    const drive = Google.getDrive();
    await drive.readFile(id);
    
Returns string of file content.

## Move File

    const drive = Google.getDrive();
    await drive.move(fileId, folderId);

## Unwrapping - Accessing underlying Google API Resources

drive object holds reference to Google API's drive object as a property. So 
to call the methods of 
[Google Drive API](https://developers.google.com/drive/api/v3/reference).

For example, to list comments on a document named 'My Document', follow below

    const Google = require('google-api-wrapper');
    const drive = Google.getDrive();
    const file = drive.byName('My Document');
    // Below is call to underlying Google Drive API's method directly
    const comments = drive.drive.comments.list({ fileId: file.id });

Similarly, Google Sheet object is stored as sheet property of wrapper's sheet object.
methods on sheet.sheet can be made as per
[Google Sheet API](https://developers.google.com/sheets/api/reference/rest).

    const Google = require('google-api-wrapper');
    const sheet = Google.getSheet();
    // Calls underlying Google Sheet API
    sheet.sheet.spreadsheets.batchGet(options);



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


