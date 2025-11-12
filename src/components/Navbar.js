import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      {/* Left side: Logo */}
      <div className="navbar-left">
        <img src="/Logos-01.png" alt="Logo" />
      </div>

      {/* Hamburger icon for small screens */}
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={28} />}
      </div>

      {/* Middle: Navigation Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/twister">Twister</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/corporate">For Corporate</Link></li>
        <li><Link to="/hobby-providers">Hobby Providers</Link></li>
        <li><Link to="/shop">Shop</Link></li>
      </ul>

      {/* Right side: Profile/Login */}
      <div className={`navbar-profile ${menuOpen ? "open" : ""}`}>
        <Link to="/login" className="profile-link">
          <CgProfile size={20} />
          <span>Login</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;