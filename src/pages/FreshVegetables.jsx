function FreshVegetables() {
  const vegetables = [
    {
      name: "Premium Onions",
      varieties: ["Red Onions", "White Onions", "Shallots"],
      season: "October - March",
      description:
        "Fresh, crisp onions sourced from the best farms in Maharashtra and Karnataka",
      specifications: [
        "Size: 40-70mm",
        "Moisture: 86-88%",
        "Shelf Life: 3-4 months",
      ],
    },
    {
      name: "Fresh Potatoes",
      varieties: ["Jyoti", "Kufri Chandramukhi", "Kufri Pukhraj"],
      season: "January - May",
      description:
        "High-quality potatoes with excellent taste and long shelf life",
      specifications: [
        "Size: 45-75mm",
        "Dry Matter: 20-24%",
        "Shelf Life: 6-8 months",
      ],
    },
    {
      name: "Ripe Tomatoes",
      varieties: ["Hybrid Tomatoes", "Cherry Tomatoes", "Roma Tomatoes"],
      season: "November - April",
      description:
        "Juicy, fresh tomatoes perfect for both fresh consumption and processing",
      specifications: ["Size: 50-80mm", "Brix: 4-6%", "Shelf Life: 2-3 weeks"],
    },
    {
      name: "Fresh Garlic",
      varieties: ["White Garlic", "Purple Garlic"],
      season: "March - June",
      description:
        "Aromatic, high-quality garlic with strong flavor and extended shelf life",
      specifications: [
        "Size: 45-65mm",
        "Moisture: 65-70%",
        "Shelf Life: 8-10 months",
      ],
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Fresh Vegetables</h1>
          <p>Premium Quality Vegetables for Global Markets</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Farm Fresh Vegetables</h2>
            <p>
              Our fresh vegetables are sourced directly from certified farms
              across India, ensuring the highest quality, freshness, and
              nutritional value. We maintain strict quality control measures and
              proper cold chain logistics to deliver vegetables that meet
              international standards.
            </p>
          </div>

          <div className="products-showcase">
            {vegetables.map((vegetable, index) => (
              <div key={index} className="product-showcase-card">
                <div className="product-header">
                  <h3>{vegetable.name}</h3>
                  <span className="season-badge">
                    Season: {vegetable.season}
                  </span>
                </div>

                <div className="product-details">
                  <div className="varieties">
                    <h4>Available Varieties:</h4>
                    <ul>
                      {vegetable.varieties.map((variety, idx) => (
                        <li key={idx}>{variety}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="description">{vegetable.description}</p>

                  <div className="specifications">
                    <h4>Specifications:</h4>
                    <ul>
                      {vegetable.specifications.map((spec, idx) => (
                        <li key={idx}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="quality-assurance">
            <h3>Quality Assurance</h3>
            <div className="quality-grid">
              <div className="quality-item">
                <h4>🌱 Farm Selection</h4>
                <p>
                  We work only with certified farms that follow good
                  agricultural practices
                </p>
              </div>
              <div className="quality-item">
                <h4>🔬 Testing</h4>
                <p>
                  All vegetables undergo pesticide residue and quality testing
                </p>
              </div>
              <div className="quality-item">
                <h4>❄️ Cold Chain</h4>
                <p>Maintained temperature control from farm to destination</p>
              </div>
              <div className="quality-item">
                <h4>📦 Packaging</h4>
                <p>
                  Proper packaging to ensure freshness during transportation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FreshVegetables;
