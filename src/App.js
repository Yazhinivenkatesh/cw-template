import "./App.css";
import Header from "./components/Header";
import Landing from "./screens/Landing";
import { Provider } from 'react-redux'
import store from './redux/Wallet/store';


function App() {
  return (
    <div>
      <Provider store={store}>
        <Header />
        <Landing />
      </Provider>
    </div>
  );
}

export default App;
