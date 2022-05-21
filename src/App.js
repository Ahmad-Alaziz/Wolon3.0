import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} exact />
      </Routes>
    </Router>
  );
};

export default App;
