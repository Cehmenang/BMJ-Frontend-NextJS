import { SetStateAction } from "react";

export default function LoginWindow({ setNeedLogin }: { setNeedLogin: SetStateAction<any> }){
    return (
        <div className="login-window absolute z-[120] w-full h-dvh bg-third/70">
            <button onClick={()=>setNeedLogin(false)}>KLOS</button>
            <h1 className="text-[100px] text-primary">LOGIN WINDOW!</h1>
        </div>
    )
}