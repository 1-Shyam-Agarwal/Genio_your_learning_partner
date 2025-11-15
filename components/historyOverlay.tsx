'use client'
import { RxCross1 } from "react-icons/rx";
import { useRouter } from "next/navigation";

type historyItemType = {
    lessonTitle : string,
    id : string,
    generatingStatus : string,
    created_at : Date
}

type historyPropsType = {
    setShowHistory : React.Dispatch<React.SetStateAction<boolean>>,
    learningHistory : historyItemType[]
}


const History = ({setShowHistory,learningHistory} : historyPropsType)=>
{
    const router = useRouter();

    function navigationHandler(status : string , id : string) : void{
        if(status === "generated")
        {
            router.push(`lesson/${id}`)
        }
    }
     
    return(<div className="absolute inset-0 bg-white/20 z-50 backdrop-blur-sm p-12 overflow-auto">

        <div 
            className="absolute top-0 right-0 z-50 p-2 p-8 cursor-pointer"
            onClick={() => setShowHistory(prev => !prev)}
        >
            <RxCross1 className="text-[1.4rem] hover:text-red-700" />
        </div>

        
        <div className="pb-8">
            <h1 className="text-black text-[1.8rem]">Learning History</h1>
            <h6 className="text-sm text-gray-800">Revise the lesson you searched earlier.</h6>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100 text-sm">
                <tr>
                    <th className="py-2 px-4 font-semibold border-b">LESSON TITLE</th>
                    <th className="py-2 px-4 font-semibold border-b">STATUS</th>
                </tr>
                </thead>
                <tbody>
                {learningHistory.map((lesson) => (
                    <tr
                    key={lesson.id}
                    onClick={()=>{navigationHandler(lesson.generatingStatus , lesson.id)}}
                    className="cursor-pointer bg-white hover:bg-gray-200"
                    >
                    <td className="py-2 px-4 border-b flex items-center justify-center text-sm underline text-blue-500">{lesson.lessonTitle}</td>
                    <td className="py-2 px-4 border-b text-sm text-center">
                        

                        {lesson.generatingStatus === "generating" ? (
                            <div className="flex items-center justify-center gap-4 text-blue-700">
                                Generating...
                            </div>
                        ) : (
                            lesson.generatingStatus === "generated" ? (
                                <div className="flex items-center justify-center gap-4 text-green-700">
                                    Generated successfully 🎉 
                                </div>
                            )
                            :
                            (
                                lesson.generatingStatus === "failed" ?
                                (
                                    <div className="text-red-700 text-sm">Request Failed</div>
                                )
                                :
                                (
                                    <div className="">-</div>
                                )
                            )
                        
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    </div>
    )

}

export default History;