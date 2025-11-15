import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("id, lesson_title, status, created_at")
      .order("created_at", { ascending: false });


    if (error) {
      console.error("Supabase error fetching lesson:", error);
      // It's generally better to return a 500 status if the DB query fails.
      return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 }); 
    }

    return NextResponse.json({ lessons });
    
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}