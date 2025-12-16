import React, { useState, useEffect } from 'react';
import '../../tokens.css';
import './GlobalNavigation.css'; // Import new CSS
import logo from '../../assets/church-logo.png';

export const GlobalNavigation = ({ 
  label = "Start Navigation", 
  items = [
    { label: "About", url: "#", hasSubmenu: true },
    { label: "Ministries", url: "#", hasSubmenu: true },
    { label: "Sermons", url: "#", hasSubmenu: false },
    { label: "Events", url: "#", hasSubmenu: false },
    { label: "Contact", url: "#", hasSubmenu: false }
  ],
  announcements = [
    "Welcome to First Church - Service starts at 10:00 AM",
    "Join our Bible Study every Wednesday at 7:00 PM",
    "Youth Retreat Registration is now open!"
  ],
  logoTextPrimary = "First Church",
  logoTextSecondary = "Of Our Lord Jesus Christ",
  ctaLabel = "Button",
  menuData, // New Prop
  logoSrc // New Prop for WP
}) => {
  // Use passed logoSrc or fallback to imported default
  const displayLogo = logoSrc || logo;

  // Announcement Logic
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [fade, setFade] = useState('in');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu State

  useEffect(() => {
    const interval = setInterval(() => {
      setFade('out');
      setTimeout(() => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
        setFade('in');
      }, 500); // 0.5s fade out before switch
    }, 5000); // 5s duration

    return () => clearInterval(interval);
  }, [announcements.length]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className="fc-global-header" style={{ width: '100%', fontFamily: 'var(--wp--preset--font-family--ui)' }}>
        
        {/* 0. TOP BORDER: 6px Burgundy */}
        <div style={{ height: '6px', backgroundColor: 'var(--header-border-top)', width: '100%' }}></div>

        {/* 1. TOP BAR: Branding, Nav, Actions (Height ~140px) */}
        <div className="fc-global-header__top" style={{
          backgroundColor: 'rgba(245, 240, 229, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          minHeight: '140px', 
          padding: '0 var(--wp--layout--margin)', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // Branding Left, Actions Right
          boxSizing: 'border-box',
          position: 'relative', 
          zIndex: 10, // Below Overlay
          boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)'
        }}>
          
          {/* Branding (Left) */}
          <div className="fc-global-header__brand" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
             <img 
              src={displayLogo} 
              alt="Church Logo" 
              style={{ height: '100px', width: 'auto', objectFit: 'contain' }} 
             />
             
             <div className="fc-global-header__brand-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <span style={{ 
                 fontFamily: 'var(--wp--preset--font-family--brand)', 
                 fontSize: '48px', 
                 color: 'var(--wp--preset--color--cardinal)',
                 fontWeight: '700',
                 textShadow: '0.5px 0 0 currentColor',
                 lineHeight: '1.1'
               }}>
                 {logoTextPrimary}
               </span>
               <span style={{ 
                 fontFamily: 'var(--wp--preset--font-family--brand)', 
                 fontSize: '32px', 
                 color: 'var(--wp--preset--color--cardinal)',
                 fontWeight: '700',
                 lineHeight: '1',
                 marginTop: '-4px'
               }}>
                 {logoTextSecondary}
               </span>
             </div>
          </div>

          {/* Right Section: Nav Items + Actions */}
          <div className="fc-global-header__right" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            
            {/* Main Navigation (Moved to Top) */}
            <nav aria-label={label} className="fc-desktop-nav">
               <ul style={{ 
                 display: 'flex', 
                 gap: '16px', // Reduced gap since padding added to links
                 listStyle: 'none', 
                 margin: 0, 
                 padding: 0 
               }}>
                 {items.map((item, index) => (
                   <li key={index} className="fc-global-nav-item" style={{ display: 'flex', alignItems: 'center' }}>
                     <a href={item.url} className="fc-global-nav-link">
                       {item.label}
                       {/* Dropdown Chevron */}
                       {item.hasSubmenu && (
                         <svg className="nav-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                           <path d="m6 9 6 6 6-6"/>
                         </svg>
                       )}
                     </a>
                   
                   {/* Simple Dropdown */}
                   {item.hasSubmenu && (
                     <ul className="fc-global-nav-dropdown">
                       <li><a href="#">Overview</a></li>
                       <li><a href="#">Our Team</a></li>
                       <li><a href="#">Get Involved</a></li>
                     </ul>
                   )}
                 </li>
               ))}
             </ul>
          </nav>

            <div className="desktop-nav-separator" style={{ width: '1px', height: '40px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>

             {/* Actions: Button + Hamburger */}
             <div className="fc-global-header__actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <button className="fc-global-cta-button" style={{
                 backgroundColor: 'var(--wp--preset--color--burgundy)',
                 color: 'var(--wp--preset--color--white)',
                 border: 'none',
                 padding: '12px 28px',
                 borderRadius: '4px',
                 fontSize: '14px',
                 fontFamily: 'var(--wp--preset--font-family--ui)',
                 cursor: 'pointer',
                 fontWeight: '600',
                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}>
                 {ctaLabel}
               </button>

               {/* Hamburger Menu Toggle */}
               <button 
                 onClick={() => setIsMenuOpen(true)}
                 style={{ 
                   background: 'none', 
                   border: 'none', 
                   cursor: 'pointer', 
                   color: 'var(--wp--preset--color--ink-black)',
                   display: 'flex', 
                   flexDirection: 'column', 
                   gap: '6px',
                   padding: 0
                 }} aria-label="Open Full Menu">
                 <span style={{ display: 'block', width: '32px', height: '3px', backgroundColor: 'currentColor', borderRadius: '2px' }}></span>
                 <span style={{ display: 'block', width: '32px', height: '3px', backgroundColor: 'currentColor', borderRadius: '2px' }}></span>
                 <span style={{ display: 'block', width: '20px', height: '3px', backgroundColor: 'currentColor', marginLeft: 'auto', borderRadius: '2px' }}></span>
               </button>
             </div>
          </div>
        </div>

        {/* 2. BOTTOM BAR: Announcements (Repurposed Gold Bar) */}
        <div className="fc-global-header__announcements" style={{
          background: 'radial-gradient(circle at center, rgba(232, 215, 190, 0.95) 0%, rgba(184, 140, 75, 0.95) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          height: '48px', // Kept same height
          padding: '0 var(--wp--layout--margin)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          
          {/* Announcement Text */}
          <div style={{
            fontFamily: 'var(--wp--preset--font-family--ui)',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--wp--preset--color--ink-black)', 
            textAlign: 'center',
            transition: 'opacity 0.5s ease-in-out',
            opacity: fade === 'in' ? 1 : 0
          }}>
             {announcements[currentAnnouncement]}
          </div>

          {/* Progress Dots (Absolute positioned or flexed) */}
          <div className="fc-announcement-indicators" style={{ 
            position: 'absolute', 
            right: 'var(--wp--layout--margin)', 
            display: 'flex', 
            gap: '8px'
          }}>
             {announcements.map((_, idx) => (
               <div key={idx} style={{
                 width: '6px',
                 height: '6px',
                 borderRadius: '50%',
                 backgroundColor: idx === currentAnnouncement ? 'var(--wp--preset--color--ink-black)' : 'rgba(0,0,0,0.3)',
                 transition: 'background-color 0.3s'
               }} />
             ))}
          </div>
        </div>

      </header>

      {/* FULL PAGE MENU OVERLAY */}
      <div className={`fc-full-page-menu ${isMenuOpen ? 'is-open' : ''}`}>
        
        {/* Menu Logo (Top Left) */}
        <div className="fc-menu-logo">
          <img src={displayLogo} alt="Logo" style={{ height: '80px', width: 'auto' }} />
        </div>

        {/* Close Button */}
        <button 
          className="fc-menu-close-btn"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close Menu"
        >
           {/* X Icon */}
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <line x1="18" y1="6" x2="6" y2="18"></line>
             <line x1="6" y1="6" x2="18" y2="18"></line>
           </svg>
        </button>

        {/* Menu Content Grid */}
        <div className="fc-full-page-menu__container">
          
          {/* Column 1: Main Navigation (The Church) */}
          <div className="fc-full-page-menu__col menu-col-main">
             <h4 className="fc-menu-heading">THE CHURCH</h4>
             <ul className="fc-full-nav-list">
               {menuData?.mainLinks?.map((link, idx) => (
                 <li key={idx}><a href={link.url}>{link.label}</a></li>
               ))}
             </ul>
          </div>

          {/* Column 2: News (From The Temple) */}
          <div className="fc-full-page-menu__col menu-col-news">
             <h4 className="fc-menu-heading">FROM THE TEMPLE</h4>
             <div className="fc-news-grid">
               {menuData?.newsItems?.map((news, idx) => (
                 <div key={idx} className="fc-news-item">
                   {news.image && (
                     <div className="fc-news-image">
                       <img src={news.image} alt="" />
                     </div>
                   )}
                   <span className="fc-news-cat">{news.category}</span>
                   <h5 className="fc-news-title">{news.title}</h5>
                   <a href={news.link} className="fc-news-read-more">READ MORE</a>
                 </div>
               ))}
             </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="fc-full-page-menu__col menu-col-quick">
             <h4 className="fc-menu-heading text-right">QUICK LINKS</h4>
             <ul className="fc-quick-nav-list text-right">
               {menuData?.quickLinks?.map((link, idx) => (
                 <li key={idx}><a href={link.url}>{link.label}</a></li>
               ))}
             </ul>
             
             {/* Social Icons */}
             <div className="fc-menu-socials">
                <a href="#" aria-label="YouTube" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" aria-label="X (Twitter)" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" aria-label="Facebook" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};
