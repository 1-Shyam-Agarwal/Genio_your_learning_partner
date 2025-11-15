import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { data: lessons, error } = await supabaseServer
      .from("lessons")
      .select("id, lesson_title, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching lessons:", error);
      return NextResponse.json(
        { error: "Failed to fetch lessons" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lessons });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
