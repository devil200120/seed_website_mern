function AboutUs() {
  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>About Field to Feed Export</h1>
          <p>Leading Agricultural Export Company in India</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-grid">
            <div className="content-main">
              <h2>Our Story</h2>
              <p>
                Field to Feed Export is a premier agricultural export company
                based in India, specializing in the export of high-quality
                agricultural products to global markets. With over 15 years of
                experience in the industry, we have established ourselves as a
                trusted partner for international buyers seeking premium Indian
                agricultural products.
              </p>

              <h3>Our Journey</h3>
              <p>
                Founded in 2009, our company started with a simple vision: to
                bridge the gap between Indian farmers and global markets. Over
                the years, we have grown from a small local business to a
                leading export company, serving customers in over 50 countries
                worldwide.
              </p>

              <h3>What Sets Us Apart</h3>
              <ul className="feature-list">
                <li>Direct partnerships with over 500 farmers across India</li>
                <li>State-of-the-art quality control and testing facilities</li>
                <li>
                  Comprehensive export documentation and compliance support
                </li>
                <li>Sustainable and ethical business practices</li>
                <li>24/7 customer support and after-sales service</li>
              </ul>

              <h3>Our Commitment</h3>
              <p>
                We are committed to delivering the finest quality agricultural
                products while supporting rural communities and promoting
                sustainable farming practices. Our success is built on trust,
                quality, and long-term relationships with both farmers and
                customers.
              </p>
            </div>

            <div className="content-sidebar">
              <div className="stats-card">
                <h3>Company Stats</h3>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Partner Farmers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Countries Served</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Happy Clients</span>
                </div>
              </div>

              <div className="cta-card">
                <h3>Ready to Partner?</h3>
                <p>
                  Contact us today to discuss your agricultural export
                  requirements.
                </p>
                <a href="/contact" className="btn-primary">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
