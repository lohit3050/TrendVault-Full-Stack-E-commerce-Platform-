import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); 
  const productsPerPage = 12;

  const categoryInfo = {
  electronics: { image: '/images/electronics1.jpg', description: 'Latest gadgets and electronics' },
  cosmetics: { image: '/images/cosmetics.jpg', description: 'Beauty and personal care products' },
  clothing: { image: '/images/clothing.jpg', description: 'Fashion and apparel' },
  'home & garden': { image: '/images/home1.jpg', description: 'Home decor and garden items' },
  sports: { image: '/images/sports1.jpg', description: 'Sports and fitness equipment' },
  books: { image: '/images/books.jpg', description: 'Books and educational materials' }
};

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryName, currentPage]);

  // ✅ Filter products based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const fetchCategoryProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/category/${categoryName}?page=${currentPage}&limit=${productsPerPage}`
      );
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error('Error fetching category products:', error);
      // Fallback: fetch all products and filter client-side
      try {
        const fallbackResponse = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        const categoryProducts = fallbackResponse.data.filter(
          product => product.category.toLowerCase() === categoryName.toLowerCase()
        );
        
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        setProducts(categoryProducts.slice(startIndex, endIndex));
        setTotalProducts(categoryProducts.length);
        setTotalPages(Math.ceil(categoryProducts.length / productsPerPage));
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const currentCategoryInfo = categoryInfo[categoryName.toLowerCase()] || {
    image: '/images/default-category.jpg',
    color: '#667eea',
    description: 'Products in this category'
  };

  if (loading) {
    return <div className="loading">Loading {categoryName} products...</div>;
  }

  return (
    <div className="category-page">
      <div className="container">
        {/* Category Header */}
        <div className="category-header-image"
          style={{ backgroundImage: `url(${currentCategoryInfo.image})` }}
        >
          <div className="category-header-overlay"></div>
          <div className="category-header-content">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Back to Home
            </button>
            <div className="category-info">
              <h1>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h1>
              <p>{currentCategoryInfo.description}</p>
              <span className="product-count">
                {totalProducts} product{totalProducts !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
        </div>


        {/* ✅ ADDED: Search Bar in Category Page */}
        <div className="category-search-section">
          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder={`Search ${categoryName} products...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-btn">
                Clear Search
              </button>
            )}
          </div>
          
          {searchTerm && (
            <div className="search-results-info">
              <p>
                Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No Products Found</h3>
              <p>
                {searchTerm 
                  ? `No products found for "${searchTerm}" in ${categoryName}` 
                  : `We couldn't find any products in the ${categoryName} category.`
                }
              </p>
              {searchTerm ? (
                <button className="btn btn-primary" onClick={clearSearch}>
                  Clear Search
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Browse All Categories
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="category-products">
              <div className="products-header">
                <h2>
                  {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Products
                  {searchTerm && ` - Search Results`}
                </h2>
                <div className="page-info">
                  {searchTerm ? `${filteredProducts.length} results` : `Page ${currentPage} of ${totalPages}`}
                </div>
              </div>
              
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>

            {/* Pagination (only show when not searching) */}
            {!searchTerm && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
