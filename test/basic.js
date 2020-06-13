// load .env file
require('dotenv').config();

// Import Test Runner
const test = require('tap').test;

// Import Library
const Google = require('../lib/Google');


// Test Variables
let sheet;
let failed = false;

test('init google sheet', async function(t) {

    try {

        const credPath = process.env.CRED_PATH;
        t.ok(credPath, 'credential path present');

        const tokenPath = process.env.TOKEN_PATH;
        t.ok(tokenPath, 'token path present');

        Google.loadCredFile(credPath);
        t.ok(true, 'cred loaded');

        Google.loadTokenFile(tokenPath);
        t.ok(true, 'token loaded');
        
        sheet = Google.getSheet();
        t.ok(sheet, 'sheet created');

        t.end();
    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in initializing google sheet');
    }

});

// Creating & Writing to sheet
test('google sheet creation', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: writing');
        t.end();
    }

    try {

        await sheet.create('Test Sheet');
        await sheet.clear();
        await sheet.write([ 'Test', 'Sheet Creation' ]);
        await sheet.write([ 'Status', 'Success' ]);
        await sheet.write([ 'Date', new Date().toString() ]);
        await sheet.endWrite();
        t.ok(true, 'sheet created');
        t.end();

    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in creating/writing to google sheet');
    }

});

// Reading Sheet

test('reading google sheet', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: reading');
        t.end();
    }

    try {

        let rows = await sheet.read();
        t.ok(rows, 'rows retrieved');
        t.end();

    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in reading google sheet');
    }

});


// Trash the Sheet

test('trashing google sheet', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: trashing');
        t.end();
    }

    try {
        let fileId = sheet.id;
        let drive = Google.getDrive();
        await drive.trash(fileId);
        t.ok(true, 'sheet trashed');
        t.end();
    }
    catch (err) {
        t.ifError(err, 'error in trashing google sheet');
    }

});


// Creating & Deleting Sheet


