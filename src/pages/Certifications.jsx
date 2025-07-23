function Certifications() {
  const certifications = [
    {
      icon: "🏆",
      title: "ISO 22000:2018",
      description: "Food Safety Management System",
      details: "Internationally recognized standard for food safety management",
    },
    {
      icon: "✅",
      title: "HACCP Certified",
      description: "Hazard Analysis Critical Control Points",
      details:
        "Systematic approach to identify and control food safety hazards",
    },
    {
      icon: "🇮🇳",
      title: "FSSAI Licensed",
      description: "Food Safety and Standards Authority of India",
      details: "Compliance with Indian food safety regulations",
    },
    {
      icon: "🌱",
      title: "Global GAP",
      description: "Good Agricultural Practices",
      details:
        "Sustainable farming and safe agricultural practices certification",
    },
    {
      icon: "🌍",
      title: "Organic Certified",
      description: "Organic Product Certification",
      details: "Certified organic products meeting international standards",
    },
    {
      icon: "📋",
      title: "Export License",
      description: "Government Export Authorization",
      details: "Valid export license for agricultural products",
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Certifications & Quality</h1>
          <p>Committed to International Quality Standards</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Quality Assurance & Certifications</h2>
            <p>
              Our commitment to quality is demonstrated through various
              international certifications and compliance standards. We
              continuously upgrade our processes to meet evolving quality
              requirements and maintain the highest standards.
            </p>
          </div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="cert-icon">{cert.icon}</div>
                <h3>{cert.title}</h3>
                <p className="cert-description">{cert.description}</p>
                <p className="cert-details">{cert.details}</p>
              </div>
            ))}
          </div>

          <div className="quality-commitment">
            <h3>Our Quality Commitment</h3>
            <div className="commitment-points">
              <div className="point">
                <div className="point-icon">✓</div>
                <p>
                  Regular third-party audits and inspections to ensure
                  compliance
                </p>
              </div>
              <div className="point">
                <div className="point-icon">✓</div>
                <p>Continuous training of our quality control team</p>
              </div>
              <div className="point">
                <div className="point-icon">✓</div>
                <p>Investment in latest testing equipment and technologies</p>
              </div>
              <div className="point">
                <div className="point-icon">✓</div>
                <p>Comprehensive documentation and traceability systems</p>
              </div>
              <div className="point">
                <div className="point-icon">✓</div>
                <p>Zero tolerance policy for quality compromise</p>
              </div>
              <div className="point">
                <div className="point-icon">✓</div>
                <p>Customer satisfaction through consistent quality delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Certifications;
