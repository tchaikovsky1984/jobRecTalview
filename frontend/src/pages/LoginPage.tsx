import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponseBody } from "../types/types";

import { api } from "../services/api";

interface LoginPageProps {
  user: LoginResponseBody;
  setUser: any;
}

function LoginPage(props: LoginPageProps) {

  const [formData, setFormData] = useState({ username: "", password: "" })
  const [isLoading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).id === "usr-field") {
      setFormData({ ...formData, username: e.target.value });
    }
    else {
      setFormData({ ...formData, password: e.target.value });
    }
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const response = await api.post<LoginResponseBody>(true, "/user/login", formData, {});
      props.setUser(response);
      navigate("/app/resumes");
    }
    catch (e) {
      alert((e as Error).message);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex m-0 min-w-screen min-h-screen bg-[#bdbdbd] justify-center items-center">
      <div className="bg-[#ffffcf] min-h-60 min-w-60 sm:min-h-100 sm:min-w-100 md:min-h-120 md:min-w-120 grow-0 shrink-0 rounded-2xl shadow-2xl flex flex-col items-center justify-around">

        <div className="flex flex-col items-center justify-around">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold font-mono mb-5">Log In</h1>
          <p>to OkComputer</p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-evenly">
          <label className="m-3 text-xl text-l">username</label>
          <input type="text" value={formData.username} onChange={handleFormChange} id="usr-field" className="min-h-8 shrink border border-[#888888] rounded-md" />

          <label className="m-3 text-xl text-l">password</label>
          <input type="password" value={formData.password} onChange={handleFormChange} id="pwd-field" className="min-h-8 shrink border border-[#888888] rounde-md" />

          <button type="submit" className="m-3 text-xl text-l min-h-15 min-w-30 border borded-2 bg-black rounded-2xl text-white">{isLoading ? "Logging in..." : "Submit"}</button>
        </form>

      </div>
    </div >
  );
}

export default LoginPage;
