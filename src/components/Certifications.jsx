function Certifications() {
  const certifications = [
    {
      name: "ISO 22000:2018",
      description: "Food Safety Management System",
      icon: "🏆",
    },
    {
      name: "HACCP",
      description: "Hazard Analysis Critical Control Points",
      icon: "✅",
    },
    {
      name: "FSSAI",
      description: "Food Safety and Standards Authority of India",
      icon: "🛡️",
    },
    {
      name: "APEDA",
      description:
        "Agricultural and Processed Food Products Export Development Authority",
      icon: "📋",
    },
    {
      name: "Global GAP",
      description: "Good Agricultural Practices Certification",
      icon: "🌱",
    },
    {
      name: "Organic Certification",
      description: "Certified Organic Products",
      icon: "🌿",
    },
  ];

  return (
    <section className="certifications" id="certifications">
      <div className="container">
        <div className="section-header">
          <h2>Certifications & Quality Assurance</h2>
          <p>Committed to International Standards and Quality</p>
        </div>
        <div className="certifications-content">
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="cert-icon">{cert.icon}</div>
                <h3>{cert.name}</h3>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
          <div className="quality-commitment">
            <h3>Our Quality Commitment</h3>
            <div className="commitment-points">
              <div className="point">
                <span className="point-icon">✓</span>
                <p>Strict adherence to international quality standards</p>
              </div>
              <div className="point">
                <span className="point-icon">✓</span>
                <p>Regular third-party audits and inspections</p>
              </div>
              <div className="point">
                <span className="point-icon">✓</span>
                <p>Comprehensive testing at state-of-the-art laboratories</p>
              </div>
              <div className="point">
                <span className="point-icon">✓</span>
                <p>Traceability from farm to export destination</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Certifications;
