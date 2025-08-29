import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [buyerInfo, setBuyerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBuyerInfo({
      ...buyerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buyerInfo.phone || buyerInfo.phone.length < 10) {
        alert('Please enter a valid phone number');
        return;
    }
  
    if (!buyerInfo.postalCode || buyerInfo.postalCode.length !== 6) {
        alert('Please enter a valid 6-digit postal code');
        return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        buyer: buyerInfo,
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          seller: item.seller._id
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: 'Cash on Delivery',
        status: 'Pending'
      };
      console.log('Sending order data:', orderData); // ✅ Debug log
      console.log('Buyer info:', orderData.buyer);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders`, orderData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Order response:', response.data);

      alert(`Order placed successfully! Order ID: ${response.data.orderNumber}`);
      clearCart();
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    return subtotal + shipping;
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-content">
          
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item._id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="price">${item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="total-line">
                <span>Shipping:</span>
                <span>{getTotalPrice() > 500 ? 'Free' : '₹50'}</span>
              </div>
              <div className="total-line final-total">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form-section">
            <h2>Shipping Details</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={buyerInfo.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={buyerInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={buyerInfo.phone}
                  onChange={handleChange}
                  placeholder="e.g., +91 XXXXXXXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Complete Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={buyerInfo.address}
                  onChange={handleChange}
                  placeholder="House/Flat No., Street, Locality, Landmark"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={buyerInfo.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={buyerInfo.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={buyerInfo.postalCode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    placeholder="123456"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={buyerInfo.country}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="payment-method">
                <h3>Payment Method</h3>
                <div className="payment-option">
                  <input type="radio" id="cod" name="payment" checked readOnly />
                  <label htmlFor="cod">
                    💰 Cash on Delivery
                  </label>
                  <p className="payment-note">
                    Pay when your order arrives at your doorstep
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${calculateTotal()}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
