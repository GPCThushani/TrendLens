import React from 'react';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Social Icons */}
        <div className="footer-socials">
          <a href="#" className="social-icon" title="Twitter"><Twitter size={20} /></a>
          <a href="#" className="social-icon" title="LinkedIn"><Linkedin size={20} /></a>
          <a href="#" className="social-icon" title="GitHub"><Github size={20} /></a>
          <a href="mailto:support@trendlens.com" className="social-icon" title="Contact"><Mail size={20} /></a>
        </div>
        
        {/* Legal Links (New) */}
        <div style={{ margin: '15px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <a href="#" style={{ margin: '0 10px', textDecoration:'none', color:'inherit' }}>Privacy Policy</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="#" style={{ margin: '0 10px', textDecoration:'none', color:'inherit' }}>Terms & Conditions</a>
        </div>

        {/* Copyright */}
        <p className="footer-text">
          © {currentYear} TrendLens. AI-Powered Market Trend Analysis.
        </p>
      </div>
    </footer>
  );
};

export default Footer;