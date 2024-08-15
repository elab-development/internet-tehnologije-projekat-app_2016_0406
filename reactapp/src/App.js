import logo from './logo.svg';
import './App.css';
import Pocetna from './Komponente/Pocetna/Pocetna';
import AuthPage from './Komponente/Autorizacija/AuthPage';

function App() {
  return (
    <div className="App">
      <Pocetna></Pocetna>
      <AuthPage></AuthPage>
    </div>
  );
}

export default App;
