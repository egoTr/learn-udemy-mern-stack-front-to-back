import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from "./components/layout/navbar";
import Landing from "./components/layout/landing";
import Register from "./components/auth/register";
import Login from "./components/auth/login";

import './app.css';

const App = (props) => {
  return (
    <BrowserRouter>
      <NavBar />

      <Route exact path="/" component={Landing}></Route>

      <section className="wrapper">
        <Switch>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
        </Switch>
      </section>
    </BrowserRouter>
  )
}

export default App;
