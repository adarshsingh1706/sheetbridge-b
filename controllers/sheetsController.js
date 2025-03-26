const sheets = require("../config/googleSheets");

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID; // ID of the Google Sheets file
const SHEET_NAME = "Sheet1"; // tab inside the file
const range = `${SHEET_NAME}!A1:Z`; // Fetch from A1 to last column

// Fetch Data from Google Sheets
exports.getSheetData = async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });

        const rows = response.data.values || [];
        const headers = rows[0]; 
        const data = rows.slice(1).map(row => {
            let obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i] || "";
            });
            return obj;
        });

        res.json(data);
    } catch (error) {
        console.error("Google Sheets Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
};

// Add a New Row to Google Sheets
exports.addRow = async (req, res) => {
    try {
        const { values } = req.body; 
        if (!Array.isArray(values)) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: [values],
            },
        });

        res.json({ message: "Row added successfully" });
    } catch (error) {
        console.error("Google Sheets Append Error:", error);
        res.status(500).json({ error: "Failed to add row" });
    }
};

//  Update an Existing Row
exports.updateRow = async (req, res) => {
    try {
        const { rowIndex, values } = req.body;
        if (rowIndex === undefined || !Array.isArray(values)) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const updateRange = `${SHEET_NAME}!A${rowIndex + 1}:Z${rowIndex + 1}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: updateRange,
            valueInputOption: "RAW",
            requestBody: { values: [values] },
        });

        res.json({ message: "Row updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update row" });
    }
};

// Delete a Row
exports.deleteRow = async (req, res) => {
    try {
        const { rowIndex } = req.body;
        if (rowIndex === undefined) {
            return res.status(400).json({ error: "Row index is required" });
        }

        // Get the sheet ID dynamically to ensure it's correct
        const sheetsInfo = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const sheet = sheetsInfo.data.sheets.find(s => s.properties.title === SHEET_NAME);
        const SHEET_ID = sheet ? sheet.properties.sheetId : 0; // Default to 0 if not found

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: SHEET_ID, // Correct sheet ID
                                dimension: "ROWS",
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1,
                            },
                        },
                    },
                ],
            },
        });

        res.json({ message: "Row deleted successfully" });
    } catch (error) {
        console.error("Google Sheets Delete Error:", error);
        res.status(500).json({ error: "Failed to delete row" });
    }
};
