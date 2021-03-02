# Google API Wrapper

## Install
Simple Wrapper around Google Sheets &amp; Drive APIs

    npm install google-api-wrapper

This will add googleapis as dependency.

## Basic Usage

    const Google = require('google-api-wrapper');
    
    async function main() {
      Google.loadCredFile('/path/to/credentails.json');
      Google.loadTokenFile('/path/to/token.json');
      const Sheet = Google.getSheet();
      const rows = await Sheet.read('1nZqgw5otHxvg7by-qnYmjkyNdHAPQYgduv7Tbf5aKlw');
      console.log(rows);
    }
    
    main();

## Initializing Auth

If you already have auth object

    Googe.setAuth(authObject);

Or, set credential file followed by token

    Google.loadCredFile('/path/to/credentails.json');
    Google.loadTokenFile('/path/to/token.json');

Or, set them directly from json objects

    Google.setCred(cred);
    Google.setToken(token);

Or, exchange token provided from OAuth

    Google.setCred(cred);
    let token = await Google.exchangeCode(code);

Or, set refresh token

    Google.setCred(cred);
    Google.setRefreshToken(refresh_token);


## Reading Sheet

Sheet object maintains an internal sheetId and range.

    const Sheet = Google.getSheet();
    await Sheet.read(id, range = 'Sheet1');

It two-dimensional array of rows and column values of sheet data.
Alternatively, you can set id and range separately.

    Sheet.set(id, range)
    await Sheet.read();

To assume first column as header and read documents:

    await Sheet.readDocs(id, range = 'Sheet1');
    await Sheet.readDocs(sheet_name, range, { byName: false, slugify: true });

Returns an array of objects by using first row as field names. 
"slugify" will convert field names to snake case (eg: "Min. Qty" to "min_qty")

## Writing to Sheet

    const Sheet = Google.getSheet();
    Sheet.set(id, range); // range defaults to 'Sheet1', if not provided
    await Sheet.clear(); // clears the range / sheet tab
    await Sheet.write(row1);
    await Sheet.write(row2);
    await Sheet.endWrite();
    
Batches up multiple rows and then appends at once at interval of 500 rows, or when endWrite() is called.
You must make a final call to endWrite to 

## Creating Sheet

    const Sheet = Google.getSheet();
    await Sheet.create(name);
    await Sheet.write([ 'hello', 'there' ]);
    await Sheet.create(name, folderId);

## Get File Info by Id
    
    const Drive = Google.getDrive();
    const file = Drive.byId(fileId);

It returns a file object with `{ id, name, mimeType }` attributes.

## Get File Info by Name

    Drive.byName(name, type = null, folderId = null);

Example:

    const Drive = Google.getDrive();
    let file;
    file = Drive.byName('My Document');
    file = Drive.byName('example.csv', 'type/csv', parentFolderId);
    file = Drive.byName('Example', null, parentFolderId);

It returns a file object with `{ id, name, mimeType }` attributes.

## List Files in a Folder

    Drive.list(folderId);

Example: to list all files under a folder named "My Folder"

    const Drive = Google.getDrive();
    const folder = Drive.byName('My Folder');
    const files = Drive.list(folder.id);

It returns an array of file objects with `{ id, name, mimeType }` attributes.

## Reading File (Raw)

    const Drive = Google.getDrive();
    await Drive.readFile(id);
    
Returns string of file content.

## Copy File

    const Drive = Google.getDrive();
    await Drive.copy(fileId, newName);

## Move File

    const Drive = Google.getDrive();
    await Drive.move(fileId, folderId);

## Unwrapping - Accessing underlying Google API Resources

Drive object holds reference to Google API's drive object as a property. So 
to call the methods of 
[Google Drive API](https://developers.google.com/drive/api/v3/reference).

For example, to list comments on a document named 'My Document', follow below

    const Google = require('google-api-wrapper');
    const Drive = Google.getDrive();
    const file = Drive.byName('My Document');
    // Below is call to underlying Google Drive API's method directly
    const comments = Drive.drive.comments.list({ fileId: file.id });

Similarly, Google Sheet object is stored as sheet property of wrapper's sheet object.
methods on sheet.sheet can be made as per
[Google Sheet API](https://developers.google.com/sheets/api/reference/rest).

    const Google = require('google-api-wrapper');
    const Sheet = Google.getSheet();
    // Calls underlying Google Sheet API
    Sheet.sheet.spreadsheets.batchGet(options);



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


