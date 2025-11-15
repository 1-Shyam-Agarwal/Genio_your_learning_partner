import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import Babel from "@babel/standalone";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }>}
) {
 
  const resolvedParams = await context.params; // unwrap the promise
  const id = resolvedParams.id;
  console.log("Lesson ID:", id);
  console.log(id , id  ,id)
  const supabaseServer = createServerSupabase();

  try {
    console.log("id : " ,id);
    const { data, error } = await supabaseServer
      .from("lessons")
      .select()
      .eq("id", id)
      .single();

    console.log("data : " , data);

    if (error || !data) {
      console.error("Error fetching lesson:", error);
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 500}
      );
    }

    const aiCode = data.generated_code;

    const compiled = Babel.transform(aiCode, {
      presets: ["react", "typescript"],
      filename: "file.tsx",
    })?.code;

    return NextResponse.json({ compiled });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
