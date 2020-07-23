import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import AppNavbar from "./components/AppNavbar";
import ShoppingList from "./components/ShoppingList";
import DietTracker from "./components/DietTracker";
import DietTrackerForm from "./components/DietTrackerForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <AppNavbar/>
        <Route exact={true} path="/diet-tracker" component={DietTracker}/>
        <Route exact={true} path="/diet-tracker-form" component={DietTrackerForm}/>
        <Route exact={true} path="/list" component={ShoppingList}/>
      </Router>
    </div>
  );
}

export default App;
