import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
  const mainImage = productImages[0];

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image-container">
          {mainImage ? (
            <>
              <img 
                src={mainImage} 
                alt={product.name}
                className="product-image"
              />
              {productImages.length > 1 && (
                <div className="image-count">
                  +{productImages.length - 1} more
                </div>
              )}
            </>
          ) : (
            <div className="image-placeholder">
              <span>📦</span>
              <p>No image</p>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-price">${product.price}</p>
          <p className="product-seller">By: {product.seller?.shopName || product.seller?.name}</p>
          <p className="product-description">
            {product.description.substring(0, 100)}...
          </p>
          
          {/* Clean Call-to-Action */}
          <div className="product-cta">
            <span className="view-details-text">Click to view details</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
