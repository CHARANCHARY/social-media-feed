import discodeIcon from "../Assests/discord.svg"
import Facebook from "../Assests/fb.svg"
import Instagram from "../Assests/insta.svg"
import messanger from "../Assests/messanger.svg"
import reddit from "../Assests/reddit.svg"
import Telegram from "../Assests/telegram.svg"
import WhatsApp from "../Assests/wp.svg"
import twitter from "../Assests/twitter.svg"
import { useState } from "react"
import copy from "../Assests/copy.svg"
const SharePopup = ({ handlechangeShare }) => {

    const shareUrl = window.location.href;
    const message = "Check this out: "; 
    const socialMedia = [
        { name: "Twitter", icon: twitter, bgColor: "#E9F6FB",    socialMediaLink: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message + shareUrl)}` },
        { name: "Facebook", icon: Facebook, bgColor: "#E7F1FD", socialMediaLink: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`},
        { name: "Reddit", icon: reddit, bgColor: "#FDECE7", socialMediaLink: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(message)}` },
        { name: "Discord", icon: discodeIcon, bgColor: "#ECF5FA" , socialMediaLink: `https://discord.com/channels/@me?content=${encodeURIComponent(message + shareUrl)}` },
        { name: "WhatsApp", icon: WhatsApp, bgColor: "#E7FBF0" ,    socialMediaLink: `https://api.whatsapp.com/send?text=${encodeURIComponent(message + shareUrl)}`    },
        { name: "Messenger", icon: messanger, bgColor: "#E5F3FE",     socialMediaLink: `https://www.messenger.com/t?link=${encodeURIComponent(shareUrl)}`  },
        { name: "Telegram", icon: Telegram, bgColor: "#E6F3FB",     socialMediaLink: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`},
        { name: "Instagram", icon: Instagram, bgColor: "#FF40C617" ,    socialMediaLink: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`    },
    ]





    const [copySuccessfull, setCopySuccessfull] = useState(false);

  

    const handleCopy = () => {
    
    

        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            setCopySuccessfull(true);
            
            setTimeout(() => setCopySuccessfull(false), 2000);
          })
          .catch((error) => {
            console.error('Error copying text to clipboard: ', error);
          });
      };








    const handleOnclick = ()=>{
        handlechangeShare();
    }



   





    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[1001] flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[1.3rem] leading-[1.6] font-karla font-extrabold  ">Share post</h2>
                    <div className="rounded-full bg-[#F5F5F5] w-[2rem] h-[2rem] justify-center items-center flex">
                        <button
                            onClick={handleOnclick}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {socialMedia.map((item) => (
                        <div
                            key={item.name}
                            className="flex flex-col items-center text-center text-sm"
                        >
                            <a style={{ backgroundColor: item.bgColor }}
                                 href={item.socialMediaLink}
                                 target="_blank"
                                  rel="noopener noreferrer"
                                className={`w-[3.5rem] h-[3.5rem] flex flex-col items-center justify-center rounded-full`}>
                                <img src={item.icon} alt={item.name} />
                            </a>
                            <i className="mt-2 font-Kumbh text-[0.75rem] leading-[0.93rem] text-[#696565] ">{item.name}</i>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <label className="block text-gray-700 font-Karla font-semibold  leading-[1.16rem] text-[1rem]">
                        Page Link
                    </label>
                    <div className="flex items-center mt-[0.5rem] border border-gray-300 rounded px-2 py-1">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-grow bg-transparent outline-none text-gray-600"
                        />
                        <button onClick={handleCopy} className=" ml-2">
                            <img src={copy} alt="copy" className="w-[1.25rem] h-[1.25rem]" />
                        </button>
                    </div>
                </div>
            </div>
            {copySuccessfull &&
                <div className="absolute top-[5%] left-0 right-0 flex justify-center items-center">
                    <button className="bg-[#D9D9D9] text-black px-[1rem] rounded-lg font-karla h-[1.5rem]  ">
                        Copied
                    </button>
                </div>}
        </div>
    );
};

export default SharePopup;
