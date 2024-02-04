import { useState, useEffect, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';

import plusIcon from './assets/plus-solid.svg'
import minusIcon from './assets/minus-solid.svg'
import loadIcon from './assets/load.gif'
import starIcon from './assets/star-solid.svg'
import { CheckSubscription } from './CheckSubscription';

let EditUserTimeOut:ReturnType<typeof setTimeout>;

//NOTE(Nighten) We keep a global state object that hold a copy of the user data
// This is used solely for API call to the database, so that multiple edits on different field can be batched
let UserData_API:any = {token:"", name:"", avatar:"", tagline:"", bgcolor:"", links:""}

export function Dashboard() {

  const user_token:string = window.localStorage.getItem("sessionId") as string;

  const [user_id, setUserId] = useState<string>("")
  const [username, setUsername] = useState<string>("your name")
  const [tagline, setTagline] = useState<string>("your tagline")
  const [avatar, setAvatar] = useState<string>("default.jpg")
  const [bgColor, setBgColor] = useState<string>("green")

  const [isPremium, setIsPremium] = useState<boolean>(false)

  const [links, setLinks] = useState<{id:number, text:string, target:string, color:string}[]>(
    []
  )

  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [loadingDone, setLoadingDone] = useState<boolean>(false);

  const [premiumloading, setPremiumloading] = useState<boolean>(false);

  const [savedFeedbackStage, setSavedFeedbackStage] = useState<string>("hidden");

  useEffect(
    ()=>{
      fetch(`${import.meta.env.VITE_SERVER_URL}/linkhub/user?token=${user_token}`).then((res)=>{
      if (!res.ok) {
        throw new Error('Something went wrong');
      }
      res.json().then((data)=>{
        console.log(data)

        setUserId(data.id)
        setUsername(data.name);
        setTagline(data.tagline);
        setBgColor(data.bgcolor);
        setAvatar(data.avatar);
        setLinks((data.links!=undefined)?data.links:[]);

        setLoadingDone(true);

        UserData_API = {
          token:user_token,
          name: data.name,
          tagline: data.tagline,
          bgcolor: data.bgcolor,
          avatar: data.avatar,
          links: (data.links!=undefined)?data.links:[]
        }

        CheckSubscription(data.id, data.sub_end, setIsPremium)
        
      })}).catch((_error) => {
        setLoadingDone(true);
        setUserNotFound(true);
      });
    
    }, [])

  const EditField = useCallback((new_value:any, field:string, pCallBack:any)=>{
    pCallBack(new_value);
    
    UserData_API[field] = new_value;

    clearTimeout(EditUserTimeOut);
    EditUserTimeOut = setTimeout(() => {
      SendUserToDB(UserData_API, setSavedFeedbackStage)
    }, 1500)
  }, []);

  const AddLink = useCallback((pPosition:number)=>{
    setLinks((v:any)=>{
      let new_id = function(links:any){
        let max_id = 0;
        links.forEach((l:any)=>{ if (l.id>=max_id) max_id=l.id+1; })
        return max_id;
      }(v);

      const new_v = v.toSpliced(pPosition,0,{ id: new_id, text: "My Link", target: "https://linkhub.com", color: "green" })

      EditField(new_v, "links", (_foo:any)=>{});
      return new_v;
    })
  }, []);
  const RemoveLink = useCallback((pPosition:number)=>{
    setLinks((v:any)=>{
      const new_v = v.filter((_l:any, lindex:number)=>{
        return (lindex != pPosition);
      })
      EditField(new_v, "links", (_foo:any)=>{});
      return new_v;
    })
  }, []);

  return (<div className={`w-screen min-h-screen bg-${bgColor}-500 absolute top-0`}>
    {loadingDone ? <>
    {userNotFound ? <Navigate to="/" /> :
    <div className="flex flex-col items-center m-auto mt-20 mb-20 p-5 max-w-lg bg-white rounded drop-shadow-xl">
      <UserSavedFeedback anim={savedFeedbackStage}/>
      <BackgroundColorSelector bgcolor={bgColor} setbgcolor={(new_color)=>{EditField(new_color, "bgcolor", setBgColor)}} />
      <Link to="/" className="absolute p-3 top-0 left-0 hover:underline cursor-pointer select-none  shadow rounded-full m-2 bg-slate-100 hover:bg-slate-200"
        onClick={()=>{window.localStorage.clear()}}>
        {"Logout"}
      </Link>
      <AvatarUploadButton avatar={avatar} isPremium={isPremium} user_token={user_token} setAvatar={setAvatar} setSavedFeedbackStage={setSavedFeedbackStage} />
      <a href={`${import.meta.env.VITE_SERVER_URL}/${user_id}`} target="_blank"
          className="absolute p-3 top-0 right-0 hover:underline cursor-pointer select-none shadow rounded-full m-2 bg-slate-100 hover:bg-slate-200">
        {"View your linkhub"}
      </a>
      
      <form onSubmit={(e)=>{
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      }}>
      <input className="p-3 w-full text-center text-2xl mb-5 border-dashed border-2 border-gray rounded-full"
        defaultValue={username} onChange={(e)=>{EditField(e.target.value, "name", setUsername)}} />
      <input className="p-3 w-full text-center mb-10 border-dashed border-2 border-gray rounded-full"
        defaultValue={tagline} onChange={(e)=>{EditField(e.target.value, "tagline", setTagline)}} />
      <button className="hidden" type="submit">Submit</button>
      </form>
      <AddButton insertId={0} action={AddLink} />
      {links.map((l, l_id)=><ProfileEditLink key={l.id} text={l.text} target={l.target} color={l.color} id={l_id}
      edit={(text:string, target:string, color:string)=>{
        setLinks((ListLinks)=>{
        const new_ListLinks = ListLinks.map((link, link_index)=>{
          if (link_index == l_id) link = {id:link.id, text:text, target:target, color:color}
          return link
        })
        EditField(new_ListLinks, "links", (_foo:any)=>{})
        return new_ListLinks
        }
      )}}
      add={AddLink}
      remove={RemoveLink}
      />)}
    {!isPremium && <a className="absolute bottom-0 p-5 bg-yellow-300 hover:bg-white rounded-full -mb-20 cursor-pointer select-none"
      onClick={()=>{
        if (premiumloading) return
        setPremiumloading(true)
        fetch(`${import.meta.env.VITE_SERVER_URL}/pay/checkout`, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user_token
          })
        }).then((res)=>{if (res.ok) res.json().then(
          (data)=>{
            window.location = data.url;
          }
        )})
      }}
    >{premiumloading?<img className="w-6" src={loadIcon} />:"Go Premium"}</a>}
    </div>
    }</>
    :<p>Loading profile...</p>}
  </div>);
}

