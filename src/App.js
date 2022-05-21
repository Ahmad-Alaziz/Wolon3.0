import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages';
import DAPP from './DAPP';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} exact />
        <Route path='dapp/*' element={<DAPP />} />
      </Routes>
    </Router>
  );
};

export default App;
