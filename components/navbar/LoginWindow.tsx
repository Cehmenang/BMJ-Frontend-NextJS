import { SetStateAction } from "react";
import { FaLess } from "react-icons/fa6";

export default function LoginWindow({ setNeedLogin }: { setNeedLogin: SetStateAction<any> }){
    return (
        <div className="login-window absolute z-50 w-full h-dvh bg-third/70">
            <button onClick={()=>setNeedLogin(FaLess)}>KLOS</button>
            <h1 className="text-[100px] text-primary">LOGIN WINDOW!</h1>
        </div>
    )
}