function AvatarUploadButton(props:{avatar: string, isPremium: boolean, user_token: string, setAvatar:(_v:string)=>void, setSavedFeedbackStage:(_v:string)=>void}) {
  const submitAvatar = useCallback((event:React.ChangeEvent<HTMLInputElement>) => {
    console.log("Avatar input entered...");
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e:any)=>{
      if (e.target !== null && e.target.result !== null) {
        ScaleImageAndUpload(e.target.result as string, props.user_token, props.setAvatar, props.setSavedFeedbackStage);
      }
      });
    if (event.target.files){
      const file = event.target.files[0];
      if (file!==null){
        fileReader.readAsDataURL(file)
      }
    }
  }, [])
  
  return <form className="-mt-10 mb-2 p-2 border-dashed border-2 border-gray hover:opacity-80 w-22 h-22 rounded-full cursor-pointer relative">
    <input className="absolute w-20 h-20" type="file" id="avatar_upload_input" name="img" accept="image/*" onChange={submitAvatar} />
    <label htmlFor="avatar_upload_input" className="cursor-pointer"><img src={`avatar/${props.avatar}`} className="bg-blue-300 w-20 h-20 rounded-full shadow" /></label>
    {props.isPremium ? <img className="absolute -right-3 bottom-0 drop-shadow-xl w-9" src={starIcon} /> : null}
  </form>;
}

function ProfileEditLink(props:{text:string, target:string, color:string, id:number, edit:(_text:string, _target:string, _color:string)=>void, add:(_id:number)=>void, remove:(_id:number)=>void}){
  return (
  <form className="w-full relative" onSubmit={(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }}>
      <ButtonColorSelector bgcolor={props.color} setbgcolor={(newcolor:string)=>{props.edit(props.text, props.target, newcolor)}}/>
      <DeleteButton insertId={props.id} action={props.remove} />
      <input className={`p-4 pt-3 pb-9 bg-${props.color}-500 text-white hover:bg-${props.color}-400 rounded-full m-2 w-full text-center border-dashed border-2 border-gray`}
        defaultValue={props.text}
        onChange={(e)=>{props.edit(e.target.value, props.target, props.color)}}
      />
      <div className="flex justify-center w-full">
        <input className={"absolute bottom-8 p-1 w-80 text-xs rounded-full text-center border-dashed border-2 border-gray"}
        defaultValue={props.target}
        onChange={(e)=>{props.edit(props.text, e.target.value, props.color)}}
      />
      </div>
      <button className="hidden" type="submit">Submit</button>
      <AddButton insertId={props.id+1} action={props.add}/>
  </form>)
}

function AddButton(props:{insertId:number, action:(_id:number)=>void}){
  return <div className="-mt-3 -mb-3 w-full opacity-50 hover:opacity-100 cursor-pointer flex justify-center"
    onClick={()=>{props.action(props.insertId)}} >
    <div className="border-solid border-2 border-black flex justify-center w-10 h-10 text-center hover:bg-gray-200 rounded-full"><img src={plusIcon} alt="add" /></div>
  </div>
}
function DeleteButton(props:{insertId:number, action:(_id:number)=>void}){
  return <div className="absolute right-0 top-6 -mr-3 opacity-50 hover:opacity-100 cursor-pointer flex justify-center"
    onClick={()=>{props.action(props.insertId)}}>
    <div className="border-solid border-2 border-black flex justify-center w-10 h-10 text-center hover:bg-gray-200 rounded-full shadow"><img src={minusIcon} alt="remove" /></div>
  </div>
}

