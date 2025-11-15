'use client';

import ChatTextArea from "@/components/chatTextArea";
import ResponseArea from "@/components/responseArea";
import Navbar from "@/components/navbar";
import History from "@/components/historyOverlay";
import { useState } from "react";
import { useEffect } from "react";
import {supabaseClient} from "@/lib/supabase/client"

type responseType = {
  id: string,
};

type historyItem = {
  lessonTitle : string,
  id : string,
  generatingStatus : string
  created_at : Date
}

const landingPage = ()=>
{
    const [searchText , setSearchText] = useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);
    const [showHistory , setShowHistory] = useState<boolean>(false);
    const [learningHistory , setLearningHistory] = useState<historyItem[]>([]);
    const [response, setResponse] = useState<responseType>({
      id: "",
    });
    
    const supabaseClt = supabaseClient(); 

    // Fetch lessons from API
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/generatedLessons"); // your API route
        if (!res.ok) return;

        const data = await res.json();
        console.log("data : ", data.lessons);
        setLearningHistory(data.lessons.map((lesson)=>
        {
            return {
               lessonTitle : lesson.lesson_title,
              id : lesson.id,
              generatingStatus : lesson.status,
              created_at : lesson.created_at

            }
        }));

      } catch (err: any) {
        console.error(err);
      }
    };

    useEffect(()=>
    {

       fetchLessons();

        const channel = supabaseClt.channel("lessons-channel");
          channel
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "lessons" }, 
            (payload) => {

              const { eventType } = payload;
              if (eventType === "INSERT") {
                const newLesson = {
                  lessonTitle: payload.new.lesson_title,
                  id: payload.new.id,
                  generatingStatus: payload.new.status,
                  created_at: payload.new.created_at,
                };
                setLearningHistory((prev) => [newLesson, ...prev]);

              } else if (eventType === "UPDATE") {

                const { id, lesson_title, status } = payload.new;
                setLearningHistory((prev) =>
                  prev.map((item) =>
                    item.id === id
                      ? { ...item, generatingStatus: status }
                      : item
                  )
                );
              }
            }
          )
          .subscribe((status) => {
            console.log("Realtime subscription status:", status);
          });

        return () => {
          supabaseClt.removeChannel(channel);
        };

    },[])
       

    async function searchHandler(searchText : string) : Promise<void>
    {
        if (!searchText) return;

        try {
          setLoading(true);
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic: searchText }), // send topic
          });

          if (!res.ok) {
            console.log("error occured while generating a response.")
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          console.log("API Response:", data);

          setResponse((prev)=>{return {...prev , id:data.id}});
        } catch (error) {
          console.error("Error fetching data:", error);
        }finally{
          setLoading(false);
        }
      };

    return(<div className="h-screen p-8 px-12 overflow-y-auto">

      <Navbar 
          setShowHistory={setShowHistory}/>

      <ResponseArea 
          response={response} 
          loading={loading} 
          searchHandler={searchHandler}/>

      <ChatTextArea 
          searchText = {searchText} 
          loading={loading} 
          setSearchText={setSearchText} 
          searchHandler={searchHandler}/>  

      {
            showHistory && <History setShowHistory={setShowHistory} learningHistory={learningHistory} ></History>
      }  

    </div>)
}

export default landingPage;