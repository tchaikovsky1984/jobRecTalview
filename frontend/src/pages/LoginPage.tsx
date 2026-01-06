import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppUser, LoginResponse, UserResponse } from "../types/types";
import { GET_USER_PROFILE_QUERY, USER_LOGIN_QUERY } from "../graphql/user";
import AppLayout from "../layouts/AppLayout";

import { api } from "../services/api";

interface LoginPageProps {
  user: AppUser;
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
      const loginresponse = await api.post<LoginResponse>(false, "", {
        query: USER_LOGIN_QUERY,
        variables: {
          pwd: formData.password,
          usr: formData.username
        }
      }, {}) as any;
      const userresponse = await api.post<UserResponse>(false, "",
        {
          query: GET_USER_PROFILE_QUERY,
          variables: {
            id: Number(loginresponse.data.LoginUser.user_id)
          }
        },
        { Authorization: "Bearer " + loginresponse.data.LoginUser.access_token }
      ) as any;
      props.setUser({ ...loginresponse.data.LoginUser, ...userresponse.data.user[0] });
      navigate("/");
    }
    catch (e) {
      alert((e as Error).message);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 m-0 p-0 overflow-hidden bg-[#bdbdbd]">

      <div className="absolute inset-0 z-0 filter blur-sm pointer-events-none">
        <AppLayout user={props.user} />
      </div>

      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      <div className="absolute inset-0 z-10 flex justify-center items-center">
        <div className="bg-[#ffffcf] min-h-60 min-w-60 sm:min-h-100 sm:min-w-100 md:min-h-120 md:min-w-120 grow-0 shrink-0 rounded-2xl shadow-2xl flex flex-col items-center justify-around">

          <div className="flex flex-col items-center justify-around pt-10">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold font-mono mb-5">Log In</h1>
            <p className="text-md sm:text-l md:text-xl font-mono">to OkComputer</p>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col items-start justify-evenly">
            <label className="mt-3 text-xl text-l font-mono font-bold">username</label>
            <input type="text" value={formData.username} onChange={handleFormChange} id="usr-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

            <label className="mt-3 text-xl text-l font-mono font-bold">password</label>
            <input type="password" value={formData.password} onChange={handleFormChange} id="pwd-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

            <button type="submit" className="m-3 text-xl text-l min-h-15 min-w-30 border borded-2 bg-black rounded-2xl text-white">{isLoading ? "Logging in..." : "Submit"}</button>
          </form>

        </div>
      </div>
    </div >
  );
}

export default LoginPage;
