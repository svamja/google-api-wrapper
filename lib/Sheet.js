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
    init: function(manager, auth) {
        this.manager = manager;
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
    * add a sheet tab to the spreadsheet
    */
    addSheet: async function(title) {
        let updateOptions = { addSheet: { properties: { title } } };
        let response = await this.sheets.spreadsheets.update(updateOptions);
        return this;
    },

    /**
    * create a spreadsheet. also makes it the current spreadsheet to read/write to.
    */
    create: async function(name, folderId) {
        let createOptions = { resource: { properties: { title: name } } };
        let response = await this.sheets.spreadsheets.create(createOptions);
        this.set(response.data.spreadsheetId);
        if(folderId) {
            const Drive = this.manager.getDrive();
            await Drive.move(this.id, folderId);
        }
        return this.id;
    },

    /**
    * read from a spreadsheet.
    * without id and range, it reads from the currently set id and range
    * with only id, it reads 'Sheet1'
    */
    read: async function(id, range, options) {
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
    * read from a spreadsheet.
    * similar to read(), but uses name to retrieve file from Drive.
    */
    readByName: async function(name, range) {
        const drive = this.manager.getDrive();
        const file = await drive.byName(name);
        if(!file || !file.id) {
            throw new Error('sheet not found: ' + name);
        }
        return await this.read(file.id, range);
    },

    readDocs: async function(id_or_name, range, options = {}) {
        const _ = require('lodash');
        let row;
        if(options.byName) {
            rows = await this.readByName(id_or_name, range);
        }
        else {
            rows = await this.read(id_or_name, range);
        }
        let header_row = rows.shift();
        if(options.slugify) {
            if(options.slugify === 'kebab') {
                header_row = header_row.map(_.kebabCase);
            }
            else {
                header_row = header_row.map(_.snakeCase);
            }
        }
        let docs = [];
        for(let row of rows) {
            let doc = _.zipObject(header_row, row);
            docs.push(doc);
        }
        return docs;
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
        return this;
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
        return this;
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

    overwrite: async function(rows) {
        let sheets = this.sheets;
        console.log(`overwriting to ${this.id} ${this.range} ${rows.length}`);
        await sheets.spreadsheets.values.update({
            spreadsheetId: this.id,
            range: this.range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: rows,
            }
        });
    },

}


module.exports = Sheet;
