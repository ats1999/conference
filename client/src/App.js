import React, { useEffect,useState } from "react";
import io from "socket.io-client";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import Room from "./Room";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io("/"));
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <h1 className="text-center sp">
              This is a Simple Video streaming APP
            </h1>

            <div id="home_button_container" className="sp">
              <Link to="/create">Create Room</Link>
              <Link to="/join">Join Room</Link>
            </div>
          </div>
        </Route>
        <Route exact path="/create">
          <CreateRoom socket={socket} />
        </Route>
        <Route exact path="/join">
          <JoinRoom  socket={socket} />
        </Route>
        <Route exact path="/room/:id">
          <Room socket={socket}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
