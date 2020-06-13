const { google } = require('googleapis');

const Drive = {

    /**
    * initialize the Drive object (internal)
    * it creates google api's drive object with the provided auth
    * this is internally called by Google module through getDrive().
    */
    init: function(auth) {
        this.drive = google.drive({ version: 'v3', auth });
    },

    /**
    * lists files under a folder
    */
    list: async function(folderId, limit = 100) {
        let response;
        let files = [];
        let pageToken = null;
        let listOptions = {
            q: `'${folderId}' in parents`
        };
        while(true) {
            if(pageToken) {
                listOptions['pageToken'] = pageToken;
            }
            response = await this.drive.files.list(listOptions);
            files = files.concat(response.data.files);
            if(files.length >= limit) {
                break;
            }
            pageToken = response.data.nextPageToken;
            if(!pageToken) {
                break;
            }
        }
        return files;
    },

    /**
    * move file to a folder
    * this also removes the file from all other folders
    */
    move: async function(fileId, folderId) {
        const fields = 'parents';
        const file = await this.drive.files.get({ fileId, fields });
        let updateOptions = { fileId, addParents: folderId };
        if(file.parents) {
            updateOptions['removeParents'] = file.parents.join(',');
        }
        await this.drive.files.update(updateOptions);
        return true;
    },

    trash: async function(fileId) {
        response = await this.drive.files.update({ fileId, trashed: true });
        return true;
    },

    delete: async function(fileId) {
        await this.drive.files.delete({ fileId });
        return true;
    },

}

module.exports = Drive;
