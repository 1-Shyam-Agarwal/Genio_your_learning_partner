import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { geminiOpenAIClient } from "@/lib/gemini-openai-client";
import { prompt } from "@/promptConfig"; // The TSX prompt object is imported here
// import Babel from "@babel/standalone"; // Babel is not used in the final code, so it's commented out/removed.

// Define a type for the data structure to improve type safety
interface LessonData {
    id: string; // Assuming 'id' is a string UUID from Supabase
    lesson_title: string;
    status: 'generating' | 'generated' | 'failed';
    generated_code: string;
}

export async function POST(req: NextRequest) {
    const supabase = createServerSupabase();
    let initialInsertedData: LessonData | null = null;

    try {
        const { topic } = await req.json();

        const newLesson = {
            lesson_title: topic,
            status: 'generating' ,
            generated_code: ''
        };

        const { data, error: insertError } = await supabase
            .from("lessons")
            .insert(newLesson)
            .select()
            .single();

        if (insertError || !data) {
            console.error("Supabase error during initial insertion:", insertError || "No data returned.");
            throw new Error(`Failed to insert initial lesson entry: ${insertError?.message || 'No data'}`);
        }

        initialInsertedData = data as LessonData;
        console.log("Initial lesson entry inserted:", initialInsertedData.id);

        // 2. AI Code Generation
        console.log("Starting AI generation...");

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

        const aiCode = completion.choices[0].message?.content;

        if (!aiCode || aiCode.trim().length === 0) {
            console.error("AI failed to return valid code content.");
            throw new Error("AI returned empty or null response.");
        }

        // 3. Final Database Update (Status: 'generated')
        const { error: updateError, data: updatedData } = await supabase
            .from("lessons")
            .update({ generated_code: aiCode, status: "generated" })
            .select()
            .eq("id", initialInsertedData.id);

        if (updateError || !updatedData) {
            console.error("Supabase error occurred during final update:", updateError || "No data returned on update.");
            throw new Error(`Failed to update lesson with generated code: ${updateError?.message || 'No data'}`);
        }

        console.log("Lesson entry updated successfully.");

        // Successful response
        return NextResponse.json({
            id: initialInsertedData.id,
            status: "generated"
        });

    } catch (err: any) {
        console.error("Critical failure in POST /api/generate-lesson:", err.message);

        if (initialInsertedData?.id) {
            console.log(`Attempting to mark lesson ID ${initialInsertedData.id} as 'failed'.`);
            

            try {
                const { error: failUpdateError } = await supabase
                    .from("lessons")
                    .update({ status: "failed" })
                    .eq("id", initialInsertedData.id);
                
                if (failUpdateError) {
                    console.error(`Supabase error marking lesson as 'failed':`, failUpdateError);
                } else {
                    console.log(`Lesson ID ${initialInsertedData.id} successfully marked as 'failed'.`);
                }
            } catch (failErr) {
                console.error("Secondary error during fail status update:", failErr);
            }
        }

        // Return the original error to the client
        return NextResponse.json({ 
            error: err.message || "An unknown error occurred during generation.",
            lessonId: initialInsertedData?.id || null,
            status: "failed"
        }, { status: 500 });
    }
}