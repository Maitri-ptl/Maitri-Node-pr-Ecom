import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import apiInstance from '../api/apiInstance.js'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingItemIds, setUpdatingItemIds] = useState([])
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    pincode: '',
    state: '',
    city: '',
    houseNumber: '',
    area: ''
  })

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await apiInstance.get('/cart/get')
        // A product could be deleted after it was added to a cart.
        setCartItems((response.data.cart || []).filter((item) => item.product))
      } catch (error) {
        console.error('Unable to load cart:', error)
        toast.error('Failed to load cart')
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  const changeQuantity = async (cartItemId, quantityChange) => {
    const selectedItem = cartItems.find((item) => item._id == cartItemId)

    if (!selectedItem || selectedItem.quantity + quantityChange < 1) {
      return
    }

    const action = quantityChange > 0 ? 'increase' : 'decrease'
    const previousQuantity = selectedItem.quantity

    // Update the UI first, then save the same change on the server.
    setCartItems((currentItems) => currentItems.map((item) => (
      item._id === cartItemId
        ? { ...item, quantity: item.quantity + quantityChange }
        : item
    )))
    setUpdatingItemIds((currentIds) => [...currentIds, cartItemId])

    try {
      const response = await apiInstance.put(`/cart/${action}/${cartItemId}`)
      const savedQuantity = response.data.cartItem.quantity

      // Keep the server value in case the backend applies a quantity rule.
      setCartItems((currentItems) => currentItems.map((item) => (
        item._id === cartItemId ? { ...item, quantity: savedQuantity } : item
      )))
    } catch (error) {
      console.error('Unable to update quantity:', error)
      // Restore the previous quantity if the server request did not succeed.
      setCartItems((currentItems) => currentItems.map((item) => (
        item._id === cartItemId ? { ...item, quantity: previousQuantity } : item
      )))
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingItemIds((currentIds) => currentIds.filter((id) => id !== cartItemId))
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      await apiInstance.delete(`/cart/remove/${cartItemId}`)
      setCartItems((currentItems) => currentItems.filter((item) => item._id !== cartItemId))
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Unable to remove cart item:', error)
      toast.error('Failed to remove item')
    }
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setAddress((currentAddress) => ({ ...currentAddress, [name]: value }))
  }

  const placeOrder = async () => {
    const requiredFields = ['fullName', 'phoneNumber', 'pincode', 'state', 'city', 'houseNumber', 'area']
    const hasMissingAddressField = requiredFields.some((field) => !address[field].trim())

    if (hasMissingAddressField) {
      toast.info('Please fill in your delivery address first')
      return
    }

    try {
      // The project currently treats clearing the cart as placing an order.
      await apiInstance.delete('/cart/clear')
      setCartItems([])
      toast.success('Order placed successfully')
    } catch (error) {
      console.error('Unable to place order:', error)
      toast.error('Failed to place order')
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + Number(item.product.price || 0) * item.quantity, 0)

  if (isLoading) {
    return <div className="fk-page"><div className="fk-section text-center py-5"><p>Loading cart...</p></div></div>
  }

  if (cartItems.length === 0) {
    return <div className="fk-page"><div className="fk-section text-center py-5"><i className="bi bi-cart-x" style={{ fontSize: '60px', color: '#2874f0' }}></i><h4>Your cart is empty!</h4><p className="text-muted">Add items to it now.</p><Link to="/" className="btn btn-primary">Shop Now</Link></div></div>
  }

  return (
    <div className="fk-page"><div className="fk-cart-layout">
      <div className="fk-cart-items">
        <section className="fk-section">
          <h4 className="fk-section-title">My Cart ({totalItems})</h4>
        {cartItems.map((item) => {
          const { product } = item
          const productImage = product.image || `https://placehold.co/100x100/f5f7fa/2874f0?text=${encodeURIComponent(product.name)}`
          const isUpdating = updatingItemIds.includes(item._id)

          return <div className="fk-cart-item" key={item._id}>
            <img src={productImage} alt={product.name} />
            <div className="fk-cart-item-info"><p className="fk-product-name mb-1">{product.name}</p><p className="fk-product-category mb-1">{product.category?.name}</p><p className="fk-price mb-0">Rs.{product.price}</p></div>
            <div className="fk-qty-btns">
              <button aria-label={`Decrease ${product.name} quantity`} disabled={isUpdating || item.quantity === 1} onClick={() => changeQuantity(item._id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button aria-label={`Increase ${product.name} quantity`} disabled={isUpdating} onClick={() => changeQuantity(item._id, 1)}>+</button>
            </div>
            <button className="fk-remove-btn" onClick={() => removeItem(item._id)}>REMOVE</button>
          </div>
        })}
        </section>

        <section className="fk-section">
          <h5 className="mb-1">Delivery Address</h5>
          <p className="text-muted small mb-4">Enter the address where you want to receive your order.</p>

          <div className="row g-3">
            <div className="col-12"><input className="form-control" name="fullName" value={address.fullName} onChange={handleAddressChange} placeholder="Full Name (Required) *" /></div>
            <div className="col-md-6"><input className="form-control" type="tel" name="phoneNumber" value={address.phoneNumber} onChange={handleAddressChange} placeholder="Phone number (Required) *" /></div>
            <div className="col-md-6"><input className="form-control" type="tel" name="alternatePhoneNumber" value={address.alternatePhoneNumber} onChange={handleAddressChange} placeholder="Alternate Phone Number" /></div>
            <div className="col-md-4"><input className="form-control" name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="Pincode (Required) *" /></div>
            <div className="col-md-4"><input className="form-control" name="state" value={address.state} onChange={handleAddressChange} placeholder="State (Required) *" /></div>
            <div className="col-md-4"><input className="form-control" name="city" value={address.city} onChange={handleAddressChange} placeholder="City (Required) *" /></div>
            <div className="col-12"><input className="form-control" name="houseNumber" value={address.houseNumber} onChange={handleAddressChange} placeholder="House No., Building Name (Required) *" /></div>
            <div className="col-12"><input className="form-control" name="area" value={address.area} onChange={handleAddressChange} placeholder="Road name, Area, Colony (Required) *" /></div>
          </div>
        </section>
      </div>

      <aside className="fk-price-details fk-section"><h6>Price Details</h6><div className="fk-price-row"><span>Price ({totalItems} items)</span><span>Rs.{totalPrice}</span></div><div className="fk-price-row"><span>Discount</span><span className="text-success">Rs.0</span></div><div className="fk-price-row"><span>Delivery Charges</span><span className="text-success">Free</span></div><div className="fk-price-row fk-price-total"><span>Total Amount</span><span>Rs.{totalPrice}</span></div><button className="fk-place-order" onClick={placeOrder}>PLACE ORDER</button></aside>
    </div></div>
  )
}

export default Cart
