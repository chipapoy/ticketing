import { useEffect, useState } from 'react'

const Session = () => {

  const [userData, setUserData] = useState([])

  useEffect(() => {
    setUserData({
      ...JSON.parse(localStorage.getItem('data'))
    })
  },[])

  return userData ? userData : null;
}

export default Session
