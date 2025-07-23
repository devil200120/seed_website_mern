import { Link } from "react-router-dom";

function Products() {
  const productCategories = [
    {
      icon: "🥬",
      title: "Fresh Vegetables",
      description:
        "Premium quality vegetables sourced directly from certified farms",
      products: [
        "Onions",
        "Potatoes",
        "Tomatoes",
        "Garlic",
        "Ginger",
        "Green Chilies",
      ],
      link: "/products/fresh-vegetables",
    },
    {
      icon: "🍎",
      title: "Fresh Fruits",
      description:
        "Tropical and seasonal fruits with exceptional taste and nutrition",
      products: [
        "Mangoes",
        "Grapes",
        "Pomegranates",
        "Bananas",
        "Oranges",
        "Apples",
      ],
      link: "/products/fresh-fruits",
    },
    {
      icon: "🌶️",
      title: "Spices & Herbs",
      description: "Authentic Indian spices with rich aroma and flavor",
      products: [
        "Turmeric",
        "Red Chili",
        "Coriander",
        "Black Pepper",
        "Cumin",
        "Cardamom",
      ],
      link: "/products/spices-herbs",
    },
    {
      icon: "🌾",
      title: "Grains & Cereals",
      description: "High-quality grains and cereals for global markets",
      products: ["Basmati Rice", "Wheat", "Maize", "Millets", "Barley", "Oats"],
      link: "/products",
    },
    {
      icon: "🫘",
      title: "Pulses & Legumes",
      description: "Protein-rich pulses and legumes with excellent quality",
      products: [
        "Chickpeas",
        "Lentils",
        "Black Gram",
        "Pigeon Peas",
        "Kidney Beans",
        "Green Peas",
      ],
      link: "/products",
    },
    {
      icon: "🌻",
      title: "Oil Seeds",
      description: "Premium oil seeds for oil extraction and processing",
      products: [
        "Sesame Seeds",
        "Sunflower Seeds",
        "Mustard Seeds",
        "Groundnuts",
        "Safflower",
        "Niger Seeds",
      ],
      link: "/products",
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Our Products</h1>
          <p>Premium Agricultural Products from India</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Comprehensive Product Range</h2>
            <p>
              We export a wide variety of premium agricultural products from
              India, each carefully selected and processed to meet international
              quality standards. Our diverse product portfolio ensures we can
              meet varied customer requirements across global markets.
            </p>
          </div>

          <div className="products-grid">
            {productCategories.map((category, index) => (
              <div key={index} className="product-category">
                <div className="category-header">
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.title}</h3>
                </div>
                <div className="category-content">
                  <p className="category-description">{category.description}</p>
                  <ul className="category-products">
                    {category.products.map((product, idx) => (
                      <li key={idx}>{product}</li>
                    ))}
                  </ul>
                  <Link to={category.link} className="category-link">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="products-cta">
            <h3>Custom Requirements?</h3>
            <p>
              Looking for specific products or have custom requirements? Contact
              our team to discuss your needs and get personalized solutions.
            </p>
            <Link to="/contact" className="btn-primary">
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
