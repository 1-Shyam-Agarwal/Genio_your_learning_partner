import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabase();

    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("id, lesson_title, status, created_at") // only the fields you want
      .order("created_at", { ascending: false });

      console.log("lessons : " ,lessons);
    if (error) {
      console.error("Supabase error fetching lesson:", error);
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({ lessons });
    
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
