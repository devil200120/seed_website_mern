import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      icon: "🌾",
      title: "Product Sourcing",
      description:
        "Direct sourcing from verified farmers across India ensuring freshness and quality",
      link: "/services/product-sourcing",
    },
    {
      icon: "🔍",
      title: "Quality Control",
      description:
        "Rigorous quality testing and inspection at every stage of the supply chain",
      link: "/services/quality-control",
    },
    {
      icon: "📋",
      title: "Export Documentation",
      description:
        "Complete documentation support including certificates, permits, and compliance",
      link: "/services",
    },
    {
      icon: "📦",
      title: "Custom Packaging",
      description:
        "Tailored packaging solutions to meet specific customer requirements",
      link: "/services",
    },
    {
      icon: "🚚",
      title: "Logistics & Shipping",
      description:
        "End-to-end logistics solutions with reliable shipping partners worldwide",
      link: "/services",
    },
    {
      icon: "💼",
      title: "Trade Consultation",
      description:
        "Expert guidance on international trade regulations and market requirements",
      link: "/services",
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive Export Solutions for Your Business</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="services-overview">
            <h2>End-to-End Agricultural Export Services</h2>
            <p>
              We provide a complete range of services to facilitate smooth and
              efficient agricultural exports from India to global markets. Our
              experienced team handles every aspect of the export process.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <Link key={index} to={service.link} className="service-card-link">
                <div className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="learn-more">Learn More →</span>
                </div>
              </Link>
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
    </div>
  );
}

export default Services;
