const fs = require('fs');
const { google } = require('googleapis');

const Google = {

    /**
    * loads credential file
    */
    loadCredFile: function(cred_path) {
        const content = fs.readFileSync(cred_path);
        const cred = JSON.parse(content);
        this.setCred(cred);
    },

    /**
    * sets credentials as an object
    */
    setCred: function(cred) {
        this.cred = cred;
    },

    /**
    * loads token file
    */
    loadTokenFile: function(token_path) {
        const content = fs.readFileSync(token_path);
        const token = JSON.parse(content);
        this.setToken(token);
    },

    /**
    * sets token as an object
    */
    setToken: function(token) {
        if(token != this.token) {
            this.token = token;
            this.auth = null;
            this.sheet = null;
            this.drive = null;
        }
    },

    getAuth: function() {
        if(!this.auth) {
            const sub_cred = this.cred.installed || this.cred.web;
            const { client_secret, client_id, redirect_uris } = sub_cred;
            const auth = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]
            );
            auth.setCredentials(this.token);
            this.auth = auth;
        }
        return this.auth;
    },

    /**
    * get Sheet object.
    * internally initializes the google auth
    * and then create and initializes Sheet object.
    */
    getSheet: function() {
        if(!this.sheet) {
            const Sheet = require('./Sheet');
            const auth = this.getAuth();
            Sheet.init(this, auth);
            this.sheet = Sheet;
        }
        return this.sheet;
    },

    /**
    * get Drive object.
    * internally initializes the google auth
    * and then create and initializes Drive object.
    */
    getDrive: function() {
        if(!this.drive) {
            const Drive = require('./Drive');
            const auth = this.getAuth();
            Drive.init(this, auth);
            this.drive = Drive;
        }
        return this.drive;
    },

};

module.exports = Google;
