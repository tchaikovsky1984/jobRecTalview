import { Link, Outlet } from "react-router-dom";
import SidebarGroup from "../components/SidebarGroup.tsx";
import type { AppUser } from "../types/types.ts";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  user: AppUser;
  setUser: any;
  sidebarChildren?: any;
}

function AppLayout(props: AppLayoutProps) {

  const navigate = useNavigate();

  const signOut = () => {
    props.setUser({
      username: "",
      access_token: "",
      email: "",
      name: "",
      message: "",
      user_id: ""
    });
    navigate("/");
  };

  return (
    <div className="flex flex-row m-0 p-0 h-screen w-screen overflow-hidden" id="wrapper">
      <div className="flex flex-col justify-start items-start m-0 min-w-[280px] w-[20%] max-w-[300px] min-h-screen bg-gradient-to-b from-[#787878] to-[#9a9a9a] drop-shadow-2xl text-white p-4 border-gray-800 border-r-2 shrink-0 z-10" id="sidebar">

        <div className="flex flex-col justify-center items-center w-full mb-8 mt-4 border-b-2 pb-2 border-black" id="title">
          <h1 className="text-4xl text-black font-mono font-extrabold text-center"><i>OkComputer</i></h1>
          <h3 className="text-sm font-sans text-black font-medium text-center opacity-80">Recommendation Engine</h3>
        </div>

        <SidebarGroup title="$ whoami">
          <Link to={"/profile"} className="hover:text-black font-mono font-semibold transition-colors"><p>
            {(props.user.access_token.length > 0 ? "user: " + props.user.username : "logged out")}
          </p></Link>
          <Link to={"/"} className="hover:text-black font-mono font-semibold transition-colors mb-2" onClick={signOut}><p>sign out</p></Link>
        </SidebarGroup>

        <SidebarGroup title="$ goto">
          <Link to={"/app/home"} className="hover:text-black font-mono font-semibold transition-colors"><p>home</p></Link>
          <Link to={"/app/resumes"} className="hover:text-black font-mono font-semibold transition-colors"><p>resumes</p></Link>
          <Link to={"/app/jobs"} className="hover:text-black font-mono font-semibold transition-colors mb-2"><p>jobs</p></Link>
        </SidebarGroup>

        {props.sidebarChildren}
      </div>

      {/* CHANGED: Removed justify-center/items-center. Added overflow-hidden to handle inner scrolling. */}
      <div className="grow h-full bg-gradient-to-b from-[#bdbdbd] to-[#9a9a9a] flex flex-col p-4 overflow-hidden relative" id="main">
        <div className="w-full h-full border-gray-800 border-2 rounded-3xl bg-[#dddddd] overflow-hidden relative shadow-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
