import React from 'react'
import { Link } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
const baseURL = import.meta.env.VITE_BASE_URL;

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const username = userInfo?.username;
  const logout = () => {
    fetch(`${baseURL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };
  return (
    <header>
      <Link to={"/"} className='logo'>
        SE NPRU blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to={"/create"}> login </Link>
            <Link to={logout}> logout ({username})</Link>
          </>
        )}
        {!username && (
          <>
            <Link to={"/login"}> login </Link>
            <Link to={"/register"}> Register </Link>
          </>)}

      </nav>
    </header>
  )
}

export default Header
