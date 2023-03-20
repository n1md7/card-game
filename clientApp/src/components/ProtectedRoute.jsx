import React, { useLayoutEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = (props) => {
  const [isAuth, isLoading] = useAuth(false);
  const [roomId, setRoomId] = useState(null);

  useLayoutEffect(() => {
    if (props.computedMatch.params?.roomId) {
      setRoomId(props.computedMatch.params?.roomId);
    }
  }, [props.computedMatch.params]);

  return !isAuth && !isLoading ? <Redirect to={roomId ? `/auth/${roomId}` : '/auth'} /> : <Route {...props} />;
};

export default ProtectedRoute;
