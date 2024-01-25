import { Link } from 'react-router-dom';
import logo from './assets/Logo.svg'

export function TopNavBar(props: { action: () => void; inMenu: boolean; }) {
  return (
    <>
      <div className="flex items-center mr-5 ml-5 p-3 rounded bg-white rounded-full sticky top-4 max-w-full">
        <div className="cursor-pointer select-none mr-auto ml-2">
          <img src={logo} alt="logo"/>
        </div>
        <Link to={"/login"} className="cursor-pointer select-none p-3 bg-zinc-200 hover:bg-zinc-300 rounded">Log in</Link>
        <Link to={"/register"} className="cursor-pointer select-none p-3 ml-1 text-white bg-black hover:bg-gray-800 rounded-full">Sign up free</Link>
        <a className={"cursor-pointer select-none flex place-content-center ml-3 mr-1 p-3 " + (props.inMenu ? "bg-green-800 rounded-full" : "bg-white")} onClick={props.action}>
          <div className="w-4 h-4">
            {!props.inMenu &&
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
              || <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 384 512"><path fill="#FFF" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>}
          </div>
        </a>
      </div>
    </>
  );
}
