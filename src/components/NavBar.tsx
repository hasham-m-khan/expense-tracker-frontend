import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useThemeContext } from '@/contexts/ThemeContext/UseThemeContext';
import { PiMoonFill } from "react-icons/pi";
import { PiSunDimFill } from "react-icons/pi";

import { userQueryOptions } from '@/lib/auth';

export default function NavBar() {
  const { data: user } = useQuery(userQueryOptions);
  const { themeType, setTheme } = useThemeContext();

  const toggleTheme = () => {
    setTheme(themeType === 'light' ? 'dark' : 'light');
  };

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
        <ul className="menu menu-horizontal px-1">
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
            <span>asdef</span>
          ) : (
            <button className="btn btn-sm rounded-full btn-primary mr-2">Sign in</button>
          )

        }

      </div>
    </div>
  )
}
