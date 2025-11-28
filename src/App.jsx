
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import CleanCoreHome from './pages/Home';
import About from './pages/About';
import HouserWaste from './houser/waste';
import Zip from './collector/Zip';

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<CleanCoreHome />} />
        <Route path="/about" element={<About />} />
        <Route path='/houser' element = {<HouserWaste/>}/>
        <Route path="/zip" element = {<Zip/>}/>
      </Routes>
    </Router>
  )
}

export default App
