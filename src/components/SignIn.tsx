import { FcGoogle } from "react-icons/fc";
import { FaKey } from "react-icons/fa";
import { HiUser } from "react-icons/hi2";
import { MdAlternateEmail } from "react-icons/md";
import MicrosoftLogo from "../../public/ms-symbollockup_mssymbol_19.svg";

export default function SignIn() {

  return (
    <div className="w-1/4 mx-auto">

    <form className="w-full">
      <div className="card bg-base-100 card-border border-base-300 card-sm shadow-sm overflow-hidden">
        <div className="border-base-300 border-b border-dashed">
          <div className="flex items-center gap-2 p-4">
            <div className="grow">
              <div className="flex items-center gap-2">
                <HiUser size={20} />
                <h2 className="font-medium text-xl">Sign In</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body gap-4">
          <p className="text-xs opacity-60">Sign in to your account</p>
          <div className="flex flex-col gap-1">
            <label className="input input-border flex w-full items-center gap-2">
              <MdAlternateEmail size={16} className="opacity-70" />
              <input type="email" className="grow" placeholder="Email" />
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="input input-border flex w-full items-center gap-2">
              <FaKey size={16} className="opacity-70" />
              <input type="password" className="grow" placeholder="Password" />
            </label>
            <div className="flex justify-end">
              <a href="#" className="link-error px-1">Forgot password?</a>
            </div>
          </div>
 
          <div className="card-actions items-center justify-end gap-6">
            <button className="btn btn-primary w-full">Register</button>
          </div>

          <div className="divider">OR</div>

          <div className="flex flex-col gap-2">
            <a href="#" className="btn bg-white text-black border-[#747775] w-full hover:bg-gray-200 hover:border-gray-300">
              <FcGoogle />
              Login with Google
            </a>
            <a href="#" className="btn bg-[#2f2f2f] bg-slate-900 text-white border-base-300 w-full hover:bg-gray-700 hover:border-gray-500">
              <img src={MicrosoftLogo} />
              Login with Microsoft
            </a>
          </div>

        </div>
      </div>
    </form>


    </div>

  )
}
