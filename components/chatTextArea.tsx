'use client';

type chatInputType = {
    searchText : string,
    setSearchText : React.Dispatch<React.SetStateAction<string>>,
    searchHandler : (searchText : string) => Promise<void>,
    loading : boolean
}

const ChatTextArea :React.FC<chatInputType> = ({searchText , setSearchText, searchHandler , loading}) => {

  const handleSend = () => {
    if (searchText.trim() === "") return;
    searchHandler(searchText);
    setSearchText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="w-full  fixed bottom-0 left-0 p-8 bg-white flex justify-center items-center space-x-2">
      <div className="w-[75%] flex justify-center gap-4 items-center">
        <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search for a topic..."
            className=" flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#000000]"
        />
        <button
            onClick={handleSend}
            disabled={loading}
            className={`bg-black text-white px-4 py-3 rounded-full transition-colors duration-300 ${
                loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-800'
            }`}
        >
            Send
        </button>

      </div>
    </div>
  );
};

export default ChatTextArea;
