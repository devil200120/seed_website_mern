function ProductSourcing() {
  const sourcingSteps = [
    {
      step: "1",
      title: "Farmer Network",
      description:
        "We maintain partnerships with over 500 verified farmers across India",
      details: [
        "Direct farmer relationships",
        "Quality training programs",
        "Fair pricing policies",
      ],
    },
    {
      step: "2",
      title: "Quality Selection",
      description:
        "Rigorous selection process ensuring only the finest products",
      details: [
        "Pre-harvest inspection",
        "Quality grading",
        "Organic certification verification",
      ],
    },
    {
      step: "3",
      title: "Harvest Management",
      description: "Optimal timing and proper handling during harvest season",
      details: [
        "Harvest scheduling",
        "Post-harvest handling",
        "Initial quality testing",
      ],
    },
    {
      step: "4",
      title: "Supply Chain",
      description:
        "Efficient collection and transportation to processing facilities",
      details: [
        "Cold chain logistics",
        "Traceability systems",
        "Quality preservation",
      ],
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Product Sourcing</h1>
          <p>Direct from Farm to Global Markets</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Our Sourcing Excellence</h2>
            <p>
              We source premium agricultural products directly from certified
              farms across India, ensuring the highest quality standards while
              supporting rural communities through fair trade practices.
            </p>
          </div>

          <div className="sourcing-process">
            <h3>Our Sourcing Process</h3>
            <div className="process-grid">
              {sourcingSteps.map((item, index) => (
                <div key={index} className="process-card">
                  <div className="process-number">{item.step}</div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <ul className="process-details">
                    {item.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="sourcing-regions">
            <h3>Sourcing Regions</h3>
            <div className="regions-grid">
              <div className="region-card">
                <h4>🌾 North India</h4>
                <p>
                  <strong>States:</strong> Punjab, Haryana, Uttar Pradesh
                </p>
                <p>
                  <strong>Specialties:</strong> Wheat, Rice, Mustard Seeds
                </p>
              </div>
              <div className="region-card">
                <h4>🌶️ West India</h4>
                <p>
                  <strong>States:</strong> Maharashtra, Gujarat, Rajasthan
                </p>
                <p>
                  <strong>Specialties:</strong> Onions, Spices, Cotton
                </p>
              </div>
              <div className="region-card">
                <h4>🥭 South India</h4>
                <p>
                  <strong>States:</strong> Karnataka, Tamil Nadu, Andhra Pradesh
                </p>
                <p>
                  <strong>Specialties:</strong> Fruits, Pulses, Coconut
                </p>
              </div>
              <div className="region-card">
                <h4>🌿 East India</h4>
                <p>
                  <strong>States:</strong> West Bengal, Odisha, Assam
                </p>
                <p>
                  <strong>Specialties:</strong> Rice, Tea, Vegetables
                </p>
              </div>
            </div>
          </div>

          <div className="farmer-partnership">
            <h3>Farmer Partnership Program</h3>
            <div className="partnership-benefits">
              <div className="benefit-item">
                <h4>💰 Fair Pricing</h4>
                <p>
                  Guaranteed fair prices above market rates for quality produce
                </p>
              </div>
              <div className="benefit-item">
                <h4>📚 Training Support</h4>
                <p>
                  Regular training on modern farming techniques and quality
                  standards
                </p>
              </div>
              <div className="benefit-item">
                <h4>🌱 Sustainable Practices</h4>
                <p>Support for organic and sustainable farming methods</p>
              </div>
              <div className="benefit-item">
                <h4>🤝 Long-term Contracts</h4>
                <p>Multi-year agreements providing stability and security</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductSourcing;
