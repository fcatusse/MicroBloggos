import React from "react";
import { Switch, Route } from "react-router-dom";
import Message from "./Message";
import Login from "./Login";
import Signup from "./Signup";
import EditUser from "./EditUser";

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Message} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/edituser" component={EditUser} />
    </Switch>
  </main>
);

export default Main;