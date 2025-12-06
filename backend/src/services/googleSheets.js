import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Auth
const serviceAccountAuthyb = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fixes newline issues in env vars
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuthyb);

export async function logToGoogleSheet(data) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // The data already contains 'timestamp', 'light', etc.
    // So we just pass it directly.
    await sheet.addRow(data);

    // console.log('Data saved to Google Sheet:', data);
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
  }
}