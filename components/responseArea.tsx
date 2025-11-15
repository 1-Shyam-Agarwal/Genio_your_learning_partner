'use client';

import "../styles/loadingspinner.css";
import { useRouter } from "next/navigation";

interface MiddleCardProps {
  title: string;
  description: string;
  generateLessonHelper : (title : string , desc : string) => void
}

type responseType = {
  id: string;
};

type responseProps = {
    response : responseType ,
    loading : boolean,
    searchHandler : (searchText : string) => Promise<void>
}



const MiddleCard: React.FC<MiddleCardProps> = ({ title, description, generateLessonHelper}) => {
  return (
    <div className="w-48 h-32 border overflow-hidden bg-gray-50 border-gray-300  rounded-sm  transition-all flex flex-col justify-center items-center text-center p-5 cursor-pointer hover:-translate-y-1"
        onClick={()=>{generateLessonHelper(title , description)}}>
      <h3 className="text-[0.75rem] font-semibold text-gray-800 flex items-center">{title}</h3>
      <p className="text-[0.75rem] text-gray-500 mt-2">{description}</p>
    </div>
  );
};


const ResponseArea = ({response , loading, searchHandler} : responseProps)=>
{

    const router = useRouter();

    const predefinedPrompts = [
        {
            title: "Quiz on Florida",
            description: "Test your knowledge of Florida’s geography, history, and culture.",
        },
        {
            title: "Find Fractions Using Pizza",
            description: "Learn fractions with a tasty example — slices of pizza!",
        },
        {
            title: "Explain Photosynthesis",
            description: "Understand how plants make their food using sunlight and chlorophyll.",
        },
        {
            title: "Long Division Guide",
            description: "A one-pager on how to divide numbers using the long division method.",
        },
        {
            title: "Cartesian Grid Explained",
            description: "Learn how coordinates and graphing work with the Cartesian plane.",
        },
        {
            title: "Understand Supply and Demand",
            description: "Learn how prices change based on the supply and demand.",
        }
    ]

    function handleNavigation()
    {
        router.push(`/lesson/${response.id}`)
    }

    function generateLessonHelper(title:string , desc:string)
    {
        const searchText = `${title}-${desc}`
        searchHandler(searchText);
    }


  
    return (<div className="min-h-[70vh] flex items-center justify-center overflow-auto my-18 ">
        {
            loading ? 
            (
                <div className="flex flex-col justify-center items-center">
                  <span>Learning engine is creating magical content for you...</span>
                  <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
            )
            :
            (
                response.id ? 
                (
                    <div className="w-full max-w-2xl mx-auto p-6 mt-6 text-center">
                        <h2 className="text-lg font-semibold text-black mb-8">
                            Your lesson has been generated successfully! 🎉 
                        </h2>

                        <button
                            onClick={handleNavigation}
                            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-300"
                        > 
                            View Lesson
                        </button>

                        <p className="text-gray-600 text-sm mb-4 italic mt-8">
                            We tried our best to ensure you get a complete understanding in less time and effort.
                        </p>
                    </div>
                )
                :
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {predefinedPrompts.map((prompt, index) => (
                        <MiddleCard
                          key={index}
                          title={prompt.title}
                          description={prompt.description}
                          generateLessonHelper = {generateLessonHelper}
                        />
                      ))}
                    </div>
                )
            )
        }
        
    </div>
    )

}

export default ResponseArea;