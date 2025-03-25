const sheets = require("../config/googleSheets");

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "SheetBridge Data"; // Change if your sheet has a different name

// Fetch data from Google Sheets
exports.getSheetData = async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: SHEET_NAME,
        });

        const rows = response.data.values || [];
        const headers = rows[0]; // First row contains column names
        const data = rows.slice(1).map(row => {
            let obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i] || "";
            });
            return obj;
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
};

// Add a new row
exports.addRow = async (req, res) => {
    try {
        const { values } = req.body; // Expecting an array of values
        if (!Array.isArray(values)) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: SHEET_NAME,
            valueInputOption: "RAW",
            requestBody: {
                values: [values],
            },
        });

        res.json({ message: "Row added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add row" });
    }
};
