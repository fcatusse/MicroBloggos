import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import EditUser from "./EditUser";

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/profil/:profil_username" component={Profil} />
      <Route exact path="/hashtag/:hashtag" component={Hashtag} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/edituser" component={EditUser} />
      <Route exact path="/:error" component={Error404}/>
    </Switch>
  </main>
);

function Error404({ match }) {
  return (
    <div>
      <h1>Ooops Your Page was not found...</h1>
      <Link to={'/'}>Back on Homepage !</Link> 
    </div>
  )
}

function Profil({ match }) {
  return <Home
    profil_username={match.params.profil_username} 
  />
}

function Hashtag({ match }) {
  return <Home
    hashtag={match.params.hashtag} 
  />
}

export default Main;