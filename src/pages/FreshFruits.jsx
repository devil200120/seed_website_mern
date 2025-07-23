function FreshFruits() {
  const fruits = [
    {
      name: "Premium Mangoes",
      varieties: ["Alphonso", "Kesar", "Totapuri", "Banganapalli"],
      season: "March - June",
      description:
        "India's finest mangoes known for their exceptional taste and aroma",
      specifications: [
        "Size: 200-350g",
        "Brix: 18-24%",
        "Shelf Life: 2-3 weeks",
      ],
    },
    {
      name: "Fresh Grapes",
      varieties: ["Thompson Seedless", "Flame Seedless", "Red Globe"],
      season: "January - March",
      description:
        "Sweet, juicy grapes perfect for fresh consumption and processing",
      specifications: [
        "Size: 12-18mm",
        "Sugar: 16-20%",
        "Shelf Life: 3-4 weeks",
      ],
    },
    {
      name: "Premium Pomegranates",
      varieties: ["Arakta", "Ganesh", "Bhagwa"],
      season: "October - February",
      description: "Antioxidant-rich pomegranates with ruby-red arils",
      specifications: [
        "Size: 250-400g",
        "Aril Recovery: 55-65%",
        "Shelf Life: 2 months",
      ],
    },
    {
      name: "Fresh Bananas",
      varieties: ["Cavendish", "Robusta", "Red Banana"],
      season: "Year Round",
      description: "Nutritious bananas with perfect ripeness and sweetness",
      specifications: [
        "Length: 15-20cm",
        "Sugar: 12-15%",
        "Shelf Life: 1-2 weeks",
      ],
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Fresh Fruits</h1>
          <p>Tropical Delights from Indian Orchards</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Premium Quality Fruits</h2>
            <p>
              Our fresh fruits are handpicked from the finest orchards across
              India, ensuring optimal ripeness, nutrition, and flavor. We
              maintain strict quality standards and cold chain logistics to
              deliver fruits that exceed international expectations.
            </p>
          </div>

          <div className="products-showcase">
            {fruits.map((fruit, index) => (
              <div key={index} className="product-showcase-card">
                <div className="product-header">
                  <h3>{fruit.name}</h3>
                  <span className="season-badge">Season: {fruit.season}</span>
                </div>

                <div className="product-details">
                  <div className="varieties">
                    <h4>Available Varieties:</h4>
                    <ul>
                      {fruit.varieties.map((variety, idx) => (
                        <li key={idx}>{variety}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="description">{fruit.description}</p>

                  <div className="specifications">
                    <h4>Specifications:</h4>
                    <ul>
                      {fruit.specifications.map((spec, idx) => (
                        <li key={idx}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fruit-benefits">
            <h3>Why Choose Indian Fruits?</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h4>🌞 Tropical Climate</h4>
                <p>
                  Perfect growing conditions for exceptional taste and nutrition
                </p>
              </div>
              <div className="benefit-card">
                <h4>🌱 Natural Growing</h4>
                <p>
                  Grown using traditional methods with minimal chemical
                  intervention
                </p>
              </div>
              <div className="benefit-card">
                <h4>📅 Year-Round Supply</h4>
                <p>Different harvest seasons ensure continuous availability</p>
              </div>
              <div className="benefit-card">
                <h4>💎 Premium Quality</h4>
                <p>
                  Hand-selected fruits meeting international quality standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FreshFruits;
