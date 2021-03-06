import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import AppNavbar from "./components/AppNavbar";
import ProductsList from "./containers/ProductsList";
import DietTracker from "./components/DietTracker";
import DietTrackerForm from "./components/DietTrackerForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Product from "./components/Product";
import Chart from "./components/Chart";
import Goal from "./components/Goal";
import Auth from './modules/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  let routes = (
    <Router>
      <AppNavbar/>
      <Route exact={true} path="/login" component={LoginForm}/>
      <Route exact={true} path="/register" component={RegisterForm}/>
    </Router>
  )

    if (Auth.isUserAuthenticated()) {
      routes = (
        <Router>
          <AppNavbar/>
          <Route exact={true} path="/diet-tracker" component={DietTracker}/>
          <Route exact={true} path="/diet-tracker-form" component={DietTrackerForm}/>
          <Route exact={true} path="/goal" component={Goal}/>
          <Route exact={true} path="/list" component={ProductsList}/>
          <Route exact={true} path="/list/:id" component={Product}/>
          <Route exact={true} path="/charts" component={Chart}/>
        </Router>
      )
    }

  return (
    <div className="App">
      {routes}
    </div>
  );
}

export default App;
