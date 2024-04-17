require('dotenv').config();
const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes:('https://www.googleapis.com/auth/spreadsheets')
})

module.exports = async (req, res) => {
    const sheets = google.sheets({version:'v4', auth});
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const valueInputOption = 'USER_ENTERED';
    const resource = {values: req.body.values};

    try {
        // Get the data from the sheet
        const getResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1'
        });

        // Find the next available row
        const nextRow = getResponse.data.values ? getResponse.data.values.length + 1 : 1;

        // Update the range to the next available row
        const range = `Sheet1!A${nextRow}`;

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId, range, valueInputOption, resource
        });
        res.status(200).json(response.data);
    } catch(error) {
        console.error('error', error);
        res.status(500).send(error);
    }
};