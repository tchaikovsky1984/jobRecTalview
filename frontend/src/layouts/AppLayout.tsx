import { Link, Outlet } from "react-router-dom";

interface AppLayoutProps {
  sidebarChildren?: any;
}

function AppLayout(props: AppLayoutProps) {
  return (
    <div className="flex flex-row m-0 p-0" id="wrapper">
      <div className="flex-col justify-start items-start m-0 min-w-50 max-w-75 min-h-screen shrink-0 bg-[#bdbdbd]" id="sidebar" >
        <nav>
          <Link to={"/app/resumes"}><p>resumes</p></Link>
          <Link to={"/app/jobs"}><p>jobs</p></Link>
        </nav>
        {props.sidebarChildren}
      </div>
      <div className="m-0 grow min-h-screen flex-col justify-start items-center shrink-0" id="main">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
