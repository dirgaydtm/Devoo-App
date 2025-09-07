import { CircleUserRound, EllipsisVertical, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 sm:px-15 fixed w-full top-0 z-40 
    backdrop-blur-lg">

      <div className="navbar-start">
        <a className="font-bold text-xl">Devoo</a>
      </div>
      <div className="navbar-end">
        <div className='hidden sm:inline-flex gap-2'>
          <Link
            to={"/settings"}
            className="btn btn-primary btn-ghost"
          >
            <Settings />
            <span className="inline">Settings</span>
          </Link>
          <Link to={"/profile"} className="btn btn-primary btn-ghost">
            <CircleUserRound />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button className="btn btn-primary btn-ghost" onClick={logout}>
            <LogOut />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>


        <div className="dropdown dropdown-end inline sm:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <EllipsisVertical />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow">
            <li>
              <Link to={"/settings"}>
                <Settings />Settings
              </Link>

            </li>
            <li>
              <Link to={"/profile"}>
                <CircleUserRound />Profile
              </Link>
            </li>
            <li>
              <button onClick={logout}>
                <LogOut />Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
