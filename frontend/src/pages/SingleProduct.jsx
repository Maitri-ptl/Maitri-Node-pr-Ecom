import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiInstance from '../api/apiInstance.js'
import { toast } from 'react-toastify'

const SingleProduct = () => {

  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getProduct()
  }, [id])

  const getProduct = async () => {
    try {
      const res = await apiInstance.get(`/product/get/${id}`)
      setProduct(res.data.product)
    } catch (error) {
      console.log(error);
      toast.error('Product not found')
    }
  }

  const addToCart = async () => {
    // Cart routes require a logged-in user. Check first so the user gets a helpful message.
    if (!localStorage.getItem('token')) {
      toast.info('Please login to add items to your cart')
      navigate('/login')
      return false
    }

    try {
      await apiInstance.post('/cart/add', { productId: product._id, quantity: 1 })
      toast.success('Added to cart')
      return true
    } catch (error) {
      console.error('Unable to add product to cart:', error)

      if (error.response?.status === 401) {
        toast.info('Your session has expired. Please login again.')
        navigate('/login')
      } else {
        toast.error(error.response?.data?.message || 'Failed to add product to cart')
      }
      return false
    }
  }

  const buyNow = async () => {
    const wasAdded = await addToCart()
    if (wasAdded) {
      navigate('/cart')
    }
  }

  if (!product) {
    return <div className="fk-page"><p>Loading...</p></div>
  }

  const image = product.image || `https://placehold.co/400x400/f5f7fa/2874f0?text=${product.name}`

  return (
    <div className="fk-page">
      <div className="fk-single">

        <div className="fk-single-left">
          <img src={image} alt={product.name} />
          <div className="fk-single-btns">
            <button className="fk-btn-cart" onClick={addToCart}><i className="bi bi-cart3 me-2"></i>ADD TO CART</button>
            <button className="fk-btn-buy" onClick={buyNow}><i className="bi bi-lightning-fill me-2"></i>BUY NOW</button>
          </div>
        </div>

        <div className="fk-single-right">
          <h2>{product.name}</h2>
          <span className="fk-rating">4.2 <i className="bi bi-star-fill"></i></span>
          <span className="text-muted ms-2">1,024 Ratings & Reviews</span>
          <p className="fk-single-price">₹{product.price}</p>
          <p><strong>Description :</strong> {product.description}</p>

          <h6 className="mt-4">Available offers</h6>
          <ul className="fk-offers">
            <li><i className="bi bi-tag-fill text-success me-2"></i><strong>Bank Offer</strong> 10% off on Credit Card, up to ₹1,500</li>
            <li><i className="bi bi-tag-fill text-success me-2"></i><strong>Special Price</strong> Get extra 5% off (price inclusive of discount)</li>
            <li><i className="bi bi-truck text-success me-2"></i><strong>Free Delivery</strong> on this product</li>
            <li><i className="bi bi-arrow-repeat text-success me-2"></i>7 Days Replacement Policy</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default SingleProduct
