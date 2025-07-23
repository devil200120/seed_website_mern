function SpicesHerbs() {
  const spices = [
    {
      name: "Premium Turmeric",
      varieties: ["Curcuma Longa", "Salem Turmeric", "Erode Turmeric"],
      description:
        "Golden turmeric with high curcumin content and vibrant color",
      specifications: ["Curcumin: 3-7%", "Moisture: Max 10%", "Purity: 99%+"],
    },
    {
      name: "Red Chili Powder",
      varieties: ["Kashmiri Chili", "Guntur Chili", "Bydagi Chili"],
      description: "Aromatic red chilies with perfect heat and color balance",
      specifications: [
        "ASTA Color: 120-180",
        "Capsaicin: 0.4-1.2%",
        "Moisture: Max 11%",
      ],
    },
    {
      name: "Whole Coriander",
      varieties: ["Eagle Type", "Scooter Type", "Split Type"],
      description: "Premium coriander seeds with rich aroma and flavor",
      specifications: [
        "Oil Content: 0.8-1.2%",
        "Test Weight: 8-12g",
        "Purity: 99%+",
      ],
    },
    {
      name: "Black Pepper",
      varieties: ["Malabar Black", "Tellicherry", "Wayanad Special"],
      description: "The king of spices with intense flavor and aroma",
      specifications: [
        "Piperine: 5-9%",
        "Moisture: Max 12%",
        "Bulk Density: 500-600g/L",
      ],
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Spices & Herbs</h1>
          <p>The Heart of Indian Cuisine</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Authentic Indian Spices</h2>
            <p>
              India is the spice capital of the world, and our premium spices
              represent the finest quality that Indian soil can produce. Each
              spice is carefully sourced, processed, and tested to ensure
              maximum flavor, aroma, and nutritional value.
            </p>
          </div>

          <div className="products-showcase">
            {spices.map((spice, index) => (
              <div key={index} className="product-showcase-card spice-card">
                <div className="product-header">
                  <h3>{spice.name}</h3>
                  <span className="quality-badge">Premium Grade</span>
                </div>

                <div className="product-details">
                  <div className="varieties">
                    <h4>Available Types:</h4>
                    <ul>
                      {spice.varieties.map((variety, idx) => (
                        <li key={idx}>{variety}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="description">{spice.description}</p>

                  <div className="specifications">
                    <h4>Quality Parameters:</h4>
                    <ul>
                      {spice.specifications.map((spec, idx) => (
                        <li key={idx}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="spice-processing">
            <h3>Our Processing Standards</h3>
            <div className="processing-grid">
              <div className="processing-step">
                <h4>🌾 Source Selection</h4>
                <p>
                  Careful selection from certified farms in prime growing
                  regions
                </p>
              </div>
              <div className="processing-step">
                <h4>🧹 Cleaning & Sorting</h4>
                <p>Advanced cleaning and sorting to remove impurities</p>
              </div>
              <div className="processing-step">
                <h4>🌡️ Heat Treatment</h4>
                <p>Steam sterilization to eliminate microbial contamination</p>
              </div>
              <div className="processing-step">
                <h4>🔬 Quality Testing</h4>
                <p>
                  Comprehensive testing for purity, moisture, and chemical
                  residues
                </p>
              </div>
              <div className="processing-step">
                <h4>📦 Hygienic Packaging</h4>
                <p>Food-grade packaging in controlled environment</p>
              </div>
              <div className="processing-step">
                <h4>📋 Documentation</h4>
                <p>Complete traceability and quality certificates</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SpicesHerbs;
