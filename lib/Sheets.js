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

    last_write_op: null,

    write: function(row) {
        this.batch_rows = this.batch_rows || [];
        this.batch_rows.push(row);
        if(this.batch_rows.length >= this.BATCH_SIZE) {
            this.batch_write(this.batch_rows);
            this.batch_rows = [];
        }
    },

    batch_write: async function(rows) {
        let sheets = this.sheets;
        if(this.last_batch_write_op) {
            await this.last_batch_write_op;
        }
        console.log(`writing to ${this.id} ${this.range} ${rows.length}`);
        this.last_batch_write_op = await sheets.spreadsheets.values.append({
            spreadsheetId: this.id,
            range: this.range,
            valueInputOption: 'USER_ENTERED',
            // insertDataOption: 'INSERT_ROWS',
            resource: {
                values: rows,
            }
        });
    },

    endWrite: async function() {
        if(this.batch_rows && this.batch_rows.length) {
            let op = this.batch_write(this.batch_rows);
            this.batch_rows = [];
            await op;
        }
    }

}


module.exports = Sheets;
