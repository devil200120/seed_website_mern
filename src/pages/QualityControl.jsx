function QualityControl() {
  const qualityStandards = [
    {
      standard: "ISO 22000:2018",
      description: "Food Safety Management System",
      scope: "Complete food safety management from farm to export",
    },
    {
      standard: "HACCP",
      description: "Hazard Analysis Critical Control Points",
      scope: "Systematic preventive approach to food safety",
    },
    {
      standard: "FSSAI",
      description: "Food Safety and Standards Authority of India",
      scope: "Compliance with Indian food safety regulations",
    },
    {
      standard: "Global GAP",
      description: "Good Agricultural Practices",
      scope: "Sustainable farming and safe agricultural practices",
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Quality Control</h1>
          <p>Ensuring Excellence at Every Step</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Our Quality Commitment</h2>
            <p>
              We maintain the highest quality standards through rigorous
              testing, international certifications, and comprehensive quality
              management systems that ensure product excellence from farm to
              destination.
            </p>
          </div>

          <div className="quality-testing">
            <h3>Testing Procedures</h3>
            <div className="testing-grid">
              <div className="testing-card">
                <h4>🔬 Laboratory Testing</h4>
                <ul>
                  <li>Pesticide residue analysis</li>
                  <li>Microbiological testing</li>
                  <li>Nutritional analysis</li>
                  <li>Heavy metals detection</li>
                </ul>
              </div>
              <div className="testing-card">
                <h4>👁️ Visual Inspection</h4>
                <ul>
                  <li>Size and color grading</li>
                  <li>Defect identification</li>
                  <li>Packaging integrity</li>
                  <li>Label verification</li>
                </ul>
              </div>
              <div className="testing-card">
                <h4>📊 Documentation</h4>
                <ul>
                  <li>Certificate of analysis</li>
                  <li>Traceability records</li>
                  <li>Quality reports</li>
                  <li>Compliance certificates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="quality-standards-section">
            <h3>International Standards</h3>
            <div className="standards-grid">
              {qualityStandards.map((standard, index) => (
                <div key={index} className="standard-card">
                  <h4>{standard.standard}</h4>
                  <p className="standard-desc">{standard.description}</p>
                  <p className="standard-scope">{standard.scope}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="quality-facilities">
            <h3>Our Facilities</h3>
            <div className="facilities-grid">
              <div className="facility-item">
                <h4>🏭 Processing Plant</h4>
                <p>
                  State-of-the-art facility with modern equipment and clean room
                  technology
                </p>
              </div>
              <div className="facility-item">
                <h4>🧪 Testing Laboratory</h4>
                <p>
                  In-house NABL accredited laboratory with latest testing
                  equipment
                </p>
              </div>
              <div className="facility-item">
                <h4>❄️ Cold Storage</h4>
                <p>
                  Temperature-controlled storage facilities maintaining optimal
                  conditions
                </p>
              </div>
              <div className="facility-item">
                <h4>📦 Packaging Unit</h4>
                <p>
                  Automated packaging systems ensuring hygiene and product
                  integrity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default QualityControl;
