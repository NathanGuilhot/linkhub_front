import { ReactNode, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "./assets/Logo.svg";

function UserForm(props: { children: ReactNode; bottomLink: ReactNode }) {
  return (
    <div className="w-screen h-screen bg-white fixed">
      <Link to={"/"} className="absolute p-5 flex cursor-pointer">
        <img src={logo} />
        <span className="ml-1">LinkHub</span>
      </Link>
      <div className="flex flex-col m-auto mt-20 p-5 max-w-lg bg-white rounded drop-shadow-xl">
        {props.children}
      </div>
      <div className="mt-10 flex justify-center	">{props.bottomLink}</div>
    </div>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPass] = useState<string>("");
  const [passVisible, setPassVisible] = useState<boolean>(false);

  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const SubmitAction = useCallback(async () => {
    try {
      await LoginAction(email, password, setLoginSuccess);
    } catch (error) {
      console.log(error);
    }
    console.log("Submit action completed");
  }, [email, password]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(loginSuccess);
    if (loginSuccess) {
      navigate("/edit");
    }
  }, [loginSuccess]);

  return (
    <UserForm
      bottomLink={
        <Link to={"/register"}>
          New to LinkHub? <span className="text-blue-500">Join now</span>
        </Link>
      }
    >
      <h1 className="text-3xl font-bold">Login</h1>
      <p>Login and start editing your links</p>
      <form
        className="flex flex-col mt-3 mb-5"
        onSubmit={(e) => {
          e.preventDefault();
          SubmitAction();
        }}
      >
        <input
          className="mb-2 mt-2 p-4 border-solid border-2 rounded"
          type="text"
          placeholder="Email"
          defaultValue={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="w-full relative">
          <input
            id="InputPass"
            className="w-full mb-2 mt-2 p-4 border-solid border-2 rounded"
            type={passVisible ? "text" : "password"}
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <span
            className="absolute top-6 right-5 text-blue-500 cursor-pointer select-none"
            onClick={() => {
              setPassVisible((v) => !v);
            }}
          >
            {passVisible ? "hide" : "show"}
          </span>
        </div>
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-full text-center cursor-pointer select-none"
          onClick={() => {
            SubmitAction();
          }}
        >
          Login
        </button>
        <Link className="text-blue-500 mt-2" to={"/"}>
          Forgot password?
        </Link>
      </form>
      <DemoLoginButton setLoginSuccess={setLoginSuccess} />
    </UserForm>
  );
}

function DemoLoginButton(props: { setLoginSuccess: (_v: boolean) => void }) {
  return (
    <button
      className="p-3 bg-green-500 text-white rounded-full text-center cursor-pointer select-none mt-1"
      onClick={async () => {
        LoginAction("demo@demo.com", "demo", props.setLoginSuccess);
      }}
    >
      Login with demo account
    </button>
  );
}

async function LoginAction(
  pEmail: string,
  pPass: string,
  pCallBack: (_result: boolean) => void
) {
  if (pEmail.length == 0 || pPass.length == 0)
    throw "All fields have to be completed";
  const UserInfo: any = {
    email: pEmail,
    password: pPass,
  };

  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/linkhub/user/login`,
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(UserInfo),
    }
  );
  if (!res.ok) {
    throw "Server error";
    return;
  }
  const data = await res.json();
  window.localStorage.setItem("sessionId", data["sessionId"]);
  pCallBack(true);
  return;
}
async function RegisterAction(
  pName: string,
  pEmail: string,
  pPass: string,
  pPassConfirm: string,
  pCallback: (_b: boolean) => void
) {
  if (pName.length == 0 || pEmail.length == 0 || pPass.length == 0)
    throw "All fields have to be completed";
  if (pPass !== pPassConfirm) throw "The passwords don't match";
  //TODO(Nighten) Check if the password is strong enough

  const UserInfo: any = {
    id: pName.toLowerCase(),
    email: pEmail,
    password: pPass,
  };

  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/linkhub/user`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(UserInfo),
  });
  if (!res.ok) {
    throw "Server error";
    return;
  }
  const data = await res.json();
  window.localStorage.setItem("sessionId", data["sessionId"]);
  pCallback(true);
}

