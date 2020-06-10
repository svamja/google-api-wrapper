const fs = require('fs');
const { google } = require('googleapis');
const Sheets = require('./Sheets');

const Google = {

    version: 'v4',

    loadCredFile: function(cred_path, key) {
        console.log('obtaining google credentials from file..');
        content = fs.readFileSync(cred_path);
        credentials = JSON.parse(content);
        let cred;
        if(key) {
            cred = credentials[key];
        }
        else {
            cred = credentials.installed || credentials.web;
        }
        this.setCred(cred);
    },

    setCred: function(cred) {
        this.cred = cred;
    },

    setToken: function(token) {
        this.token = token;
    },

    getAuth: function() {
        if(!this.auth) {
            const { client_secret, client_id, redirect_uris } = this.cred;
            const auth = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]
            );
            auth.setCredentials(this.token);
            this.auth = auth;
        }
        return this.auth;
    },

    getSheets: function() {
        if(!this.sheets) {
            const auth = this.getAuth();
            Sheets.init(auth);
            this.sheets = Sheets;
        }
        return this.sheets;
    },


};

module.exports = Google;
