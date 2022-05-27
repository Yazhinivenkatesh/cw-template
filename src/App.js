import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AddReferral from './AddReferral';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
      <Route exact path='/add-referral' component={AddReferral}/>
    </Switch>
    </div>
    </Router>
  );
}

export default App;
