import { useState } from "react";
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import callIcon from '../assets/call.png';
import emailIcon from '../assets/email.png';
import whatsappIcon from '../assets/whatsapp_logo.svg.png';
import fbIcon from '../assets/FB_header.png';
import instaIcon from '../assets/insta_header.png';
import twitterIcon from '../assets/X_header.png';
import linkedinIcon from '../assets/LN_header.png';
import ytIcon from '../assets/YT_header.png';
import shareIcon from '../assets/share_headere.png';
import headerBg from '../assets/header.png';

const HomePageHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: "Colleges", path: "/colleges" },
    { title: "Courses", path: "/courses" },
    { title: "Exams", path: "/exams" },
    { title: "Internships", path: "/internships" },
    { title: "Scholarships", path: "/scholarships" },
  ];

  return (
    <>
      {/* Custom Top Header */}
      <div
        className="w-full"
        style={{
          backgroundImage: `url(${headerBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 38,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-1 text-xs" style={{ minHeight: 38 }}>
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 border-r border-white pr-4">
              <img src={callIcon} alt="call" className="w-4 h-4 mr-1" />
              <span className="text-white opacity-80">Contact Us</span>
              <span className="text-white font-semibold ml-1">+91 63015 11066</span>
            </div>
            <div className="flex items-center gap-1 pl-4">
              <img src={emailIcon} alt="email" className="w-4 h-4 mr-1" />
              <span className="text-white opacity-80">Send Email</span>
              <span className="text-white font-semibold ml-1">info@studenthub.in</span>
            </div>
          </div>
          {/* Right: WhatsApp, Socials, Share */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-transparent">
              <a href="https://wa.me/916301511066" target="_blank" rel="noopener noreferrer">
                <img src={whatsappIcon} alt="whatsapp" className="w-5 h-5 mr-1 hover:opacity-80 transition" />
              </a>
              <span className="text-white opacity-80">Ask us for query</span>
              <span className="text-white font-semibold ml-1">(91) 63015 110 66</span>
            </div>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={shareIcon} alt="share" className="w-4 h-4 mx-2 hover:opacity-80 transition" />
            </a>
            <div className="flex items-center gap-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={fbIcon} alt="facebook" className="w-5 h-5 hover:opacity-80 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={instaIcon} alt="instagram" className="w-5 h-5 hover:opacity-80 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={twitterIcon} alt="twitter" className="w-5 h-5 hover:opacity-80 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="linkedin" className="w-5 h-5 hover:opacity-80 transition" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src={ytIcon} alt="youtube" className="w-5 h-5 hover:opacity-80 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[var(--site-green)]">
                  <img src="StudentHub_Blue_Logo.svg" className="w-40 sm:w-20 md:w-24 lg:w-32 xl:w-40" alt="Logo" />
                </h1>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link key={item.title} to={item.path} className="text-[#262443]  hover:text-[var(--site-green)] transition-colors duration-200">
                  {item.title}
                </Link>
              ))}
              <Link to="/login" className="px-4 py-2 rounded-md text-white bg-[var(--site-green)] hover:bg-[var(--site-green)] transition-colors duration-200">
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-[var(--site-green)] focus:outline-none">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link key={item.title} to={item.path} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[var(--site-green)] hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                  {item.title}
                </Link>
              ))}
              <Link to="/login" className="block w-full text-center px-3 py-2 rounded-md text-white bg-[var(--site-green)] hover:bg-[var(--site-green)]" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default HomePageHeader;
