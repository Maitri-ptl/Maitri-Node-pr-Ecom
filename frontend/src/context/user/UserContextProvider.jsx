import React, { useEffect, useState } from 'react'
import UserContext from './UserContext'

const UserContextProvider = ({ children }) => {

  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  // when app loads, check token in localStorage and read user data from it
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ userId: payload.id, name: payload.name, role: payload.role })
      setIsLogin(true)
    }
  }, [])

  return (
    <>
      <UserContext.Provider value={{ isLogin, setIsLogin, user, setUser }}>
        {children}
      </UserContext.Provider>
    </>
  )
}

export default UserContextProvider
