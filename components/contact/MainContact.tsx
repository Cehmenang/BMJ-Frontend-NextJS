"use client"

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa";

import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const menus = [
    { title: 'Chatbot', icon: <IoChatbubbleEllipses size={30}/>},
    { title: 'Admin', icon: <FaWhatsapp size={30}/>, url: 'https://wa.me/6281929290560'},
    { title: 'Call Center', icon: <FaHeadphones size={30}/>, url: 'https://whatsform.com/rjyhyl'},
    { title: 'Instagram', icon: <FaInstagram size={30}/>, url: 'https://www.instagram.com/bandarmusikjakarta_bmj'},
    { title: 'Youtube', icon: <FaYoutube size={30}/>, url: 'https://www.youtube.com/@bandarmusikjakarta_bmj'},
    { title: 'Tiktok', icon: <FaTiktok size={30}/>, url: 'https://www.tiktok.com/@bandarmusikjakarta_bmj' },
]

export default function MainContact(){
    const [ screen, setScreen ] = useState<number>(0)
    const [ tabChat, setTabChat ] = useState<boolean>(false)
    const [ tabContact, setTabContact ] = useState<boolean>(false)
        
    function TabMenu(){
        return menus.map((menu, index)=>{
            return <a href={menu.url} key={index} className="py-4 px-12 text-[20px] hover:bg-[#dfdfdf] transition flex items-center gap-x-4 w-full font-semibold border-b-2 border-[#dfdfdf] cursor-pointer" target="_blank" onClick={()=>{
                if(menu.title = "Chatbot") return setTabChat(true)
            }}>
                {menu.icon}
                <span>{menu.title}</span>
            </a>
        })
    }

    function TabContact(){
        return (
            <div className={`tab w-[300px] bg-primary transition duration-500 ease-in rounded-2xl overflow-hidden border-4 border-second`}>
                <div className="py-4 text-center text-[22px] font-semibold tracking-tight bg-second px-10 text-white">
                    <p>Hubungi Kami</p>
                </div>
                <div className="tab-menu">
                    <TabMenu/>
                </div>
            </div>
        )
    }

    function TabChat(){
        return (
            <div className={`tab w-[420px] h-[500px] bg-primary transition duration-500 ease-in rounded-2xl overflow-hidden border-4 border-second`}>
                <div className="py-4 text-center text-[20px] font-semibold tracking-tight bg-second px-10 text-white flex justify-between items-center">
                    <p className="">Bandar Musik Jakarta</p>
                    <IoMdCloseCircle size={36} onClick={()=>setTabChat(false)} className="cursor-pointer"/>
                </div>

                <div className="chat-box">
                    
                </div>

            </div>
        )
    }

    useEffect(()=>{
        addEventListener("resize", ()=>{
            return setScreen(window.innerWidth)
        })
    })
    return (
        <>
        <button className="diskusi fixed bottom-6 md:bottom-20 right-4 md:right-7 bg-second p-4 rounded-full z-50" onClick={()=>{
            if(tabContact) return setTabContact(false)
            else return setTabContact(true)
        }}>
            {!tabContact ? <IoChatbubbleEllipses size={45} className="text-primary"/> : <IoMdCloseCircle size={45} className="text-primary"/>}
        </button>

        <div className={`tab-menu fixed bottom-6 md:bottom-[200px] right-4 md:right-7 z-50 ${tabContact && !tabChat ? 'translate-x-0' : 'translate-x-[400px]'} transition duration-1000 ease-in-out`}>
            <TabContact/>
        </div>

        <div className={`tab-menu fixed bottom-6 md:bottom-[200px] right-4 md:right-7 z-50 ${tabChat ? 'translate-x-0' : 'translate-x-[500px]'} transition duration-1000 ease-in-out`}>
            <TabChat/>
        </div>
        </>

        // {/* <a className="whatsapp bg-green-400 rounded-full p-2 md:p-4 hover:scale-105 hover:hue-rotate-60 transition-all z-50" href={'https://wa.me/62081929290560'}>
        //     <FaWhatsapp size={screen <= 768 ? 22 : 40} color="white"/>
        // </a> */}

    )
}