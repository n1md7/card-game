import React, { useEffect } from 'react';
import useUserInfo from '../hooks/useUserInfo';
import Header from './Header';

export default function Lobby({ history }) {
  const [userInfo, isLoading] = useUserInfo();

  useEffect(() => {
    // check whether user has already in the room
    if (userInfo?.gameId) {
      const id = String(userInfo?.gameId).replace(/G-/g, '');
      history.push(`/G/${id}`);
    }
  }, [userInfo]);

  return isLoading ? <div>Loading...</div> : <Header />;
}
