import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import apiInstance from '../api/apiInstance.js'

// icon for each category name (lowercase). if a name is not here, a tag icon is shown
const categoryIcons = {
  'electronic': 'bi-phone',
  'electronics': 'bi-phone',
  'mobile': 'bi-phone',
  'mobiles': 'bi-phone',
  'laptop': 'bi-laptop',
  'laptops': 'bi-laptop',
  'fashion': 'bi-handbag',
  'clothes': 'bi-handbag',
  'clothing': 'bi-handbag',
  'beauty': 'bi-heart',
  'home': 'bi-house-door',
  'furniture': 'bi-lamp',
  'appliances': 'bi-lightning-charge',
  'grocery': 'bi-basket',
  'food': 'bi-cup-straw',
  'toys': 'bi-joystick',
  'books': 'bi-book',
  'sports': 'bi-trophy',
  'shoes': 'bi-bag',
  'watches': 'bi-smartwatch',
}

const getIcon = (name) => categoryIcons[name.toLowerCase()] || 'bi-tag'

// light background colors for the product shelves (like flipkart sections)
const shelfColors = ['#e7f3e7', '#ece7f6', '#e3eefc', '#fdeee7']

const Home = () => {

  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const location = useLocation()
  const search = new URLSearchParams(location.search).get('q') || ''

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const res = await apiInstance.get('/product/get-all')
      setProducts(res.data.products)
    } catch (error) {
      console.log(error);
    }
  }

  // if product has no image saved, show a placeholder
  const getImage = (product) => {
    return product.image || `https://placehold.co/300x300/f5f7fa/2874f0?text=${product.name}`
  }

  // unique category names taken from products
  const categories = [...new Set(products.map((p) => p.category?.name).filter(Boolean))]

  // filter by search text and selected category
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === '' || p.category?.name === category
    return matchSearch && matchCategory
  })

  return (
    <div className="fk-page">

      {/* category menu like flipkart */}
      <div className="fk-category-strip">
        <a className={`fk-category-item ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>
          <i className="bi bi-grid fk-category-icon"></i>
          For You
        </a>
        {categories.map((cat) => (
          <a className={`fk-category-item ${category === cat ? 'active' : ''}`} key={cat} onClick={() => setCategory(cat)}>
            <i className={`bi ${getIcon(cat)} fk-category-icon`}></i>
            {cat}
          </a>
        ))}
      </div>

      {/* coupon banner centered (image kept in public folder) */}
      <div className="fk-coupon">
        <img src="/6015c703748e7a42.jpg" alt="Exclusive coupon - Flat 10% Off" />
      </div>

      {/* banner slider - 3 banners visible per slide like flipkart, slides every 2s */}
      <div id="bannerSlider" className="carousel slide fk-slider" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#bannerSlider" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#bannerSlider" data-bs-slide-to="1"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="2000">
            <div className="fk-slide-row">
              <img src="/a4ad08dbd28c5145.jpg" alt="Value 365" />
              <img src="/47e5f5bdcc2189ca.jpg" alt="Motobook 60 offer" />
              <img src="/8e370fb79013c611.png" alt="Nothing Phone offer" />
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <div className="fk-slide-row">
              <img src="/1af21fed52bfc979.png" alt="Kinder Schoko-Bons offer" />
              <img src="/4abaa3239b72d4d9.png" alt="FireBoltt coming soon" />
              <img src="/47e5f5bdcc2189ca.jpg" alt="Motobook 60 offer" />
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#bannerSlider" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bannerSlider" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* one shelf per category (only on the normal home view) */}
      {category === '' && search === '' && categories.map((cat, index) => {
        const catProducts = products.filter((p) => p.category?.name === cat)
        return (
          <div className="fk-shelf" style={{ backgroundColor: shelfColors[index % shelfColors.length] }} key={cat}>
            <div className="fk-shelf-head">
              <h5>Best of {cat}</h5>
              <a onClick={() => setCategory(cat)} className="fk-shelf-arrow"><i className="bi bi-arrow-right"></i></a>
            </div>
            <div className="fk-shelf-row">
              {catProducts.map((product) => (
                <Link to={`/product/${product._id}`} className="fk-shelf-card" key={product._id}>
                  <img src={getImage(product)} alt={product.name} />
                  <p className="fk-product-name">{product.name}</p>
                  <p className="fk-shelf-offer">From ₹{product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      {/* all / filtered products grid */}
      <div className="fk-section">
        <h4 className="fk-section-title">
          {category === '' ? 'All Products' : category}
          {search && ` - results for "${search}"`}
        </h4>

        {filteredProducts.length === 0 && <p>No products found..</p>}

        <div className="fk-product-grid">
          {filteredProducts.map((product) => (
            <Link to={`/product/${product._id}`} className="fk-product-card" key={product._id}>
              <img src={getImage(product)} alt={product.name} />
              <p className="fk-product-name">{product.name}</p>
              <span className="fk-rating">4.2 <i className="bi bi-star-fill"></i></span>
              <p className="fk-price">₹{product.price}</p>
              <p className="fk-product-category">{product.category?.name}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home
