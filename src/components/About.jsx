function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header">
          <h2>About Field to Feed Export</h2>
          <p>Leading Agricultural Export Company in India</p>
        </div>
        
        <div className="about-content">
          <div className="about-main">
            <div className="about-text">
              <h3>Our Story</h3>
              <p>
                Field to Feed Export is a premier agricultural export company
                based in India, specializing in the export of high-quality
                agricultural products to global markets. With over 15 years of
                experience in the industry, we have established ourselves as a
                trusted partner for international buyers seeking premium Indian
                agricultural products.
              </p>
              <p>
                Our commitment to quality, sustainability, and farmer welfare has
                made us a preferred choice for customers worldwide. We work
                directly with farmers across India to ensure the highest quality
                products while supporting rural communities.
              </p>
            </div>
            
            <div className="about-stats-container">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Partner Farmers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Countries Served</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-highlights">
            <div className="highlight">
              <div className="highlight-icon">🎯</div>
              <h4>Our Mission</h4>
              <p>
                To bridge the gap between Indian farmers and global markets
                while maintaining the highest standards of quality and
                sustainability.
              </p>
            </div>
            <div className="highlight">
              <div className="highlight-icon">👁️</div>
              <h4>Our Vision</h4>
              <p>
                To be the leading agricultural export company from India,
                recognized globally for quality, reliability, and ethical
                business practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;