import { useRef } from "react";
import type { ChangeEvent } from "react";

interface AddResumeCardProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function AddResumeCard({ onFileSelect, isLoading = false }: AddResumeCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group h-full w-full rounded-xl border-2 border-dashed 
        flex flex-col justify-center items-center cursor-pointer transition-all duration-300
        ${isLoading
          ? "bg-gray-100 border-gray-300 cursor-wait"
          : "bg-white/50 border-gray-400 hover:border-black hover:bg-white hover:shadow-md"
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept=".pdf,.docx,.doc"
        className="hidden"
      />

      {isLoading ? (
        // Loading State
        <div className="flex flex-col items-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-gray-400 mb-2 animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span className="font-mono font-bold text-gray-500">Uploading...</span>
        </div>
      ) : (
        // Standard State
        <div className="flex flex-col items-center group-hover:-translate-y-1 transition-transform duration-300">
          <div className="bg-gray-200 rounded-full p-4 mb-3 group-hover:bg-black group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="font-mono font-bold text-gray-600 group-hover:text-black">Upload Resume</span>
          <span className="text-xs text-gray-400 mt-1 font-sans">PDF or DOCX</span>
        </div>
      )}
    </div>
  );
}
