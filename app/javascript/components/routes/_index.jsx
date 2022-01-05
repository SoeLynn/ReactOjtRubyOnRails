import React from "react";
import User from "../users/_index";
import Item from "../items/_item";
import { Route, Switch } from "react-router-dom";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={User}></Route>
        { }
        <Route path="/users" component={User}></Route>
        <Route path="/items" component={Item}></Route>
      </Switch>
    );
  }
}

export default Routes;
