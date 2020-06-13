const { google } = require('googleapis');

const Sheet = {

    /**
    * number of records to wait before writing to spreadsheet
    */
    batchSize: 500,

    /**
    * initialize the Sheet object (internal)
    * it creates google api's sheets object with the provided auth
    * this is internally called by Google module through getSheet().
    */
    init: function(auth) {
        this.auth = auth;
        this.sheets = google.sheets({ version: 'v4', auth});
    },

    /**
    * update batch size (number of records to wait before writing to spreadsheet)
    */
    setBatchSize: function(batchSize) {
        this.batchSize = batchSize;
    },

    /**
    * create a spreadsheet. also makes it the current spreadsheet to read/write to.
    */
    create: async function(name, options = { folderId: null, columns: 27 }) {
        let createOptions = { resource: { properties: { title: name } } };
        let response = await this.sheets.spreadsheets.create(createOptions);
        this.set(response.data.spreadsheetId);
        if(options.folderId) {
            const Drive = require('./Drive');
            Drive.init(this.auth);
            await Drive.move(this.id, options.folderId);
        }
        return this.id;
    },

    /**
    * read from a spreadsheet.
    * without id and range, it reads from the currently set id and range
    * with only id, it reads 'Sheet1'
    */
    read: async function(id, range) {
        this.set(id, range);
        let sheets = this.sheets;
        let res = await sheets.spreadsheets.values.get({
            spreadsheetId: this.id,
            range: this.range,
        });
        const rows = res.data.values;
        return rows;
    },

    /**
    * set id and range for reading and writing operations
    * range defaults to 'Sheet1' if not provided.
    */
    set: function(id, range) {
        this.id = id || this.id;
        this.range = range || this.range || 'Sheet1';
    },

    /**
    * clears the cells from currently set id and range
    */
    clear: async function() {
        await this.sheets.spreadsheets.values.clear({
            spreadsheetId: this.id,
            range: this.range,
        });
    },

    /**
    * batches up a row to write to sheet
    * actual write happens when either batchSize is met
    * or, endWrite() is called explicitly.
    */
    write: async function(row) {
        this.batchRows = this.batchRows || [];
        this.batchRows.push(row);
        if(this.batchRows.length >= this.batchSize) {
            await this.endWrite();
        }
    },

    /**
    * writes rows gathered in the current batch
    */
    endWrite: async function() {
        if(this.batchRows && this.batchRows.length) {
            let rows = this.batchRows;
            this.batchRows = [];
            await this.batchWrite(rows);
        }
    },

    batchWrite: async function(rows) {
        let sheets = this.sheets;
        console.log(`writing to ${this.id} ${this.range} ${rows.length}`);
        await sheets.spreadsheets.values.append({
            spreadsheetId: this.id,
            range: this.range,
            valueInputOption: 'USER_ENTERED',
            // insertDataOption: 'INSERT_ROWS',
            resource: {
                values: rows,
            }
        });
    },

}


module.exports = Sheet;
