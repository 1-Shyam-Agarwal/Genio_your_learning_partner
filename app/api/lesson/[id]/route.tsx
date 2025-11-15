import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
export const dynamic = 'force-dynamic';

// Using require is necessary and correct for @babel/standalone in a Node.js context.
const { transform } = require("@babel/standalone");

export async function GET(
  req: NextRequest,
  context: { params: { id: string }}
) {
  const id = context.params.id;
  
  // Input Validation: Check for invalid/missing ID early
  if (!id) {
    return NextResponse.json(
      { error: "Missing lesson ID" },
      { status: 400 } // Use 400 for bad client input
    );
  }

  try {
    //  Clearer Destructuring for Supabase
    const { data: lessonData, error: dbError } = await supabase
      .from("lessons")
      .select("generated_code") // Fetch only necessary columns
      .eq("id", id)
      .single();

    if (dbError) {
      // Log the specific database error for debugging
      console.error("Supabase error fetching lesson:", dbError);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500} // Keep 500 for a server-side DB failure
      );
    }

    if (!lessonData) {
      //  Use 404 for resource not found
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 } 
      );
    }

    const aiCode = lessonData.generated_code;

    // Ensure aiCode is present before compiling (defensive programming)
    if (!aiCode || typeof aiCode !== 'string') {
        return NextResponse.json(
            { error: "Lesson data is missing or invalid code." },
            { status: 422 } // 422 Unprocessable Entity is good for valid request, invalid data
        );
    }

    return NextResponse.json({ aiCode });
  } catch (err) {
    // Catch-all for transformation errors, etc.
    console.error("Unexpected server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}