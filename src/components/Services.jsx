function Services() {
  const services = [
    {
      icon: "🌾",
      title: "Product Sourcing",
      description:
        "Direct sourcing from verified farmers across India ensuring freshness and quality",
    },
    {
      icon: "🔍",
      title: "Quality Control",
      description:
        "Rigorous quality testing and inspection at every stage of the supply chain",
    },
    {
      icon: "📋",
      title: "Export Documentation",
      description:
        "Complete documentation support including certificates, permits, and compliance",
    },
    {
      icon: "📦",
      title: "Custom Packaging",
      description:
        "Tailored packaging solutions to meet specific customer requirements",
    },
    {
      icon: "🚚",
      title: "Logistics & Shipping",
      description:
        "End-to-end logistics solutions with reliable shipping partners worldwide",
    },
    {
      icon: "💼",
      title: "Trade Consultation",
      description:
        "Expert guidance on international trade regulations and market requirements",
    },
    {
      icon: "🏪",
      title: "Private Labeling",
      description:
        "Custom branding and private label solutions for your products",
    },
    {
      icon: "📊",
      title: "Market Intelligence",
      description:
        "Regular market updates and price intelligence for informed decision making",
    },
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive Export Solutions for Your Business</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
        <div className="services-process">
          <h3>Our Export Process</h3>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Order Confirmation</h4>
              <p>Receive and confirm your product requirements</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Quality Sourcing</h4>
              <p>Source products from verified suppliers</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Quality Testing</h4>
              <p>Rigorous quality control and testing</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Documentation</h4>
              <p>Complete export documentation</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h4>Shipping</h4>
              <p>Safe and timely delivery worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
