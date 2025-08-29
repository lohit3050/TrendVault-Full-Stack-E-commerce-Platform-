import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Add this import
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart(); // Add this
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1); // Add quantity state

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  // Get all available images
  const getProductImages = () => {
    const images = [];
    
    if (product.images && product.images.length > 0) {
      images.push(...product.images);
    }
    
    if (product.image && !images.includes(product.image)) {
      images.unshift(product.image);
    }
    
    return images.filter(img => img && img.trim() !== '');
  };

  const productImages = getProductImages();

  return (
    <div className="container">
      <div className="product-detail-container">
        
        {/* STICKY Image Gallery Section - LEFT SIDE */}
        <div className="product-detail-images-sticky">
          {productImages.length > 0 ? (
            <div className="images-wrapper">
              <div className="main-image-container">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name}
                  className="main-product-image"
                />
              </div>
              
              {productImages.length > 1 && (
                <div className="image-thumbnails">
                  {productImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${product.name} view ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
              
              {productImages.length > 1 && (
                <div className="image-counter">
                  {selectedImage + 1} / {productImages.length}
                </div>
              )}
            </div>
          ) : (
            <div className="no-image-placeholder">
              <span>📦</span>
              <p>No images available</p>
            </div>
          )}
        </div>
        
        {/* SCROLLABLE Product Info Section - RIGHT SIDE */}
        <div className="product-detail-info-scrollable">
          <div className="product-info-content">
            <h1>{product.name}</h1>
            <p className="price">${product.price}</p>
            <p className="category">Category: {product.category}</p>
            <p className="stock">Stock: {product.stock} available</p>
            
            {/* Quantity Selector */}
            <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="btn btn-primary add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="btn btn-secondary wishlist">
                ♡ Add to Wishlist
              </button>
            </div>

            {/* Product Description */}
            <div className="description">
              <h3>Description</h3>
              <div className="description-content">
                <p>{product.description}</p>
                
                <div className="additional-info">
                  <h4>Features</h4>
                  <ul>
                    <li>Premium build quality</li>
                    <li>Latest technology integration</li>
                    <li>User-friendly design</li>
                    <li>Long-lasting durability</li>
                    <li>Excellent customer support</li>
                  </ul>
                  
                  <h4>Specifications</h4>
                  <ul>
                    <li>Category: {product.category}</li>
                    <li>Stock Available: {product.stock} units</li>
                    <li>Price: ${product.price}</li>
                    <li>Condition: Brand New</li>
                  </ul>

                  <h4>Delivery Information</h4>
                  <p>Fast and reliable delivery options available. Standard shipping takes 3-5 business days, while express delivery is available for next-day service.</p>

                  <h4>Return Policy</h4>
                  <p>30-day return policy with full refund. Items must be in original condition and packaging.</p>
                </div>
              </div>
            </div>
            
            {/* Seller Information */}
            <div className="seller-info">
              <h3>Seller Information</h3>
              <div className="seller-details">
                <p><strong>Shop:</strong> {product.seller?.shopName || product.seller?.name}</p>
                <p><strong>Email:</strong> {product.seller?.email}</p>
                <div className="seller-actions">
                  <button className="btn btn-outline">Contact Seller</button>
                  <button className="btn btn-outline">View All Products</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProductDetail;
