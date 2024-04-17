require('dotenv').config();
const {google} = require('googleapis');
const credentials = require('../config')

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes:('https://www.googleapis.com/auth/spreadsheets')
})

module.exports = async (req, res) => {
    const sheets = google.sheets({version:'v4', auth});
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const valueInputOption = 'USER_ENTERED';
    const resource = {values: req.body.values};

    // Set CORS headers - update * to your website when ready for prod
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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