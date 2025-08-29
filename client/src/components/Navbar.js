import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';


const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (showUserPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: Reset body scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUserPanel]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-clicks
    
    try {
      setIsLoggingOut(true);
      setShowUserPanel(false); // Close panel first
      
      // Small delay to let panel animation complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Perform logout
      await logout();
      
      // Navigate after logout completes
      navigate('/');
      
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleUserPanel = () => {
    setShowUserPanel(!showUserPanel);
  };

  const closeUserPanel = () => {
    setShowUserPanel(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              TrendVault
            </Link>
            
            <ul className="navbar-nav">
              <li><Link to="/">Home</Link></li>
              
              {user ? (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li>
                    <Link to="/cart" className="cart-link">
                      🛒 Cart 
                      {getTotalItems() > 0 && (
                        <span className="cart-badge">{getTotalItems()}</span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="user-profile-btn"
                      onClick={toggleUserPanel}
                    >
                      <div className="user-avatar">
                        <span className="user-icon">👤</span>
                      </div>
                    </button>
                  </li>
                </>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* User Profile Sidebar Panel */}
      {showUserPanel && (
        <>
          {/* Overlay */}
          <div 
            className="sidebar-overlay"
            onClick={closeUserPanel}
          ></div>
          
          {/* User Panel */}
          <div className="user-sidebar-panel">
            <div className="user-panel-header">
              <button 
                className="close-panel-btn"
                onClick={closeUserPanel}
              >
                ✕
              </button>
            </div>
            
            <div className="user-panel-content">
              {user ? (
                <>
                  <div className="user-greeting">
                    <div className="user-avatar-large">
                      <span className="user-icon-large">👤</span>
                    </div>
                    <h3>Hello, {user.name}! 👋</h3>
                    <p className="user-email">{user.email}</p>
                    {user.isSeller && (
                      <span className="seller-badge">Seller Account</span>
                    )}
                  </div>

                  <div className="user-panel-menu">
                    <Link 
                      to="/dashboard" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">📊</span>
                      Dashboard
                    </Link>
                    
                    <Link 
                      to="/cart" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">🛒</span>
                      My Cart ({getTotalItems()})
                    </Link>
                    
                    <Link 
                      to="/dashboard" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">📦</span>
                      My Orders
                    </Link>
                    
                    <Link 
                      to="/profile" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">⚙️</span>
                      Account Settings
                    </Link>

                    {/* Add more menu items to test scrolling */}
                    <Link 
                      to="/wishlist" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">❤️</span>
                      Wishlist
                    </Link>
                    
                    <Link 
                      to="/notifications" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">🔔</span>
                      Notifications
                    </Link>
                    
                    <Link 
                      to="/help" 
                      className="panel-menu-item"
                      onClick={closeUserPanel}
                    >
                      <span className="menu-icon">❓</span>
                      Help & Support
                    </Link>
                  </div>

                  <div className="user-panel-footer">
                    <button 
                      className="logout-btn-panel"
                      onClick={handleLogout}
                    >
                      <span className="menu-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="guest-panel">
                  <h3>Welcome Guest!</h3>
                  <p>Please sign in to access your account</p>
                  <Link 
                    to="/login" 
                    className="btn btn-primary"
                    onClick={closeUserPanel}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
