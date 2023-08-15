"use client";
import Image from "next/image";
import logo from "./logo.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Avatar from "react-avatar";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";

function Header() {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);
  return (
    <header>
      <div className=" flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-2xl  ">
        <div
          className="absolute bg-red-400 bg-gradient-to-br from-pink-400 to-[#1616bfdd1]
         rounded-md top-0 left-0 w-full h-96  filter blur-3xl opacity-50 -z-50"
        />
        <Image
          src={logo}
          alt="logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain "
        />
        <div
          className="flex items-center  space-x-5 
        flex-1 justify-end w-full "
        >
          {/* search box */}
          <form
            className="flex items-center bg-white space-x-5 
        rounded-3xl p-2 shadow-md flex-1 md:flex-initial    "
          >
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 " />
              <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder="Search...."
                className="flex-1 outline-none p-2 "
              />
            </div>
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* Avatar */}
          <Avatar name="Asif" round size="50" color="#0055D1" />
        </div>
      </div>

      {/* <div className="flex items-center justify-center px-5 md:py-5  ">
        <p
          className="flex p-2 items-center text-sm font-light pr-5 shadow-xl 
        rounded-xl w-fit bg-white italic max-w-3xl text-blue-500 "
        >
          <UserCircleIcon className="h-10 w-10 inline-block text-blue-500 mr-1  " />
          Gpt is summerising your task
        </p>
      </div> */}
    </header>
  );
}

export default Header;
