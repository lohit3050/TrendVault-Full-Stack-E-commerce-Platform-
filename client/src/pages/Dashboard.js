import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, enableSeller } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    return (
      <div className="loading">
        <p>Redirecting to login...</p>
      </div>
    );
  }
  try { 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [shopName, setShopName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [orders, setOrders] = useState([]);

  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0
  });
  const [sellerOrders, setSellerOrders] = useState([]);
  const [showSellerOrders, setShowSellerOrders] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [], // Changed to array for multiple images
    category: '',
    stock: ''
  });

  useEffect(() => {
    setLoading(false);
    if (user && user.isSeller) {
      fetchMyProducts();
      fetchSellerStats();
    }
  }, [user]);
  
  // ✅ Fetch seller statistics
  const fetchSellerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/seller/stats`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setSellerStats({
        totalProducts: products.length,
        totalOrders: response.data.totalOrders,
        totalEarnings: response.data.totalEarnings
      });
    } catch (error) {
      console.error('Error fetching seller stats:', error);
    }
  };  

  // ✅ Fetch orders for seller's products
  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/seller/orders`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setSellerOrders(response.data);
      setShowSellerOrders(true);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
    }
  };

  // Update stats when products change
  useEffect(() => {
    if (user && user.isSeller) {
      setSellerStats(prev => ({ ...prev, totalProducts: products.length }));
    }
  }, [products]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const fetchMyProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('Fetching my products with token:', token); // Debug log
    
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/products/seller/my-products`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('My products response:', response.data); // Debug log
    setProducts(response.data);
    setFilteredProducts(response.data);
  } catch (error) {
    console.error('Error fetching my products:', error);
    
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      console.error('Other error:', error.response?.data);
    }
  }
};


  const handleEnableSeller = async (e) => {
    e.preventDefault();
    const result = await enableSeller(shopName);
    if (result.success) {
      window.location.reload();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = selectedFiles.length + existingImages.length;
    
    if (currentTotal + files.length > 5) {
      alert(`You can upload maximum 5 images. You currently have ${currentTotal} images.`);
      return;
    }

    // Create preview URLs for all selected files
    const previews = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      isNew: true
    }));

    setSelectedFiles(prev => [...prev, ...previews]);
  };

  const removeNewFile = (index) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const removeExistingImage = (index) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/my-orders`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  useEffect(() => {
    fetchMyOrders();
  }, []);

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (selectedFiles[index]) {
      URL.revokeObjectURL(selectedFiles[index].preview);
    }
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    setUploading(true);
    
    try {
      const uploadData = new FormData();
      selectedFiles.forEach(item => {
        uploadData.append('images', item.file);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
      return [];
    } finally {
      setUploading(false);
    }
  };


  // Handle multiple image URLs
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        images: newImages
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Step 1: Prepare all images (existing + new uploads)
      let allImages = [...existingImages]; // Start with existing images

      // Step 2: Upload new images if any are selected
      if (selectedFiles.length > 0) {
        console.log('Uploading', selectedFiles.length, 'new images...');
        const uploadedUrls = await uploadImages();
        console.log('Uploaded URLs:', uploadedUrls);
        allImages = [...allImages, ...uploadedUrls];
      }

      console.log('Final images array:', allImages);

      // Step 3: Create productData object (AFTER all variables are ready)
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        images: allImages,
        image: allImages[0] || '', // First image as main image
        category: formData.category,
        stock: parseInt(formData.stock, 10)
      };

      console.log('Sending product data:', productData);

      // Step 4: Make API call
      if (editingProduct) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/products/${editingProduct._id}`, 
          productData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Update response:', response.data);
        alert('Product updated successfully!');
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/products`, 
          productData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Create response:', response.data);
        alert('Product added successfully!');
      }

      // Step 5: Clean up and refresh
      resetForm();
      fetchMyProducts();

    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Error saving product: ${errorMessage}`);
    }
  };


  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', images: [], category: '', stock: '' });
    
    selectedFiles.forEach(item => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });

    setSelectedFiles([]);
    setExistingImages([]);
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
    setExistingImages(product.images || [product.image].filter(Boolean));
    setSelectedFiles([]);
    setEditingProduct(product);
    setShowAddForm(true);
    window.scrollTo({
      top: 400,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`);
        fetchMyProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      selectedFiles.forEach(item => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="user-welcome">
          <h3>Welcome!</h3>
          <p>{user.name}</p>
          {user.isSeller && <span className="seller-badge">Seller Account</span>}
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">📦</span>
            Your Orders
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'seller' ? 'active' : ''}`}
            onClick={() => setActiveTab('seller')}
          >
            <span className="nav-icon">🏪</span>
            Business Page
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        
        {/* Your Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header">
              <h2>Your Orders</h2>
              <p>Track your purchases and order history</p>
            </div>
    
            {orders.length === 0 ? (
              <div className="no-orders">
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <h3>No Orders Yet</h3>
                  <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                  <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Browse Products
                  </button>
                </div>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h4>Order #{order.orderNumber}</h4>
                        <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
            
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item._id} className="order-item">
                          <img src={item.image} alt={item.name} />
                            <div className="item-details">
                              <h5>{item.name}</h5>
                              <p>Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                        </div>
                      ))}
                    </div>
            
                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: ${order.totalAmount}</strong>
                      </div>
                      <div className="order-actions">
                        <button className="btn btn-sm btn-secondary">
                          View Details
                        </button>
                        {order.status === 'Pending' && (
                          <button className="btn btn-sm btn-danger">
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
)}

        {/* Sellers Page Tab */}
        {activeTab === 'seller' && (
          <div className="seller-section">
            {!user.isSeller ? (
              <div className="enable-seller">
                <div className="section-header">
                  <h2>Become a Seller</h2>
                  <p>Start your business journey with us!</p>
                </div>
                
                <div className="seller-benefits">
                  <div className="benefit-card">
                    <span className="benefit-icon">💰</span>
                    <h4>Earn Money</h4>
                    <p>Sell your products and earn profits</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">🌍</span>
                    <h4>Reach Customers</h4>
                    <p>Access thousands of potential buyers</p>
                  </div>
                  <div className="benefit-card">
                    <span className="benefit-icon">📊</span>
                    <h4>Easy Management</h4>
                    <p>Simple tools to manage your business</p>
                  </div>
                </div>

                <div className="enable-seller-form">
                  <h3>Setup Your Shop</h3>
                  <form onSubmit={handleEnableSeller}>
                    <div className="form-group">
                      <label>Shop Name</label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Enter your shop name"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success">
                      Enable Seller Account
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="seller-dashboard">
                <div className="section-header">
                  <h2>Seller Dashboard</h2>
                  <p>Manage your shop: <strong>{user.shopName}</strong></p>
                </div>

                {/* Seller Stats */}
                <div className="seller-stats">
                  <button className="stat-card stat-button">
                    <div className="stat-number">{sellerStats.totalProducts}</div>
                    <div className="stat-label">Total Products</div>
                  </button>
                            
                  <button 
                    className="stat-card stat-button" 
                    onClick={fetchSellerOrders}
                  >
                    <div className="stat-number">{sellerStats.totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                  </button>
                            
                  <button className="stat-card stat-button">
                    <div className="stat-number">₹{sellerStats.totalEarnings}</div>
                    <div className="stat-label">Total Earnings</div>
                  </button>
                </div>
                
                {/* ✅ Seller Orders View */}
                {showSellerOrders && (
                  <div className="seller-orders-section">
                    <div className="section-header">
                      <h3>Orders for Your Products</h3>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setShowSellerOrders(false)}
                      >
                        Hide Orders
                      </button>
                    </div>
                    
                    {sellerOrders.length === 0 ? (
                      <div className="no-orders">
                        <p>No one has ordered your products yet.</p>
                      </div>
                    ) : (
                      <div className="orders-list">
                        {sellerOrders.map(order => (
                          <div key={order._id} className="order-card seller-order">
                            <div className="order-header">
                              <div className="order-info">
                                <h4>Order #{order.orderNumber}</h4>
                                <p>
                                  Customer: <strong>{order.user.name}</strong> ({order.user.email})
                                </p>
                                <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="order-status">
                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                    
                            <div className="order-items">
                              {order.items.map(item => (
                                <div key={item._id} className="order-item">
                                  <img src={item.image} alt={item.name} />
                                  <div className="item-details">
                                    <h5>{item.name}</h5>
                                    <p>Qty: {item.quantity} × ₹{item.price}</p>
                                    <p className="item-total">
                                      Subtotal: ₹{item.quantity * item.price}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                    
                            <div className="order-footer">
                              <div className="customer-info">
                                <strong>Delivery Address:</strong>
                                <p>{order.buyer.address}, {order.buyer.city}</p>
                                <p>Phone: {order.buyer.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Add/Edit Product Form */}
                {showAddForm && (
                  <div className="add-product-section">
                    <div className="form-header">
                      <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <button className="btn btn-secondary" onClick={resetForm}>
                          Cancel
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="product-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Product Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter product name"
                              required
                            />
                        </div>
                        
                        <div className="form-group">
                          <label>Price ($)</label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Category</label>
                          <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            placeholder="e.g., Electronics, Clothing"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Stock Quantity</label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>

                      {/* Enhanced Multiple Image Upload Section */}
                      <div className="form-group">
                        <div className="images-header">
                          <label>Product Images (Max 5 Total)</label>
                          <div className="image-count-info">
                            {existingImages.length + selectedFiles.length}/5 images
                          </div>
                        </div>
                        
                        {/* Existing Images (for editing) */}
                        {existingImages.length > 0 && (
                          <div className="existing-images-section">
                            <h4>Current Images:</h4>
                            <div className="image-previews">
                              {existingImages.map((imageUrl, index) => (
                                <div key={`existing-${index}`} className="image-preview existing">
                                  <img src={imageUrl} alt={`Existing ${index + 1}`} />
                                  <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => removeExistingImage(index)}
                                    title="Remove this image"
                                  >
                                    ✕
                                  </button>
                                  <div className="image-label">Existing</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New Image Upload */}
                        {(existingImages.length + selectedFiles.length) < 5 && (
                          <div className="image-upload-container">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileSelect}
                              className="file-input"
                              id="image-upload"
                            />
                            <label htmlFor="image-upload" className="file-upload-label">
                              📸 Add More Images ({5 - existingImages.length - selectedFiles.length} remaining)
                            </label>
                          </div>
                        )}

                        {/* New Image Previews */}
                        {selectedFiles.length > 0 && (
                          <div className="new-images-section">
                            <h4>New Images to Upload:</h4>
                            <div className="image-previews">
                              {selectedFiles.map((item, index) => (
                                <div key={`new-${index}`} className="image-preview new">
                                  <img src={item.preview} alt={`New ${index + 1}`} />
                                  <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => removeNewFile(index)}
                                    title="Remove this image"
                                  >
                                    ✕
                                  </button>
                                  <div className="image-label">New</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Max Images Reached Message */}
                        {(existingImages.length + selectedFiles.length) >= 5 && (
                          <div className="max-images-message">
                            ✅ Maximum 5 images reached. Remove some images to add more.
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your product..."
                          rows="4"
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" disabled={uploading}>
                        {uploading 
                          ? `Uploading ${selectedFiles.length} image(s)...` 
                          : editingProduct 
                            ? 'Update Product' 
                            : 'Add Product'
                        }
                      </button>
                    </form>
                  </div>
                )}

                {/* Products Management */}
                <div className="my-products-section">
                  <div className="products-header">
                    <h3>My Products ({products.length})</h3>
                    <div className="products-controls">
                      {/* Search Bar */}
                      <div className="search-bar">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                      </div>
                      
                      <button 
                        className="btn btn-success"
                        onClick={() => {
                          setShowAddForm(true);
                          setEditingProduct(null);
                          setFormData({ name: '', description: '', price: '', images: [], category: '', stock: '' });
                          setExistingImages([]);
                          setSelectedFiles([]);
                        }}
                      >
                        + Add Product
                      </button>
                    </div>
                  </div>
                  
                  {filteredProducts.length === 0 ? (
                    <div className="no-products">
                      <p>{searchTerm ? `No products found for "${searchTerm}"` : "You haven't added any products yet."}</p>
                    </div>
                  ) : (
                    <div className="products-grid">
                      {filteredProducts.map(product => (
                        <div key={product._id} className="product-card">
                          <div className="product-images">
                            {product.images && product.images.length > 0 ? (
                              <div className="image-gallery">
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="main-image"
                                />
                                {product.images.length > 1 && (
                                  <div className="image-count">
                                    +{product.images.length - 1} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              product.image && (
                                <img src={product.image} alt={product.name} />
                              )
                            )}
                          </div>
                          
                          <div className="product-info">
                            <h4>{product.name}</h4>
                            <p className="price">${product.price}</p>
                            <p className="stock">Stock: {product.stock}</p>
                            <p className="category">{product.category}</p>
                            <p className="description">
                              {product.description.substring(0, 80)}...
                            </p>
                            
                            <div className="product-actions">
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(product._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}catch(error) {
  console.error('Dashboard render error:', error);
    return (
      <div className="error-fallback">
        <h2>Something went wrong</h2>
        <p>Please refresh the page and try again.</p>
        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }
};

export default Dashboard;