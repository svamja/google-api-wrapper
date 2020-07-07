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
        let files = [];
        let pageToken = null;
        let listOptions = {
            q: `'${folderId}' in parents`,
            fields: 'files(id,name,trashed)'
        };
        while(true) {
            if(pageToken) {
                listOptions['pageToken'] = pageToken;
            }
            let response = await this.drive.files.list(listOptions);
            if(!response.data.files || !response.data.files.length) {
                break;
            }
            let limitReached = false;
            for(let file of response.data.files) {
                if(file.trashed) {
                    continue;
                }
                delete(file.trashed);
                files.push(file);
                if(files.length >= limit) {
                    limitReached = true;
                    break;
                }
            }
            pageToken = response.data.nextPageToken;
            if(limitReached || !pageToken) {
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
        const fields = 'id,name,parents';
        const response = await this.drive.files.get({ fileId, fields });
        let updateOptions = { fileId, addParents: folderId };
        if(response.data.parents) {
            updateOptions['removeParents'] = response.data.parents.join(',');
        }
        await this.drive.files.update(updateOptions);
        return true;
    },

    trash: async function(fileId) {
        response = await this.drive.files.update({ fileId, resource: { trashed: true } });
        return true;
    },

    delete: async function(fileId) {
        await this.drive.files.delete({ fileId });
        return true;
    },

}

module.exports = Drive;
