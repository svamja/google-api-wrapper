const test = require('tap').test;
const Google = require('../lib/Google');
let sheet;

test('google sheet reading tests', async function(t) {

    try {

        const cred_path = process.env.CRED_PATH;
        t.ok(cred_path, 'credential path present');

        const token_path = process.env.TOKEN_PATH;
        t.ok(token_path, 'token path present');

        Google.loadCredFile(cred_path);
        t.ok(true, 'cred loaded');

        Google.loadTokenFile(token_path);
        t.ok(true, 'token loaded');
        
        sheet = Google.getSheet();
        t.ok(sheet, 'sheet created');

        let rows = await sheet.read('1nZqgw5otHxvg7by-qnYmjkyNdHAPQYgduv7Tbf5aKlw');
        t.ok(rows, 'rows retrieved');
        t.end();

    }
    catch (err) {
        t.ifError(err, 'Error in Reading Google Sheet');
    }

});

test('google sheet writing tests', async function(t) {

    try {

        const sheet_id = process.env.SHEET_ID;
        t.ok(sheet_id, 'sheet id present');

        sheet.set(sheet_id);
        await sheet.write([ 'Hello', 'Test' ]);
        await sheet.endWrite();
        t.ok(true, 'one row written');
        t.end();

    }
    catch (err) {
        t.ifError(err, 'error in writing to google sheet');
    }

});

