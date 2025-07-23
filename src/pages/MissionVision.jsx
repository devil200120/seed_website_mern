function MissionVision() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Mission & Vision</h1>
          <p>Our Purpose and Direction</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>
                To bridge the gap between Indian farmers and global markets by
                providing premium quality agricultural products while ensuring
                fair trade practices, sustainable farming methods, and
                exceptional customer service. We are committed to supporting
                rural communities and promoting ethical business practices
                throughout our supply chain.
              </p>

              <h3>How We Achieve Our Mission:</h3>
              <ul className="mission-points">
                <li>
                  Direct partnerships with farmers ensuring fair compensation
                </li>
                <li>Rigorous quality control at every stage of production</li>
                <li>
                  Sustainable and environmentally friendly farming practices
                </li>
                <li>Transparent and ethical business operations</li>
                <li>Continuous investment in technology and infrastructure</li>
              </ul>
            </div>

            <div className="vision-card">
              <div className="card-icon">🌟</div>
              <h2>Our Vision</h2>
              <p>
                To be the leading agricultural export company from India,
                recognized globally for our commitment to quality,
                sustainability, and innovation. We envision a future where
                Indian agricultural products are synonymous with excellence in
                international markets, while our farming communities thrive
                through fair and sustainable partnerships.
              </p>

              <h3>Our Vision Goals:</h3>
              <ul className="vision-points">
                <li>Global leadership in agricultural exports from India</li>
                <li>Recognition as the most trusted export partner</li>
                <li>Zero-waste and carbon-neutral operations by 2030</li>
                <li>Empowerment of 1000+ farming families</li>
                <li>Expansion to 100+ countries worldwide</li>
              </ul>
            </div>
          </div>

          <div className="values-section">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <h3>🤝 Integrity</h3>
                <p>
                  We conduct business with honesty, transparency, and ethical
                  practices
                </p>
              </div>
              <div className="value-item">
                <h3>🌱 Sustainability</h3>
                <p>
                  We promote environmentally responsible farming and business
                  practices
                </p>
              </div>
              <div className="value-item">
                <h3>⭐ Excellence</h3>
                <p>We strive for the highest quality in everything we do</p>
              </div>
              <div className="value-item">
                <h3>💡 Innovation</h3>
                <p>
                  We embrace technology and new methods to improve our services
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MissionVision;
