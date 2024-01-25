import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuMobile } from './MenuMobile';
import { TopNavBar } from './TopNavBar';

export function LandingPage(props: { menuOpen: boolean; setMenuOpen: (_v: boolean) => void; }) {
  return <>
    {props.menuOpen && <MenuMobile close={() => { props.setMenuOpen(false); }} />
      || <LandingPageBody setMenuOpen={props.setMenuOpen} />}
  </>;
}
function LandingPageBody(props: { setMenuOpen: (_v: boolean) => void; }) {
  return (<div className="bg-lime-900">
    <TopNavBar action={() => { props.setMenuOpen(true); }} inMenu={false} />
    <div className="p-5 bg-lime-900 w-full min-h-screen">
      <h1 className="max-w-xl text-5xl text-lime-400 font-bold mt-20 main_font">Your own internet hub in just a few clicks.</h1>
      <p className="max-w-xl text-lime-400 mt-5 main_font">Linkhub is a fully functional <i>Linktr.ee</i> clone built with <b className="text-blue-200">React</b>, <b className="text-purple-200">Tailwind</b>, <b className="text-teal-200">Typescript</b>, <b className="text-yellow-200">NodeJs+Express</b> and fully deployed with <b className="text-green-200">Nginx</b> and <b className="text-red-200">SSL certificate</b>. It features a secure api, authentification and authorization built from scratch, database, file upload and it integrate with the <b className="text-blue-200">Stripe API</b>.</p>
      <LandingPageForm />
    </div>
    <div className="p-5 bg-pink-200 w-full min-h-screen">
      <h1 className="max-w-xl text-5xl text-purple-900 font-bold mt-10 main_font">React + Tailwind for a clear design</h1>
      <p className="max-w-xl mt-5 mb-10">- React router for the routing</p>
      <p className="max-w-xl mt-5 mb-10">- Tailwind + Vite compilation = Very tiny css; was pleasantly surprised by the flexibility of micro-classes, who make a lot of sense in a component based UI framework</p>
      <a className="bg-purple-900 p-5 mt-20 rounded-full text-white cursor-pointer select-none">Get started for free</a>
    </div>
    <div className="p-5 bg-red-900 w-full min-h-screen">
      <h1 className="max-w-xl text-5xl text-pink-200 font-bold mt-10 main_font">Secure login and API, from scratch</h1>
      <p className="max-w-xl mt-5 mb-10 text-pink-200"> Input validated on the front and backend</p>
	    <p className="max-w-xl mt-5 mb-10 text-pink-200">- Encrypted passwords in db</p>
	    <p className="max-w-xl mt-5 mb-10 text-pink-200">- All private route necessitate a valid JWT</p>
	    <p className="max-w-xl mt-5 mb-10 text-pink-200">- All secrets are stored in env variables</p>
      <a className="bg-pink-200 p-5 mt-20 rounded-full text-black cursor-pointer select-none">Get started for free</a>
    </div>
    <div className="p-5 bg-pink-200 w-full min-h-screen">
      <h1 className="max-w-xl text-5xl text-purple-900 font-bold mt-10 main_font">Stripe API for subscription</h1>
      <p className="max-w-xl mt-5 mb-10">Each costumer have an associated Stripe id which allow to track</p>
      <p className="max-w-xl mt-5 mb-10">- Subscription</p>
      <p className="max-w-xl mt-5 mb-10">- We store the end of the current period, this way we reduce latency by only calling the stripe API when the day of the last stored period is over</p>
      <p className="max-w-xl mt-5 mb-10">- Integration was very straight forward</p>
      <a className="bg-purple-900 p-5 mt-20 rounded-full text-white cursor-pointer select-none">Get started for free</a>
    </div>
    <div className="p-5 bg-red-900 w-full min-h-screen">
      <h1 className="max-w-xl text-5xl text-pink-200 font-bold mt-10 main_font">Image uploading and rescaling</h1>
      <p className="max-w-xl mt-5 mb-10 text-pink-200">Always an image sent to the server because I process the resizing on the client side with the canva api</p>
      <p className="max-w-xl mt-5 mb-10 text-pink-200">Unique filename to avoid duplicated image</p>
      <p className="max-w-xl mt-5 mb-10 text-pink-200">Protected by JWT</p>
      <a className="bg-pink-200 p-5 mt-20 rounded-full text-black cursor-pointer select-none">Get started for free</a>
    </div>
  </div>);
}

function LandingPageForm(){
  const [formValue, setFormValue] = useState<string>("")

  const navigate = useNavigate()

  const regex = /^[a-z0-9]*$/;
  const regex_filter = /[a-z0-9]*/g;

  return (
    <>
    <form className="mt-3">
      <input className="rounded-md h-full p-4 text-lg" type="text" placeholder="linkhub.com/yourname" pattern="\w{2,16}" onChange={(e)=>{

        e.target.value = e.target.value.toLowerCase()
        if (!regex.test(e.target.value)){
          //NOTE(Nighten) The regex filter is used to prevent the user from copy-pasting wrong input into the field 
          e.target.value = (e.target.value.match(regex_filter) || []).join('');
        }
        setFormValue(e.target.value)
      }}
      onKeyDown={(e)=>{if (e.key === "Enter") navigate(`/register?id=${formValue}`)}}></input>
      <Link className="cursor-pointer select-none bg-pink-200 p-4 ml-2 rounded-full text-lg" to={`/register?id=${formValue}`}>Claim your Linkhub</Link>
    </form>
    </>
  )
}
