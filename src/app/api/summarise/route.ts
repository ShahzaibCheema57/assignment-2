import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getMongoDb } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  // Fake scraping
  const fakeBlogText = `
    Life is a beautiful journey filled with ups and downs.
    Embrace challenges, learn from failures, and cherish every moment.
  `;

  const fakeSummary = `
    Life is a beautiful journey. Embrace challenges and cherish every moment.
  `;

  const urduDict: Record<string, string> = {
    "Life": "زندگی",
    "journey": "سفر",
    "beautiful": "خوبصورت",
    "Embrace": "گلے لگائیں",
    "challenges": "چیلنجز",
    "cherish": "قدر کریں",
    "moment": "لمحہ",
    "failures": "ناکامیاں",
    "learn": "سیکھیں",
    "ups": "اچھے وقت",
    "downs": "برے وقت",
  };

  const urduSummary = fakeSummary
    .split(" ")
    .map((word) => urduDict[word.replace(/\W/g, "")] || word)
    .join(" ");

  // Save full text to MongoDB
  const db = await getMongoDb();
  await db.collection("blogTexts").insertOne({
    url,
    fullText: fakeBlogText.trim(),
    createdAt: new Date(),
  });

  // Save summary to Supabase
  const { error } = await supabase
    .from("summaries")
    .insert([
      {
        url,
        summary: fakeSummary.trim(),
        urduSummary: urduSummary.trim(),
      },
    ]);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    summary: fakeSummary.trim(),
    urduSummary: urduSummary.trim(),
  });
}
