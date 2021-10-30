import React from 'react';
import Authenticate from './components/Authenticate';
import Lobby from './components/Lobby';
import CreateRoom from './components/room/Create';
import JoinRoom from './components/room/Join';
import EnterRoom from './components/room/Room';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// import { CardRank} from 'shared-types';
// console.log(CardRank);

export default function App() {
  return (
    <Switch>
      <Route path="/auth/:roomId?" component={Authenticate} />
      <ProtectedRoute path="/lobby" component={Lobby} />
      <ProtectedRoute path="/create" component={CreateRoom} />
      <ProtectedRoute path="/join" component={JoinRoom} />
      <ProtectedRoute path="/room/:roomId" component={EnterRoom} />
      <Redirect to="/auth" />
    </Switch>
  );
}
