import { GlobalNavigation } from './GlobalNavigation';

export default {
  title: 'Core/Global Navigation',
  component: GlobalNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

import churchServiceImg from '../../assets/church-service.jpg';

export const Default = {
  args: {
    logoTextPrimary: 'First Church',
    logoTextSecondary: 'Of Our Lord Jesus Christ',
    ctaLabel: 'Button',
    items: [
      { label: "About", url: "#", hasSubmenu: true },
      { label: "Ministries", url: "#", hasSubmenu: true },
      { label: "Sermons", url: "#", hasSubmenu: false },
      { label: "Events", url: "#", hasSubmenu: false },
      { label: "Contact", url: "#", hasSubmenu: false }
    ],
    announcements: [
      "Welcome to First Church - Service starts at 10:00 AM",
      "Join our Bible Study every Wednesday at 7:00 PM",
      "Youth Retreat Registration is now open!"
    ],
    menuData: {
      mainLinks: [
        { label: "Branch Temples", url: "#" },
        { label: "Scheduled Events", url: "#" },
        { label: "Locations", url: "#" },
        { label: "Store", url: "#" },
        { label: "Literature", url: "#" },
        { label: "ByLaws", url: "#" },
        { label: "Donation", url: "#" }
      ],
      newsItems: [
        { 
          category: "FROM THE TEMPLE",
          title: "24 baptized in the Greenwich temple", 
          image: churchServiceImg, 
          link: "#" 
        },
        { 
          category: "COMMUNITY",
          title: "First Church Taskforce is seeking volunteers to help out Jamaica", 
          image: null, // Text only fallback
          link: "#" 
        }
      ],
      quickLinks: [
        { label: "F.C Calendar of events", url: "#" },
        { label: "First Church Newsletter", url: "#" },
        { label: "Truth of God Times Magazine", url: "#" },
        { label: "Youtube - Watch First Church Videos", url: "#" },
        { label: "Minister evaluation form", url: "#" },
        { label: "History of the Ministry", url: "#" },
        { label: "Terms and privacy", url: "#" },
        { label: "Contact", url: "#" }
      ]
    }
  },
};

export const CustomLabels = {
  args: {
    logoTextPrimary: 'Mission Control',
    logoTextSecondary: 'Establishing the Kingdom',
    ctaLabel: 'Donate',
    items: [
      { label: "Mission", url: "#", hasSubmenu: true },
      { label: "Team", url: "#", hasSubmenu: false },
      { label: "Campaigns", url: "#", hasSubmenu: true }
    ],
    announcements: [
      "Launch Sequence Initiated...",
      "Status: All Systems Green"
    ]
  },
};
