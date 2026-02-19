import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, model } = body;

    // Validate required fields
    if (!name || !email || !phone || !model || model === "Choose Model") {
      console.log(`POST /api/submit - 400`);
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`POST /api/submit - 400`);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get credentials from environment variables
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!credentials || !spreadsheetId) {
      console.log(`POST /api/submit - 500`);
      return NextResponse.json(
        { error: "Server configuration error. Please check your environment variables." },
        { status: 500 }
      );
    }

    // Parse credentials
    let auth;
    try {
      const creds = JSON.parse(credentials);
      auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch {
      console.log(`POST /api/submit - 500`);
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 500 }
      );
    }

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: "v4", auth });

    // Get the first sheet name dynamically (in case it's not "Sheet1")
    let sheetName = "Sheet1"; // Default sheet name
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });
      if (spreadsheet.data.sheets && spreadsheet.data.sheets.length > 0) {
        sheetName = spreadsheet.data.sheets[0].properties?.title || "Sheet1";
      }
    } catch {
      // Use default sheet name
    }

    // Append data to the sheet
    // Using just the sheet name - it will automatically append to the next available row
    const range = sheetName;
    const values = [[name, email, phone, model]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log(`POST /api/submit - 200`);
    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(`POST /api/submit - 500`);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}
