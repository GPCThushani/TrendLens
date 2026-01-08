import React from 'react';
import { Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png'; // Ensure this path is correct

const Header = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 0',
      position: 'relative', 
      marginBottom: '40px'
    }}>
      
      {/* LEFT: Logo Only */}
      <div style={{ zIndex: 10 }}>
        <img 
          src={logo} 
          alt="TrendLens Logo" 
          style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
        />
      </div>

      {/* CENTER: Title (Absolute Positioning) */}
      <div style={{ 
        position: 'absolute', 
        left: '50%', 
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <h1 className="title" style={{ fontSize: '2.5rem', margin: 0, letterSpacing: '-1px' }}>
          Trend<span className="gradient-text">Lens</span>
        </h1>
      </div>

      {/* RIGHT: Theme Toggle */}
      <div style={{ zIndex: 10 }}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-btn">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;