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
    await doc.loadInfo(); // loads document properties and worksheets
    
    // Get the first sheet (index 0)
    const sheet = doc.sheetsByIndex[0];

    // Prepare row data based on your input
    // Assuming 'data' is an object like { temperature: 25, humidity: 60 }
    const row = {
      timestamp: newjhDate().toLocaleString(),
      ...data 
    };

    await sheet.addRow(row);
    console.log('Data saved to Google Sheet');
  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
  }
}