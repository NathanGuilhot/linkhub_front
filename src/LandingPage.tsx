import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuMobile } from "./MenuMobile";
import { TopNavBar } from "./TopNavBar";

import PictureDemo01 from "./assets/frontpage/PictureDemo01.webp";

export function LandingPage(props: {
  menuOpen: boolean;
  setMenuOpen: (_v: boolean) => void;
}) {
  return (
    <>
      {(props.menuOpen && (
        <MenuMobile
          close={() => {
            props.setMenuOpen(false);
          }}
        />
      )) || <LandingPageBody setMenuOpen={props.setMenuOpen} />}
    </>
  );
}
function LandingPageBody(props: { setMenuOpen: (_v: boolean) => void }) {
  return (
    <div className="bg-lime-900">
      <TopNavBar
        action={() => {
          props.setMenuOpen(true);
        }}
        inMenu={false}
      />
      <div className="p-5 bg-lime-900 w-full min-h-screen">
        <h1 className="max-w-xl text-5xl text-lime-400 font-bold mt-20 main_font">
          Your own internet hub in just a few clicks.
        </h1>
        <p className="max-w-xl text-lime-400 mt-5 main_font">
          Linkhub is a fully functional <i>Linktr.ee</i> clone built with{" "}
          <b className="text-blue-200">React</b>,{" "}
          <b className="text-purple-200">Tailwind</b>,{" "}
          <b className="text-teal-200">Typescript</b>,{" "}
          <b className="text-yellow-200">NodeJs+Express</b> and fully deployed
          with <b className="text-green-200">Nginx</b> and{" "}
          <b className="text-red-200">SSL certificate</b>. It features a secure
          api, authentification and authorization built from scratch, database,
          file upload and it integrate with the{" "}
          <b className="text-blue-200">Stripe API</b>.
        </p>
        <LandingPageForm />
      </div>
      <div className="p-5 bg-pink-200 w-full min-h-screen block lg:flex">
        <div className="flex-2">
          <h1 className="max-w-xl text-5xl text-purple-900 font-bold mt-10 main_font">
            React + Tailwind for a clear design
          </h1>
          <p className="max-w-xl mt-5">
            The whole UI of the application has been developed with
            state-of-the-art tools such as Vite for the live server, React for
            the component based UI, React Router Dom to handle the application
            routing, and Tailwind for the CSS.
          </p>
          <p className="max-w-xl mt-5 mb-10">
            Combining Tailwind and Vite's compilation allows for a very
            optimized file size for the whole project, improving load
            performance, which is something I care about.
          </p>
          <Link
            className="bg-purple-900 p-5 mt-20 mb-10 rounded-full text-white cursor-pointer select-none"
            to={"/register"}
          >
            Get started for free
          </Link>
        </div>
        <div className="flex-1 p-5 m-5 mt-10">
          <img
            alt="Demo picture of the Linkhub UI"
            src={PictureDemo01}
            className="rounded-xl w-100"
          />
        </div>
      </div>
      <div className="p-5 bg-red-900 w-full min-h-screen">
        <h1 className="max-w-xl text-5xl text-pink-200 font-bold mt-10 main_font">
          Secure login and API, from scratch
        </h1>
        <p className="max-w-xl mt-5 text-pink-200">
          API Security was one of the major learning goal for this project.
        </p>
        <p className="max-w-xl mt-5 text-pink-200">
          This manifests itself in multiple ways, such as obviously encrypting
          the password in the database, and verifying all API routes with a JSON
          Web Token (JWT).
        </p>
        <p className="max-w-xl mt-5 text-pink-200">
          JWT encryption allows each user to have a token that cannot be
          tampered with, and thus allowing us to authenticate the user for each
          of the sensitive API calls in a simple way.
        </p>
        <p className="max-w-xl mt-5 mb-10 text-pink-200">
          All secret variables, such as the encryption and API keys, are stored
          in an environment variable to allow the project to be fully open
          sourced without compromising its security.
        </p>
        <Link
          className="bg-pink-200 p-5 mt-20 mb-10 rounded-full text-black cursor-pointer select-none"
          to={"/register"}
        >
          Get started for free
        </Link>
      </div>
      <div className="p-5 bg-pink-200 w-full min-h-screen">
        <h1 className="max-w-xl text-5xl text-purple-900 font-bold mt-10 main_font">
          Stripe API for subscriptions
        </h1>
        <p className="max-w-xl mt-5">
          Integrating the payment API Stripe was also a major goal for this
          project.
        </p>
        <p className="max-w-xl mt-5">
          I incorporated a subscription by creating a Stripe Costumer profile
          for each new person joining the website. I then only store the end
          date of the current subscription period, this way we only have to call
          the Stripe API again once this period is over, reducing latency and
          data usage.
        </p>
        <p className="max-w-xl mt-5 mb-10">
          Learning and integrating the API was overall straightforward, I would
          gladly recommend it and use it again myself in future projects.
        </p>
        <Link
          className="bg-purple-900 p-5 mt-20 mb-10 rounded-full text-white cursor-pointer select-none"
          to={"/register"}
        >
          Get started for free
        </Link>
      </div>
      <div className="p-5 pb-10 bg-red-900 w-full min-h-screen">
        <h1 className="max-w-xl text-5xl text-pink-200 font-bold mt-10 main_font">
          Image uploading and rescaling
        </h1>
        <p className="max-w-xl mt-5 text-pink-200">
          In addition to the CRUD functionalities, I also implemented the
          ability to upload a custom profile picture to the server.
        </p>
        <p className="max-w-xl mt-5 text-pink-200">
          Any kind of user-facing interactions with the server represents a
          major security concern; that's why 
          <b>the raw file is never sent to the server</b>: instead, it goes
          through a rescale function that uses the browser canvas API. The image
          is rescaled, the raw pixels are captured and compressed, and only then
          sent to the server and saved on disk.
        </p>
        <p className="max-w-xl mt-5 text-pink-200">
          The upload route obviously requires a valid JWT, preventing a
          malicious user from affecting other accounts.
        </p>
        <p className="max-w-xl mt-5 mb-10 text-pink-200">
          Furthermore, the name of the individual images are set to the hash MD5
          of the image; this prevents what could be a SQL or XSS injection
          through a malicious filename. This also avoids storing the exact same
          image twice, saving space on the disk.
        </p>
        <Link
          className="bg-pink-200 p-5 mt-20 mb-10 rounded-full text-black cursor-pointer select-none"
          to={"/register"}
        >
          Get started for free
        </Link>
      </div>
      <div className="p-5 bg-white w-full">
        <h1 className="max-w-xl text-5xl text-pink-800 font-bold mt-10 mb-10 main_font">
          More about the project
        </h1>
        <p className="max-w-xl mt-5 hover:underline">
          <a
            target="_blank"
            href="https://github.com/NightenDushi/linkhub_front"
          >
            → Github (front-end)
          </a>
        </p>
        <p className="max-w-xl mt-5 hover:underline">
          <a
            target="_blank"
            href="https://github.com/NightenDushi/linkhub_back"
          >
            → Github (back-end)
          </a>
        </p>
        <p className="max-w-xl mt-5 hover:underline mb-10">
          <a
            target="_blank"
            href="/cv/CV - GUILHOT Nathan Full-Stack Developer.pdf"
          >
            → My CV/Resume
          </a>
        </p>
        <p className="mt-10 mb-10">
          <a
            target="_blank"
            className="bg-pink-800 hover:bg-pink-700 text-white p-5 rounded-full text-black cursor-pointer select-none"
            href="mailto:nathan.guilhot@gmx.fr"
          >
            Send me an Email! ✉
          </a>
        </p>
      </div>
    </div>
  );
}

function LandingPageForm() {
  const [formValue, setFormValue] = useState<string>("");

  const navigate = useNavigate();

  const regex = /^[a-z0-9]*$/;
  const regex_filter = /[a-z0-9]*/g;

  return (
    <>
      <form className="mt-3">
        <input
          className="rounded-md h-full p-4 text-lg w-full mb-5 md:w-fit"
          type="text"
          placeholder="linkhub.com/yourname"
          pattern="\w{2,16}"
          onChange={(e) => {
            e.target.value = e.target.value.toLowerCase();
            if (!regex.test(e.target.value)) {
              //NOTE(Nighten) The regex filter is used to prevent the user from copy-pasting wrong input into the field
              e.target.value = (e.target.value.match(regex_filter) || []).join(
                ""
              );
            }
            setFormValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(`/register?id=${formValue}`);
          }}
        ></input>
        <Link
          className="cursor-pointer select-none bg-pink-200 p-4 ml-2 rounded-full text-lg"
          to={`/register?id=${formValue}`}
        >
          Claim your Linkhub
        </Link>
      </form>
    </>
  );
}