export function RegisterForm() {
  //Check if the get param id is set, if so this is the default value for name
  //(comes from the quickform on the landing page)
  const [searchParams] = useSearchParams();
  const defaultname = searchParams.get("id");

  const [name, setName] = useState<string>(defaultname ? defaultname : "");
  const [email, setEmail] = useState<string>("");
  const [password, setPass] = useState<string>("");
  const [password_confirm, setPassConfirm] = useState<string>("");

  const [passVisible, setPassVisible] = useState<boolean>(false);
  const [passConfirmVisible, setPassConfirmVisible] = useState<boolean>(false);

  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const SubmitAction = useCallback(async () => {
    try {
      await RegisterAction(
        name,
        email,
        password,
        password_confirm,
        setLoginSuccess
      );
    } catch (error) {
      console.log(error);
    }
  }, [name, email, password, password_confirm]);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(loginSuccess);
    if (loginSuccess) {
      navigate("/edit");
    }
  }, [loginSuccess]);

  const username_regex = /^[a-z0-9]*$/;
  const username_regex_filter = /[a-z0-9]*/g;

  return (
    <UserForm
      bottomLink={
        <Link to={"/login"}>
          Already have an account? <span className="text-blue-500">Login</span>
        </Link>
      }
    >
      <h1 className="text-3xl font-bold">Register your LinkHub</h1>
      <p>Give access to your personality with one link</p>
      <form
        className="flex flex-col mt-3 mb-5"
        onSubmit={(e) => {
          e.preventDefault();
          SubmitAction();
        }}
      >
        <input
          className="mb-2 mt-2 p-4 border-solid border-2 rounded"
          type="text"
          placeholder="Username (linkhub.com/yourname)"
          defaultValue={name}
          onChange={(e) => {
            e.target.value = e.target.value.toLowerCase();
            if (!username_regex.test(e.target.value)) {
              //NOTE(Nighten) The regex filter is used to prevent the user from copy-pasting wrong input into the field
              e.target.value = (
                e.target.value.match(username_regex_filter) || []
              ).join("");
            }
            setName(e.target.value);
          }}
        />
        <input
          className="mb-2 mt-2 p-4 border-solid border-2 rounded"
          type="email"
          placeholder="Email"
          defaultValue={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="w-full relative">
          <input
            id="InputPass"
            className="w-full mb-2 mt-2 p-4 border-solid border-2 rounded"
            type={passVisible ? "text" : "password"}
            placeholder="Password"
            defaultValue={password}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <span
            className="absolute top-6 right-5 text-blue-500 cursor-pointer select-none"
            onClick={() => {
              setPassVisible((v) => !v);
            }}
          >
            {passVisible ? "hide" : "show"}
          </span>
        </div>
        <div className="w-full relative">
          <input
            id="InputPassConfirm"
            className="w-full mb-2 mt-2 p-4 border-solid border-2 rounded"
            type={passConfirmVisible ? "text" : "password"}
            placeholder="Confirm"
            defaultValue={password_confirm}
            onChange={(e) => {
              setPassConfirm(e.target.value);
            }}
          />
          <span
            className="absolute top-6 right-5 text-blue-500 cursor-pointer select-none"
            onClick={() => {
              setPassConfirmVisible((v) => !v);
            }}
          >
            {passConfirmVisible ? "hide" : "show"}
          </span>
        </div>
        <button
          className="p-3 bg-blue-500 text-white rounded-full text-center select-none"
          type="submit"
        >
          Join now
        </button>
      </form>
      <DemoLoginButton setLoginSuccess={setLoginSuccess} />
    </UserForm>
  );
}
