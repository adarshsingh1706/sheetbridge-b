require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

console.log(process.env.GOOGLE_PRIVATE_KEY);




const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

router.get('/sheet-data', async (req, res) => {
  console.log("📌 API hit: /api/sheet-data"); // Log API call

  try {
      const sheetId = process.env.GOOGLE_SHEET_ID;
      console.log("✅ Using Sheet ID:", sheetId);

      const range = 'Sheet1!A1:C4'; 
      console.log("📄 Fetching range:", range);

      const response = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: range,
      });

      console.log("✅ Data fetched:", response.data.values);
      res.json({ data: response.data.values });
  } catch (error) {
      console.error("❌ Google Sheets API Error:", error);
      res.status(500).json({ error: error.message });
  }
});


module.exports = router;
