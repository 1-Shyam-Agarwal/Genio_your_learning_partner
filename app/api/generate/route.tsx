import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { geminiOpenAIClient } from "@/lib/gemini-openai-client";
import { prompt } from "@/promptConfig"; // The TSX prompt object is imported here
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  try {

    const { topic } = await req.json();
    const newLesson = {
        lesson_title : topic ,
        status : 'generating',
        generated_code : ''
    }

    const supabase = createServerSupabase();

    let initialInsertedData ;
    try {
        
        const { data , error } = await supabase
            .from("lessons")
            .insert(newLesson)
            .select()
            .single();
        
        initialInsertedData = data;

        if (error) {
            console.error("Supabase error occured during initial insertion:", error);
        }

        console.log("Initial lesson entry inserted :", data);

    } catch (err) {
        console.error("Supabase error occured during initial insertion:", err);
    }


    // Prompt AI to generate lesson using tools
    console.log("startinf generating...")

const systemPromptContent = JSON.stringify(prompt);

const completion = await geminiOpenAIClient.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    { 
      role: "system", 
      content: systemPromptContent // Pass the stringified object directly
    },
    { 
      role: "user", 
      content: "Generate the React TSX component now. The Topic is: " + topic
    }
  ]
});
// ---------------------------------------------------------------------

    const aiCode = completion.choices[0].message?.content || "";
    

//     const transpiledCode = Babel.transform(aiCode)
        

    try {
        
        const { data, error } = await supabase
            .from("lessons")
            .update({generated_code : aiCode , status : "generated"})
            .select()
            .eq("id" , initialInsertedData.id);

        if (error) {
            console.error("Supabase error occured during update:", error);
        }

        console.log("Lesson entry updated :", data);

    } catch (err) {
        console.error("Supabase error occured during update:", err);
    }

    

    return NextResponse.json({
      id : initialInsertedData.id
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}