import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Twister from "./pages/Twister";
import Explore from "./pages/Explore";
import Corporate from "./pages/Corporate";
import HobbyProviders from "./pages/HobbyProviders";
import Shop from "./pages/Shop";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/twister" element={<Twister />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="hobby-providers" element={<HobbyProviders />} />
            <Route path="shop" element={<Shop />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
