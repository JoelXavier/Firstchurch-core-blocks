import React from 'react';
import '../../tokens.css';
import './Footer.scss';
import logo from '../../assets/church-logo.png'; // Fallback logo

export const Footer = ({
  logoSrc,
  logoTextPrimary = "First Church",
  logoTextSecondary = "Of Our Lord Jesus Christ",
  missionText = "A community dedicated to the glory of God and the service of our neighbors.",
  columns = [
    {
      title: "The Church",
      links: [
        { label: "Our History", url: "#" },
        { label: "Leadership", url: "#" },
        { label: "Beliefs", url: "#" },
        { label: "Contact Us", url: "#" }
      ]
    },
    {
      title: "Ministries",
      links: [
        { label: "Children", url: "#" },
        { label: "Youth", url: "#" },
        { label: "Music", url: "#" },
        { label: "Outreach", url: "#" }
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Events Calendar", url: "#" },
        { label: "Live Stream", url: "#" },
        { label: "Sermon Archive", url: "#" },
        { label: "Member Login", url: "#" }
      ]
    },
    {
      title: "Give",
      links: [
        { label: "Online Giving", url: "#" },
        { label: "Pledges", url: "#" },
        { label: "Legacy Gifts", url: "#" }
      ]
    }
  ],
  socialLinks = [
    { icon: "youtube", url: "#", label: "YouTube" },
    { icon: "twitter", url: "#", label: "Twitter" },
    { icon: "instagram", url: "#", label: "Instagram" },
    { icon: "facebook", url: "#", label: "Facebook" }
  ],
  copyrightText = "© 2024 First Church. All rights reserved."
}) => {
  const displayLogo = logoSrc || logo;

  return (
    <footer className="antigravity-footer">
      {/* Main Content Grid */}
      <div className="footer-content">
        
        {/* Brand Column (Left) */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <img src={displayLogo} alt="First Church Logo" />
            <div className="footer-logo-text">
              <span className="primary">{logoTextPrimary}</span>
              <span className="secondary">{logoTextSecondary}</span>
            </div>
          </div>
          <p className="footer-mission">{missionText}</p>
        </div>

        {/* Navigation Grid (Right) */}
        <div className="footer-nav-grid">
          {columns.map((col, idx) => (
            <div key={idx} className="footer-nav-col">
              <h4 className="footer-heading">{col.title}</h4>
              <ul>
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}><a href={link.url}>{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Copyright & Social */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-copyright">{copyrightText}</div>
          
          <div className="footer-socials">
            {socialLinks.map((social, idx) => (
              <a key={idx} href={social.url} aria-label={social.label} className="footer-social-icon">
                {/* Simple Icons - Replace with your Icon Component or SVGs later */}
                {social.icon === 'youtube' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                {social.icon === 'twitter' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                {social.icon === 'instagram' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                {social.icon === 'facebook' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
