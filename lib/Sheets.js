const { google } = require('googleapis');

const Sheets = {

    BATCH_SIZE: 500,

    init: function(auth) {
        this.sheets = google.sheets({ version: 'v4', auth});
    },

    create: async function(name) {

    },

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

    set: function(id, range) {
        this.id = id;
        this.range = range || this.range || 'Sheet1';
    },

    clear: async function() {
        await this.sheets.spreadsheets.values.clear({
            spreadsheetId: this.id,
            range: this.range,
        });
    },

    write: async function(row) {
        this.batch_rows = this.batch_rows || [];
        this.batch_rows.push(row);
        if(this.batch_rows.length >= this.BATCH_SIZE) {
            await this.endWrite();
        }
    },

    endWrite: async function() {
        if(this.batch_rows && this.batch_rows.length) {
            let rows = this.batch_rows;
            this.batch_rows = [];
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


module.exports = Sheets;
