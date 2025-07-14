import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getMongoDb } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    console.log("✅ Incoming request body:", { url });

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL in request body." },
        { status: 400 }
      );
    }

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
    console.log("✅ Connecting to MongoDB...");
    const db = await getMongoDb();
    const mongoResult = await db.collection("blogTexts").insertOne({
      url,
      fullText: fakeBlogText.trim(),
      createdAt: new Date(),
    });
    console.log("✅ MongoDB insert result:", mongoResult.insertedId);

    // Save summary to Supabase
    console.log("✅ Inserting into Supabase...");
    const { error: supabaseError } = await supabase
      .from("summaries")
      .insert([
        {
          url,
          summary: fakeSummary.trim(),
        },
      ]);
    console.log("✅ Supabase insert result:", { supabaseError });

    if (supabaseError) {
      console.error("❌ Supabase error:", supabaseError);
      return NextResponse.json(
        { error: supabaseError.message },
        { status: 500 }
      );
    }

    console.log("✅ Returning successful response.");
    return NextResponse.json({
      summary: fakeSummary.trim(),
      urduSummary: urduSummary.trim(),
    });
  } catch (error) {
    console.error("❌ Route handler error:", error);
    return NextResponse.json(
      { error: "Server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
