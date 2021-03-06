// load .env file
require('dotenv').config();

// Import Test Runner
const test = require('tap').test;

// Import Library
const Google = require('../lib/Google');


// Test Variables
let Sheet, Drive, folder;
let failed = false;

test('init google api wrapper', async function(t) {

    try {

        const credPath = process.env.CRED_PATH;
        t.ok(credPath, 'credential path present');

        const tokenPath = process.env.TOKEN_PATH;
        t.ok(tokenPath, 'token path present');

        Google.loadCredFile(credPath);
        t.ok(true, 'cred loaded');

        Google.loadTokenFile(tokenPath);
        t.ok(true, 'token loaded');
        
        Sheet = Google.getSheet();
        t.ok(Sheet, 'sheet object created');

        Drive = Google.getDrive();
        t.ok(Drive, 'drive object created');

        t.end();
    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in initializing google api wrapper');
        console.log(err);
    }

});

// Create Folder

test('create folder', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: create folder');
        t.end();
    }

    try {
        folder = await Drive.create('Google API Wrapper Test Folder', 'folder');
        t.ok(folder.id, 'folder created');
        t.end();
    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in create folder');
        console.log(err);
    }

});

// Creating & Writing to sheet
test('create sheet', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: writing');
        t.end();
    }

    try {

        await Sheet.create('Google API Wrapper Test Sheet', folder.id);
        await Sheet.clear();
        await Sheet.write([ 'Label', 'Value' ]);
        await Sheet.write([ 'Test', 'Sheet Creation' ]);
        await Sheet.write([ 'Origination', 'google-api-wrapper/test/basic.js' ]);
        await Sheet.write([ 'Status', 'Success' ]);
        await Sheet.write([ 'Date', new Date().toString() ]);
        await Sheet.endWrite();
        t.ok(true, 'sheet created');
        t.end();

    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in creating/writing to google sheet');
        console.log(err);
    }

});

// Reading Sheet

test('read sheet', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: reading');
        t.end();
    }

    try {

        let docs = await Sheet.readDocs(null, null, { slugify: true });
        t.ok(docs, 'docs retrieved');
        t.ok(docs.length && docs.length > 2, 'docs present');
        t.ok(docs[0].label == 'Test', 'doc value checked');
        t.end();

    }
    catch (err) {
        failed = true;
        t.ifError(err, 'error in reading google sheet');
        console.log(err);
    }

});

test('create sub-folder', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: create sub-folder');
        t.end();
    }

    try {
        await Drive.create('Google API Wrapper Test - Sub Folder', 'folder', null, folder.id);
        t.ok(true, 'sub-folder created');
        t.end();
    }
    catch (err) {
        console.log(err);
        failed = true;
        t.ifError(err, 'error in create sub-folder');
    }

});

test('list folder', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: list folder');
        t.end();
    }

    try {
        let files = await Drive.list(folder.id);
        t.ok(files, 'folder listing done');
        t.ok(files.length === 2, 'folder contains 2 files');
        t.end();
    }
    catch (err) {
        console.log(err);
        failed = true;
        t.ifError(err, 'error in list folder');
    }

});



test('trash folder', async function(t) {

    if(failed) {
        t.ok(false, 'skipping test: trash folder');
        t.end();
    }

    try {
        await Drive.trash(folder.id);
        t.ok(true, 'folder trashed');
        t.end();
    }
    catch (err) {
        console.log(err);
        failed = true;
        t.ifError(err, 'error in trash folder');
    }

});

