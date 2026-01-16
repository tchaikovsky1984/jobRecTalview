import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppUser, LoginResponse, RegisterResponse, UserResponse } from "../types/types";
import { GET_USER_PROFILE_QUERY, USER_LOGIN_QUERY, USER_REGISTER_QUERY } from "../graphql/user";
import AppLayout from "../layouts/AppLayout";

import { api } from "../services/api";

interface LoginPageProps {
  user: AppUser;
  setUser: (newuser: AppUser) => void;
}

function LoginPage(props: LoginPageProps) {
  // form = true => login
  // form = false => register
  const form = useRef(true);
  const [refChange, setRefChange] = useState(true);
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" })
  const [registerFormData, setRegisterFormData] = useState({ username: "", password: "", name: "", email: "" });
  const [isLoading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (form.current)
      setLoginFormData({ ...loginFormData, [name]: value });
    else
      setRegisterFormData({ ...registerFormData, [name]: value });
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (form.current) {
      setLoading(true);
      try {
        const loginresponse = await api.post<LoginResponse>(false, "", {
          query: USER_LOGIN_QUERY,
          variables: {
            pwd: loginFormData.password,
            usr: loginFormData.username
          }
        }, {});
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
    }
    else {
      setLoading(true);
      try {
        const registerresponse = await api.post<RegisterResponse>(false, "", {
          query: USER_REGISTER_QUERY,
          variables: {
            email: registerFormData.email,
            name: registerFormData.name,
            pwd: registerFormData.password,
            usr: registerFormData.username
          }
        }, {});
        navigate("/");
      }
      catch (e) {
        alert((e as Error).message);
      }
      finally {
        setLoading(false);
      }
    }
  };

  const handleFormToggle = () => {
    form.current = !form.current;
    setRefChange(!refChange);
  }

  return (
    <div className="fixed inset-0 m-0 p-0 overflow-hidden bg-[#bdbdbd]">

      <div className="absolute inset-0 z-0 filter blur-sm pointer-events-none">
        <AppLayout user={props.user} setUser={props.setUser} />
      </div>

      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      <div className="absolute inset-0 z-10 flex justify-center items-center">
        <div className="bg-[#ffffcf] min-h-100 min-w-100 sm:min-h-160 sm:min-w-100 md:min-h-180 md:min-w-120 grow-0 shrink-0 rounded-2xl shadow-2xl flex flex-col items-center justify-around">

          <div className="flex flex-col items-center justify-around pt-10">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold font-mono mb-5">{(form.current) ? "Log In" : "Register"}</h1>
            <p className="text-md sm:text-l md:text-xl font-mono">{((form.current) ? "to" : "into") + " OkComputer"}</p>
          </div>

          <div className="w-full flex flex-row justify-center align-center">
            <button className={(form.current) ? "bg-black text-white p-4 rounded-xl" : "p-4"} onClick={handleFormToggle} >Login</button>
            <button className={(!form.current) ? "bg-black text-white p-4 rounded-xl" : "p-4"} onClick={handleFormToggle} >Register</button>
          </div>

          {
            (!form.current) ?
              <form onSubmit={handleFormSubmit} className="flex flex-col items-start justify-evenly">
                <label className="mt-3 text-xl text-l font-mono font-bold">username</label>
                <input aria-label="username" type="text" value={registerFormData.username} name="username" onChange={handleFormChange} id="usr-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

                <label className="mt-3 text-xl text-l font-mono font-bold">email</label>
                <input aria-label="email" type="text" value={registerFormData.email} name="email" onChange={handleFormChange} id="email-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

                <label className="mt-3 text-xl text-l font-mono font-bold">name</label>
                <input aria-label="name" type="text" value={registerFormData.name} name="name" onChange={handleFormChange} id="name-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

                <label className="mt-3 text-xl text-l font-mono font-bold">password</label>
                <input aria-label="password" type="password" value={registerFormData.password} name="password" onChange={handleFormChange} id="pwd-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

                <button type="submit" className="m-3 text-xl text-l min-h-15 min-w-30 border borded-2 bg-black rounded-2xl text-white">{isLoading ? "Registering..." : "Submit"}</button>
              </form>
              :
              <form onSubmit={handleFormSubmit} className="flex flex-col items-start justify-evenly">
                <label className="mt-3 text-xl text-l font-mono font-bold">username</label>
                <input aria-label="username" type="text" value={loginFormData.username} name="username" onChange={handleFormChange} id="usr-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

                <label className="mt-3 text-xl text-l font-mono font-bold">password</label>
                <input aria-label="password" type="password" value={loginFormData.password} name="password" onChange={handleFormChange} id="pwd-field" className="min-h-8 shrink shadow-xl border-b-2 border-black font-mono font-bold pt-2 pl-2 pr-2" />

                <button type="submit" className="m-3 text-xl text-l min-h-15 min-w-30 border borded-2 bg-black rounded-2xl text-white">{isLoading ? "Logging in..." : "Submit"}</button>
              </form>

          }
        </div>
      </div>
    </div >
  );
}

export default LoginPage;
