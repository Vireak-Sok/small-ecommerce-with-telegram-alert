import { google } from 'googleapis';

export async function getProductsFromSheet() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'Sheet1!A2:E'; // Adjust based on your sheet name/range

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    const rows = response.data.values;
    if (!rows) return [];

    // Map rows to objects
    return rows.map((row) => ({
      id: row[0],
      name: row[1],
      price: row[2],
      image: row[3],
      description: row[4],
    }));
  } catch (err) {
    console.error('Google Sheets API Error:', err);
    return [];
  }
}