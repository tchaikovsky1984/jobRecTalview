import type { AppUser } from "../types/types"

interface HomePageProps {
  user: AppUser;
}

function HomePage(props: HomePageProps) {
  return (
    // ADDED: Wrapper to re-center content
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-sans font-extrabold mb-3">Welcome, {props.user.name?.split(" ")[0].toLowerCase()}</h1>
        <p className="text-xl font-mono font-medium ">Navigate to</p>
        <p className="text-xl font-mono font-medium">resumes to browse your upload</p>
        <p className="text-xl font-mono font-medium">jobs to browse your recommendations</p>
      </div>
    </div>
  );
};

export default HomePage;
