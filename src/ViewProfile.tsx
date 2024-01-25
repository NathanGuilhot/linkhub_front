import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from './assets/Logo.svg'
import starIcon from './assets/star-solid.svg'

import { CheckSubscription } from './CheckSubscription';

export function ViewProfile() {

  const { username_url } = useParams();
  const user_logged:boolean = ((window.localStorage.getItem("sessionId") as string) === username_url);
  
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [bgColor, setBgColor] = useState<string>("pink")

  const [isPremium, setIsPremium] = useState<boolean>(false);

  const [links, setLinks] = useState<{id:number, text:string, target:string, color:string}[]>(
    []
  )

  useEffect(
    ()=>{
      fetch(`http://localhost:3003/linkhub/user/public?name=${username_url}`).then((res)=>{
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      res.json().then((data)=>{
        console.log(data)

        setUsername(data.name);
        setAvatar(data.avatar);
        setTagline(data.tagline);
        setLinks((data.links!=undefined)?data.links:[]);
        setBgColor(data.bgcolor);
        setLoadingDone(true);

        CheckSubscription(data.id, data.sub_end, setIsPremium)
        
      })}).catch((_error) => {
        setLoadingDone(true);
        setUserNotFound(true);
      });

    
    }, [])

  return (
    <div className={`w-screen h-screen bg-${bgColor}-500 fixed`}>
      {loadingDone ?
      <>
      {userNotFound ? <UserNotFound />
      :<><div className="flex flex-col items-center m-auto mt-20 p-5 max-w-lg bg-white rounded drop-shadow-xl">
        <div className="-mt-10 mb-2 w-20 h-20 relative">
          <img src={`avatar/${avatar}`} className="w-20 h-20 rounded-full shadow"/>
          {isPremium?<img className="absolute -right-3 bottom-0 drop-shadow-xl w-9" src={starIcon} />:null}
        </div>
        <p className="text-2xl mb-5">{username}</p>
        <p>{tagline}</p>
        {links.map((l)=><ProfileLink key={l.id} text={l.text} target={l.target} color={l.color} />)}
        
      </div>
      <div className="mt-10 flex justify-center	">
          {user_logged?
          <Link to={"/edit"}>Edit this page <img className="inline w-5" src={logo} alt="logo"/></Link>:
          <Link to={"/"}>Powered by Linkhub <img className="inline w-5" src={logo} alt="logo"/></Link>}
      </div></>
      }
    </>:
    <p>Loading...</p>}
  </div>
  )
}

function ProfileLink(props:{text:string, target:string, color:string}){
  return <a className={`p-4 bg-${props.color}-500 text-white hover:bg-${props.color}-400 rounded-full m-2 w-full text-center select-none`} 
      href={props.target} target="_blank">
    {props.text}
    </a>
}

function UserNotFound(){
  return <div className="flex flex-col items-center m-auto mt-20 p-5 max-w-lg bg-white rounded drop-shadow-xl">
    <p className="text-2xl mb-5">Oops!</p>
    <p className="mb-5">No user was found at this page</p>
    <Link to={"/"} className="p-4 bg-blue-500 text-white hover:bg-blue-400 rounded-full m-2 w-full text-center select-none">Back to Linkhub</Link>
  </div>
}