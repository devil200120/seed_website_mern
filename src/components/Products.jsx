function Products() {
  const productCategories = [
    {
      title: "Fresh Vegetables",
      image: "🥬",
      products: [
        "Onions",
        "Potatoes",
        "Tomatoes",
        "Garlic",
        "Ginger",
        "Green Chili",
        "Okra",
        "Eggplant",
      ],
    },
    {
      title: "Fresh Fruits",
      image: "🥭",
      products: [
        "Mangoes",
        "Bananas",
        "Pomegranates",
        "Grapes",
        "Apples",
        "Oranges",
        "Lemons",
        "Coconuts",
      ],
    },
    {
      title: "Spices & Herbs",
      image: "🌶️",
      products: [
        "Turmeric",
        "Red Chili",
        "Coriander",
        "Cumin",
        "Black Pepper",
        "Cardamom",
        "Cloves",
        "Cinnamon",
      ],
    },
    {
      title: "Grains & Cereals",
      image: "🌾",
      products: [
        "Basmati Rice",
        "Non-Basmati Rice",
        "Wheat",
        "Corn",
        "Barley",
        "Millet",
        "Quinoa",
        "Oats",
      ],
    },
    {
      title: "Pulses & Legumes",
      image: "🫘",
      products: [
        "Chickpeas",
        "Lentils",
        "Black Gram",
        "Green Gram",
        "Kidney Beans",
        "Black Beans",
        "Peas",
        "Soybeans",
      ],
    },
    {
      title: "Oil Seeds",
      image: "🌻",
      products: [
        "Sesame Seeds",
        "Sunflower Seeds",
        "Mustard Seeds",
        "Groundnuts",
        "Castor Seeds",
        "Niger Seeds",
        "Flax Seeds",
        "Chia Seeds",
      ],
    },
  ];

  return (
    <section className="products" id="products">
      <div className="container">
        <div className="section-header">
          <h2>Our Products</h2>
          <p>Premium Quality Agricultural Products for Global Markets</p>
        </div>
        <div className="products-grid">
          {productCategories.map((category, index) => (
            <div key={index} className="product-category">
              <div className="category-header">
                <div className="category-icon">{category.image}</div>
                <h3>{category.title}</h3>
              </div>
              <div className="category-products">
                <ul>
                  {category.products.map((product, idx) => (
                    <li key={idx}>{product}</li>
                  ))}
                </ul>
              </div>
              <button className="btn-outline">View Details</button>
            </div>
          ))}
        </div>
        <div className="products-cta">
          <h3>Looking for specific products?</h3>
          <p>
            We can source and supply a wide range of agricultural products based
            on your requirements.
          </p>
          <a href="#contact" className="btn-primary">
            Request Quote
          </a>
        </div>
      </div>
    </section>
  );
}

export default Products;
