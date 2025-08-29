import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate(); // Add this line inside the component
  
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{getTotalItems()} item(s) in your cart</p>
          <button 
            className="btn btn-danger clear-cart"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || item.images?.[0]} 
                    alt={item.name}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-seller">
                    Sold by: {item.seller?.shopName || item.seller?.name}
                  </p>
                </div>

                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  <p className="unit-price">${item.price} each</p>
                  <p className="total-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="item-actions">
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-danger remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-content">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({getTotalItems()} items):</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="summary-row">
                <span>Tax:</span>
                <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
              </div>

              <div className="checkout-actions">
                <button 
                  className="btn btn-primary checkout-btn" 
                  onClick={() => navigate('/checkout')} // Fixed: now uses lowercase /checkout
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
                <Link to="/" className="btn btn-secondary continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
