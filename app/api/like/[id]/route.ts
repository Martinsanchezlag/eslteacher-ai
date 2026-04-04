import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.airtable.com/v0";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const airtableId = params.id; // Airtable record ID (rec...)
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;

  // If Airtable isn't configured, return gracefully (local data mode)
  if (!pat || !baseId) {
    return NextResponse.json({ likes: null, skipped: true });
  }

  const { action } = await request.json() as { action: "like" | "unlike" };

  try {
    // 1. Fetch the current record to read the existing Likes value
    const getRes = await fetch(
      `${BASE_URL}/${baseId}/Prompts/${airtableId}`,
      { headers: { Authorization: `Bearer ${pat}` } }
    );

    if (!getRes.ok) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const record = await getRes.json();
    const currentLikes: number =
      typeof record.fields?.Likes === "number" ? record.fields.Likes : 0;

    const newLikes = Math.max(0, currentLikes + (action === "like" ? 1 : -1));

    // 2. PATCH the record with the new Likes value
    const patchRes = await fetch(
      `${BASE_URL}/${baseId}/Prompts/${airtableId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${pat}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: { Likes: newLikes } }),
      }
    );

    if (!patchRes.ok) {
      const err = await patchRes.json();
      console.error("[Like API] Airtable PATCH failed:", err);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    const updated = await patchRes.json();
    return NextResponse.json({ likes: updated.fields?.Likes ?? newLikes });
  } catch (err) {
    console.error("[Like API] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
