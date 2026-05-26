import { Link, useNavigate, } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useThemeContext } from '@/contexts/ThemeContext/UseThemeContext';
import { PiMoonFill } from "react-icons/pi";
import { PiSunDimFill } from "react-icons/pi";

import { userQueryOptions } from '@/lib/auth';
import { api } from '@/lib/api';


export default function NavBar() {
  const { data: user } = useQuery(userQueryOptions);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { themeType, setTheme } = useThemeContext();

  const toggleTheme = () => {
    setTheme(themeType === 'light' ? 'dark' : 'light');
  };

  const handleSignout = async () => {
    await api.v1.auth.logout.$post({});
    queryClient.setQueryData(["user"], null);
    navigate({ to: "/" });
  }
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Expense Tracker</a>
      </div>

      <div className="flex-none">
        <label className="btn btn-sm btn-ghost btn-circle swap swap-rotate">
          <input
            type="checkbox"
            checked={themeType === 'dark'}
            onChange={toggleTheme}
          />

          {/* Sun icon (shows when checked/dark theme is active) */}
          <PiSunDimFill size={16} className="swap-on text-yellow-500" />

          {/* Moon icon (shows when unchecked/light theme is active) */}
          <PiMoonFill size={16} className="swap-off text-slate-500" />
        </label>
        <ul className="menu menu-horizontal px-1 mr-2">
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/transactions'>Transactions</Link>
          </li>
          <li>
            <Link to='/create-transaction'>Create a Transaction</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
        </ul>
        {
          user ? (
            <>
              <button className="avatar mr-4"
                popoverTarget="logout-dropdown"
                style={{ anchorName: "--anchor-1" }}
              >
                <div className="ring-primary ring-offset-1 ring-3 ring-offset-base-100  w-8 rounded-full">
                  <img src={ user.avatarUrl! } />
                </div>
              </button>

              <div className="dropdown menu w-52 bg-base-100 rounded-box shadow-sm mt-4 mr-4 border border-neutral/20"
                popover="auto"
                id="logout-dropdown"
                style={{ positionAnchor: "--anchor-1" }}
              >
                <h2 className="text-md pt-1">Welcome { user.firstName }</h2>
                <ul className="mt-3">
                  <li>
                    <button
                      onClick={handleSignout}
                      className="btn btn-error"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <a href="/signin"
              className="btn btn-sm rounded-full btn-primary mr-2"
            >Sign in</a>
          )
        }
      </div>
    </div>
  )
}
