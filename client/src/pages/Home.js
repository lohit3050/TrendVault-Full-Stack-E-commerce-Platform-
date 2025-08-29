import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  const backgroundImages = [
    '/images/electronics.jpg',
    '/images/cosmetics.jpg', 
    '/images/sports.jpg',
    '/images/home-garden.jpg',
    '/images/electronics1.jpg',
    '/images/books.jpg',
    '/images/clothing.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prevIndex => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const categoryIcons = [
    { 
      name: 'Electronics', 
      image: '/images/electronics.jpg',
      description: 'Phones, Laptops, Gadgets'
    },
    { 
      name: 'Cosmetics', 
      image: '/images/cosmetics.jpg',
      description: 'Beauty & Personal Care'
    },
    { 
      name: 'Clothing', 
      image: '/images/clothing.jpg',
      description: 'Fashion & Apparel'
    },
    { 
      name: 'Home & Garden', 
      image: '/images/home-garden.jpg',
      description: 'Home Decor & Garden'
    },
    { 
      name: 'Sports', 
      image: '/images/sports.jpg',
      description: 'Sports & Fitness'
    },
    { 
      name: 'Books', 
      image: '/images/books.jpg',
      description: 'Books & Education'
    }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div 
      className="home-page"
      style={{
        position: 'sticky',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div 
        className="home-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      ></div>
      
      {/* Content wrapper */}
      <div 
        className="home-content"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '2rem 0'
        }}
      >
        {/* Welcome Message Container */}
        <div 
          className="welcome-message-container"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          <h1 style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            fontWeight: 800,
            color: 'white'
          }}>
            Welcome to Our Store
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 500
          }}>
            Discover amazing products from trusted sellers
          </p>
        </div>
        
        {/* Category Icons Section */}
        <div 
          className="categories-section"
          style={{
            padding: '2rem',
            background: 'rgba(255,255,255,0.95)',
            margin: '2rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <div 
            className="section-header"
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              color: '#2c3e50',
              marginBottom: '1rem'
            }}>
              Shop by Categories
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#7f8c8d'
            }}>
              Discover products in your favorite categories
            </p>
          </div>
          
          <div 
            className="icon-container"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, 280px)',
              gap: '2rem',
              justifyContent: 'center'
            }}
          >
            {categoryIcons.map((category, index) => (
              <div 
                key={category.name}
                className="category-card"
                onClick={() => handleCategoryClick(category.name)}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: '250px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                {/* Category overlay for better text readability */}
                <div 
                  className="category-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)',
                    zIndex: 1
                  }}
                ></div>
                
                {/* Category content */}
                <div 
                  className="category-content"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '1.5rem',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{
                    color: 'white',
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {category.description}
                  </p>
                  <button 
                    className="category-btn"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '2px solid rgba(255,255,255,0.3)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Explore {category.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
