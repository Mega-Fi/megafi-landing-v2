import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createSupabaseClient();

    // Get the latest token ID from og_nft_claims table
    // Note: token_id is stored as TEXT, so we need to cast to integer for proper numeric ordering
    const { data, error } = await supabase
      .from("og_nft_claims")
      .select("token_id")
      .not("token_id", "is", null)
      .order("token_id", { ascending: false })
      .limit(100); // Get multiple records to find max numerically

    if (error) {
      console.error("Error fetching token IDs:", error);
      return NextResponse.json({
        success: true,
        latestTokenId: 0,
        nextTokenId: 1,
      });
    }

    // If no records found
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        latestTokenId: 0,
        nextTokenId: 1,
      });
    }

    // Convert all token_ids to numbers and find the maximum
    console.log("=== DATABASE QUERY RESULT ===");
    console.log("Total records returned:", data.length);
    console.log("Raw data:", JSON.stringify(data, null, 2));

    const tokenIds = data
      .map((record) => parseInt(record.token_id))
      .filter((id) => !isNaN(id)); // Filter out any invalid numbers

    const latestTokenId = tokenIds.length > 0 ? Math.max(...tokenIds) : 0;
    const nextTokenId = latestTokenId + 1;

    console.log("Parsed token IDs:", tokenIds);
    console.log("Latest token ID:", latestTokenId);
    console.log("Next token ID:", nextTokenId);
    console.log("=== END ===");

    return NextResponse.json({
      success: true,
      latestTokenId,
      nextTokenId,
    });
  } catch (error: any) {
    console.error("Error fetching latest token ID:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch latest token ID",
        latestTokenId: 0,
        nextTokenId: 1,
      },
      { status: 500 }
    );
  }
}
