const fs = require('fs');
const { google } = require('googleapis');

const Google = {

    version: 'v4',

    loadCredFile: function(cred_path, key) {
        console.log('obtaining google credentials from file..');
        const content = fs.readFileSync(cred_path);
        const credentials = JSON.parse(content);
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

    loadTokenFile: function(token_path) {
        console.log('obtaining token from file..');
        const content = fs.readFileSync(token_path);
        const token = JSON.parse(content);
        this.setToken(token);
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

    getSheet: function() {
        if(!this.sheet) {
            const Sheet = require('./Sheet');
            const auth = this.getAuth();
            Sheet.init(auth);
            this.sheet = Sheet;
        }
        return this.sheet;
    },

};

module.exports = Google;
