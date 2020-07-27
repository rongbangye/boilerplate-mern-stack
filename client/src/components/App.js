import React from "react";
import "../App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./about/about";

function App() {
  return (
    <Switch>
      {/* <Route path="/" component={Home} /> */}
      <Route path="/about" component={About} />
    </Switch>
  );
}

export default App;
