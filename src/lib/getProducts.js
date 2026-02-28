import { google } from 'googleapis';

export async function getProducts() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:I', 
  });

  const [headers, ...rows] = response.data.values;

  return rows.map((row) => ({
    id: parseInt(row[0]),
    type: row[1],
    name: row[2],
    priceUSD: parseFloat(row[3]) || 0,
    priceKHR: parseFloat(row[4]) || 0,
    stock: parseInt(row[5]),
    active: row[6]?.toLowerCase() === 'true',
    description: row[7] || '',
    freeItems: row[8] || '',
  }))
  // .filter(product => product.active); // Logic to hide non-active items
}