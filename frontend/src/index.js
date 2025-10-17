import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./style.css";
import Home from "./views/home.jsx";
import About from "./views/about.jsx";
import Login from "./views/login.jsx";
import Register from "./views/register.jsx";
import Profile from "./views/profile.jsx";
import MyEvents from "./views/my-events.jsx";
import EventManagement from "./views/event-management.jsx";
import Events from "./views/events.jsx";
import EventsManager from "./views/events-manager.jsx";
import Notifications from "./views/notifications.jsx";
import DiscussionChannel from "./views/discussion-channel.jsx";
import DiscussionListFB from "./views/discussion-list-fb.jsx";
import NotFound from "./views/not-found.jsx";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={About} exact path="/about" />
        <Route component={Events} exact path="/events" />
        <Route component={EventsManager} exact path="/events-manager" />
        <Route component={Login} exact path="/login" />
        <Route component={Register} exact path="/register" />
        <Route component={Profile} exact path="/profile" />
        <Route component={MyEvents} exact path="/my-events" />
        <Route component={EventManagement} exact path="/event-management" />
        <Route component={DiscussionListFB} exact path="/discussion-list" />
        <Route
          component={DiscussionChannel}
          exact
          path="/discussion/:eventId"
        />
        <Route component={Notifications} exact path="/notifications" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