function BackgroundColorSelector(props:{bgcolor:string, setbgcolor:(_c:string)=>void}){

  const [selectorOpen, setSelectorOpen] = useState<boolean>(false)

  const possible_colors:string[] = [
    "green", "pink", "purple", "red", "blue"
  ] 

  return <div className="absolute top-0 left-0 flex items-center -mt-16 p-2 m-auto max-w-lg bg-white rounded-full shadow cursor-pointer">
        {selectorOpen ? <>
          <div className={`w-8 h-8 rounded-full bg-${props.bgcolor}-500 mr-3`} onClick={()=>{setSelectorOpen(false)}}></div>
          {possible_colors.map((c)=>{ 
            if (c!=props.bgcolor) return <div key={c} className={`w-8 h-8 rounded-full bg-${c}-500 mr-3`} onClick={()=>{props.setbgcolor(c); setSelectorOpen(false)}}></div>})}
        </>:
        <>
          <div className={`w-8 h-8 rounded-full bg-${props.bgcolor}-500 mr-3`} onClick={()=>{setSelectorOpen(true)}}></div>
          <span className="mr-3" onClick={()=>{setSelectorOpen(true)}}>Background Color</span>
        </>}
      </div>
}
function ButtonColorSelector(props:{bgcolor:string, setbgcolor:(_c:string)=>void}){

  const [selectorOpen, setSelectorOpen] = useState<boolean>(false)

  const possible_colors:string[] = [
    "green", "pink", "purple", "red", "blue"
  ] 

  return <div className="absolute left-0 flex items-center p-2 m-auto max-w-lg bg-white rounded-full shadow cursor-pointer">
        {selectorOpen ? <>
          <div className={`w-8 h-8 rounded-full bg-${props.bgcolor}-500 mr-3`} onClick={()=>{setSelectorOpen(false)}}></div>
          {possible_colors.map((c)=>{ 
            if (c!=props.bgcolor) return <div key={c} className={`w-8 h-8 rounded-full bg-${c}-500 mr-3`} onClick={()=>{props.setbgcolor(c); setSelectorOpen(false)}}></div>})}
        </>:
        <>
          <div className={`w-8 h-8 rounded-full bg-${props.bgcolor}-500`} onClick={()=>{setSelectorOpen(true)}}></div>
          {/* <span className="mr-3" onClick={()=>{setSelectorOpen(true)}}>Color</span> */}
        </>}
      </div>
}

function UserSavedFeedback(props:{anim:string}){
  return <div className={"absolute top-0 right-0 flex items-center -mt-16 p-3 m-auto max-w-lg bg-yellow-200 rounded-full shadow "+props.anim}>
      Profile Saved!
    </div>;
}

function SendUserToDB(user:{
  token:string;
  name: string;
  avatar: string;
  tagline: string;
  bgcolor: string;
  links: { id: number; text: string; target: string; color: string; }[]}, pFeedback:(_v:string)=>void){
    console.log("Sending user data to database...")

    fetch(`${import.meta.env.VITE_SERVER_URL}/linkhub/user`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    }).then((res)=>{
      if (res.ok) RunFeedBackAnimation(pFeedback);
    })
}

function RunFeedBackAnimation(pFeedback: (_v: string) => void) {
  pFeedback("animate-bounce");
  setTimeout(() => { pFeedback("hidden"); }, 1000);
}

function ScaleImageAndUpload(pValue:string, pUserToken:string, pCallBack:(_filename:string)=>void, pCallBackFeedback:(_value:string)=>void){
  console.log("Scaling and uploading...")
  
  const filetype="image/jpeg";
  var img = document.createElement("img");
  img.onload = (_event)=>{
      console.log("Image loaded, rescaling...");
      // Dynamically create a canvas element
      var canvas = document.createElement("canvas");

      // var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      if (ctx == null) {throw "NO CONTEXT FOUND"; return;}

      canvas.width = 512;
      canvas.height = 512;

      // Actual resizing
      //https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
      var hRatio = canvas.width/img.width;
      var vRatio = canvas.height/img.height;
      var ratio  = Math.max ( hRatio, vRatio );
      var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      var centerShift_y = ( canvas.height - img.height*ratio ) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);

      // Show resized image in preview element
      var dataURI = canvas.toDataURL(filetype, 0.5);
      
      upload_image(dataURI, pUserToken, pCallBack, pCallBackFeedback)
      // document.getElementById("preview").src = dataurl;
  }
  // img.setAttribute('crossorigin', 'anonymous');
  // img.crossOrigin = "anonymous";
  img.src = pValue;
  // console.log(img.src)
}

function upload_image(pData:string, pUserToken:string, pCallBack:(_filename:string)=>void, pCallBackFeedback:(_value:string)=>void){
  try{
    fetch(`${import.meta.env.VITE_SERVER_URL}/linkhub/upload`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: pUserToken,
        data: pData
      })
    }).then((res:any)=>{if (res.ok) res.json().then((data:any)=>{
      pCallBack(data.filename)
      RunFeedBackAnimation(pCallBackFeedback)
    })})
  }catch(err){
    console.log(err)
  }

}