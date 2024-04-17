require('dotenv').config();

const express = require('express');
const {google} = require('googleapis');
const app = express();
app.use(express.json());

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes:('https://www.googleapis.com/auth/spreadsheets')
})

app.post('/updateSpreadsheet', async (req, res) => {
    const sheets = google.sheets({version:'v4', auth});
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Sheet1!A1';
    const valueInputOption = 'USER_ENTERED';
    const resource = {values: req.body.values};

    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId, range, valueInputOption, resource
        });
        res.json(response.data);
    } catch(error) {
        console.error('error', error);
        res.status(500).send(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));