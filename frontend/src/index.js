import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";

import "./style.css";
import Navigation from "./components/navigation.jsx";
import Footer from "./components/footer.jsx";
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
import AdminDashboard from "./views/admin-dashboard.jsx";
import NotFound from "./views/not-found.jsx";
import VolunteerDashboard from "./views/volunteer-dashboard.jsx";
import ManagerDashboard from "./views/manager-dashboard.jsx";

const Layout = ({ children }) => {
  const location = useLocation();
  // Hide Navigation and Footer on login/register pages
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  // Add/remove body padding based on whether navbar is shown
  React.useEffect(() => {
    if (hideLayout) {
      document.body.style.paddingTop = "0";
    } else {
      document.body.style.paddingTop = "72px";
    }
  }, [hideLayout]);

  return (
    <>
      {!hideLayout && <Navigation />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={About} exact path="/about" />
          <Route component={Events} exact path="/events" />
          <Route component={EventsManager} exact path="/events-manager" />
          <Route component={Login} exact path="/login" />
          <Route component={Register} exact path="/register" />
          <Route component={Profile} exact path="/profile" />
          <Route
            component={VolunteerDashboard}
            exact
            path="/volunteer-dashboard"
          />
          <Route component={ManagerDashboard} exact path="/manager-dashboard" />
          <Route component={MyEvents} exact path="/my-events" />
          <Route component={EventManagement} exact path="/event-management" />
          <Route component={AdminDashboard} exact path="/admin-dashboard" />
          <Route component={DiscussionListFB} exact path="/discussion-list" />
          <Route path="/events/:id/:slug?" component={Events} /> 
          <Route
            component={DiscussionChannel}
            exact
            path="/discussion/:eventId"
          />
          <Route component={Notifications} exact path="/notifications" />
          <Route component={NotFound} path="**" />
          <Redirect to="**" />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
