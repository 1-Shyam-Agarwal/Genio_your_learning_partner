'use client';

import { FaInnosoft } from "react-icons/fa";

const Navbar = ({setShowHistory} : {setShowHistory : React.Dispatch<React.SetStateAction<boolean>>}) => {

  return (
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
                        onClick={()=>{setShowHistory(prev=>!prev)}}
                    >
                        Learning History
                    </div>
                    
                </div>
            </nav>
  );
};

export default Navbar;
