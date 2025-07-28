import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.tsx';
import { MenuIcon, CloseIcon, ShoppingBagIcon } from './Icons.tsx';
import ThemeSwitcher from './ThemeSwitcher.tsx';
import { LOGO_URL } from '../constants.ts';
import { formatGoogleDriveLink } from '../utils.ts';

/**
 * The Header component provides top-level navigation for the site.
 * It includes the brand logo, navigation links, a shopping bag icon,
 * and a responsive mobile menu.
 */
const Header: React.FC = () => {
  // State to control the visibility of the mobile navigation menu overlay.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Get cart-related state and functions from the CartContext.
  const { cartItems, toggleCart, isCartOpen } = useCart();
  // Hooks from react-router-dom to interact with the URL.
  const location = useLocation();
  const navigate = useNavigate();

  // A helper function to ensure the mobile menu is closed.
  const closeMenu = () => setIsMenuOpen(false);
  
  /**
   * Handles clicks on navigation links that point to an ID on the homepage (e.g., #about).
   * If already on the homepage, it scrolls smoothly to the section.
   * If on another page, it navigates to the homepage with the hash,
   * which is then handled by the second useEffect.
   * @param e The mouse event from the link click.
   * @param hash The ID of the element to scroll to (e.g., '#about').
   */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    closeMenu(); // Close mobile menu if open
    if (location.pathname !== '/') {
      // If we are not on the homepage, navigate to it with the hash.
      navigate('/' + hash);
    } else {
      // If we are already on the homepage, find the element and scroll to it.
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  /**
   * Effect to prevent body scrolling when a modal (cart or mobile menu) is open.
   * This is a common UX pattern to keep the user focused on the overlay content.
   */
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to reset the style when the component unmounts or dependencies change.
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isCartOpen]);

  /**
   * Effect to handle scrolling to a section identified by a URL hash.
   * This is particularly useful after being redirected from another page (e.g., from /shop to /#about).
   */
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // A timeout can sometimes help ensure the element is painted before scrolling.
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]); // Reruns when the hash part of the URL changes.


  // Function to determine the CSS classes for NavLink components based on their active state.
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `py-2 text-xl md:text-base transition-colors duration-300 ${isActive ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`;

  // JSX for the navigation links, reused in both desktop and mobile menus.
  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClasses} onClick={closeMenu} end>Home</NavLink>
      <NavLink to="/shop" className={navLinkClasses} onClick={closeMenu}>Shop</NavLink>
      <NavLink to="/gallery" className={navLinkClasses} onClick={closeMenu}>Gallery</NavLink>
      <Link to="/#about" onClick={(e) => handleNavClick(e, '#about')} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-2 text-xl md:text-base transition-colors duration-300">About</Link>
    </>
  );

  return (
    <>
      <header className="bg-[var(--color-surface)]/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-[var(--color-border)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={formatGoogleDriveLink(LOGO_URL, 'image', { height: 120 })} 
                alt="Thrift by Musk Logo" 
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="hidden sm:block text-2xl font-serif font-bold text-[var(--color-text-primary)]">Thrift by Musk</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks}
            </nav>
            
            <div className="flex items-center space-x-4">
               {/* Theme Switcher */}
               <ThemeSwitcher />
            
               {/* Shopping Bag Button */}
               <button 
                  onClick={toggleCart} 
                  className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" 
                  aria-label="Open Shopping Bag"
                  aria-haspopup="dialog"
                  aria-expanded={isCartOpen}
                  id="shopping-bag-button"
               >
                  <ShoppingBagIcon className="h-6 w-6" />
                  {/* Cart item count badge */}
                  {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-[var(--color-text-inverted)]">
                          {cartItems.length}
                      </span>
                  )}
              </button>
              
              {/* Mobile Menu Hamburger Button */}
              <button 
                className="md:hidden text-[var(--color-text-secondary)]" 
                onClick={() => setIsMenuOpen(true)}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu-overlay"
                aria-label="Open menu"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Full-Screen Overlay */}
      <div 
        id="mobile-menu-overlay" 
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed inset-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
             <img 
                src={formatGoogleDriveLink(LOGO_URL, 'image', { height: 120 })} 
                alt="Thrift by Musk Logo" 
                className="h-10 w-auto" 
              />
            <span className="text-2xl font-serif font-bold text-[var(--color-text-primary)]">Thrift by Musk</span>
          </Link>
          <button 
            className="text-[var(--color-text-secondary)]" 
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <CloseIcon className="h-7 w-7" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full gap-8 -mt-16">
          {navLinks}
        </nav>
      </div>
    </>
  );
};

export default Header;