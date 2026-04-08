import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const ALLOWED_SHEETS = ["contact-us_en", "contact-us_ar"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      subject,
      email,
      phone_number: phoneNumberRaw,
      phone: phoneAlt,
      city,
      message,
      sheet,
    } = body;

    const phone_number = phoneNumberRaw ?? phoneAlt;

    if (
      !name?.trim() ||
      !subject?.trim() ||
      !email?.trim() ||
      !phone_number?.trim() ||
      !city?.trim() ||
      !message?.trim()
    ) {
      console.log(`POST /api/contact - 400 (missing fields)`);
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_SHEETS.includes(sheet)) {
      console.log(`POST /api/contact - 400 (invalid sheet)`);
      return NextResponse.json(
        { error: "Invalid sheet" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      console.log(`POST /api/contact - 400 (email)`);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!credentials || !spreadsheetId) {
      console.log(`POST /api/contact - 500 (config)`);
      return NextResponse.json(
        {
          error:
            "Server configuration error. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    let auth;
    try {
      const creds = JSON.parse(credentials);
      auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch {
      console.log(`POST /api/contact - 500 (credentials)`);
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 500 }
      );
    }

    const sheets = google.sheets({ version: "v4", auth });

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const allTitles =
      meta.data.sheets
        ?.map((s) => s.properties?.title)
        .filter((t): t is string => typeof t === "string" && t.length > 0) ??
      [];
    // Same spreadsheet can have many tabs; we pick the one whose title matches `sheet` (contact-us_en / contact-us_ar).
    const sheetEntry = meta.data.sheets?.find(
      (s) => s.properties?.title === sheet
    );
    const sheetId = sheetEntry?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) {
      console.log(`POST /api/contact - 400 (missing worksheet tab)`);
      return NextResponse.json(
        {
          error: `No worksheet named "${sheet}" in this spreadsheet. Existing tabs: ${allTitles.length ? allTitles.map((t) => JSON.stringify(t)).join(", ") : "(none)"}. Names must match exactly (including hyphens).`,
        },
        { status: 400 }
      );
    }

    // Use appendCells + sheetId so we never pass hyphenated sheet names through values.append URL path
    // (API returns "Unable to parse range" for A1 like 'contact-us_en'!A:Z in that path).
    const cells = [
      new Date().toISOString(),
      name.trim(),
      subject.trim(),
      email.trim(),
      phone_number.trim(),
      city.trim(),
      message.trim(),
    ];

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            appendCells: {
              sheetId,
              rows: [
                {
                  values: cells.map((text) => ({
                    userEnteredValue: { stringValue: String(text) },
                  })),
                },
              ],
              fields: "userEnteredValue",
            },
          },
        ],
      },
    });

    console.log(`POST /api/contact - 200`);
    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(`POST /api/contact - 500`);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit form. Please try again.",
      },
      { status: 500 }
    );
  }
}
