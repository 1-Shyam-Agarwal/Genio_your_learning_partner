'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaInnosoft } from "react-icons/fa";
import React from 'react';
import { useRouter } from 'next/navigation';

const LessonPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [LessonComponent, setLessonComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lesson/${id}`);

        
        if (!res.ok) throw new Error(`Failed to fetch lesson ${res.status}`);
        
        const data = await res.json();

        const code = data?.compiled;
    
        const componentFactory = new Function('React', `return ${code}`)(React);

        const GeneratedComponent = componentFactory;
        setLessonComponent(() => GeneratedComponent);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unknown error');
      }
    };

    fetchLesson();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!LessonComponent) return <p className='100vw 100vh flex items-center justify-center text-md'>Fetching Code</p>;

  return (
    <div className="p-4">
      <nav className="w-screen fixed top-0 left-0 bg-white border-t border-t-gray-300 pt-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-3">
            <div className="pl-[25px]">   
                <div className=" flex items-center space-x-2 cursor-pointer">
                    <FaInnosoft className="text-black text-[20px]" /> 
                    <p className="  text-[20px] font-semibold text-black">Genio</p>
                </div>

                <div className="text-[10px] font-semibold text-gray-600 ml-[1.2rem]">Your Learning Partner</div>
            </div>

            <div className="mr-[25px] p-2 px-4 rounded-sm text-sm text-gray-800 border bg-gray-100 border-gray-200  hover:bg-gray-200"
                onClick={()=>{router.push('/')}}
            >
                Go Back
            </div>
            
        </div>
      </nav>

    <div className='mt-16'>
        <LessonComponent />
    </div>
    </div>
  );
};

export default LessonPage;
