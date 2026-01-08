import React from 'react';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-socials">
          <a href="#" className="social-icon" title="Twitter"><Twitter size={20} /></a>
          <a href="#" className="social-icon" title="LinkedIn"><Linkedin size={20} /></a>
          <a href="#" className="social-icon" title="GitHub"><Github size={20} /></a>
          <a href="mailto:support@trendlens.com" className="social-icon" title="Contact"><Mail size={20} /></a>
        </div>
        <p className="footer-text">
          © {currentYear} TrendLens. AI-Powered Market Trend Analysis.
        </p>
      </div>
    </footer>
  );
};

export default Footer;