import { useState } from "react";

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
}

function SidebarGroup({ title, children }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full mb-4 rounded-xl border border-gray-800">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer p-2 hover:bg-white/10 rounded transition-colors select-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`size-5 mr-2 transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        <h3 className={`text-lg font-extrabold ${isOpen ? "text-black" : "text-white"}`}>{title}</h3>
      </div>

      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pl-9 flex flex-col gap-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarGroup;
