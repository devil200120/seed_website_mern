import { useState } from "react";
import { Link } from "react-router-dom";

function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");

  const galleryItems = [
    {
      id: 1,
      category: "products",
      title: "Premium Spices Collection",
      description: "Our finest spices ready for export",
    },
    {
      id: 2,
      category: "facility",
      title: "Modern Processing Unit",
      description: "State-of-the-art processing facility",
    },
    {
      id: 3,
      category: "products",
      title: "Fresh Vegetables",
      description: "Farm-fresh vegetables quality inspection",
    },
    {
      id: 4,
      category: "team",
      title: "Quality Control Team",
      description: "Our experts ensuring quality standards",
    },
    {
      id: 5,
      category: "products",
      title: "Exotic Fruits",
      description: "Premium quality fruits for international markets",
    },
    {
      id: 6,
      category: "facility",
      title: "Cold Storage Facility",
      description: "Temperature-controlled storage systems",
    },
    {
      id: 7,
      category: "export",
      title: "Export Documentation",
      description: "Comprehensive export paperwork process",
    },
    {
      id: 8,
      category: "export",
      title: "Container Loading",
      description: "Professional packaging and loading operations",
    },
    {
      id: 9,
      category: "team",
      title: "Farmer Partnership",
      description: "Working directly with local farmers",
    },
  ];

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Gallery</h1>
          <p>Visual Stories of Quality and Excellence</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="gallery-filters">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "products" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("products")}
            >
              Products
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "facility" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("facility")}
            >
              Facilities
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "team" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("team")}
            >
              Our Team
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "export" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("export")}
            >
              Export Process
            </button>
          </div>

          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image">
                  <div className="image-placeholder">
                    {item.category === "products" && "📦"}
                    {item.category === "facility" && "🏭"}
                    {item.category === "team" && "👥"}
                    {item.category === "export" && "🚢"}
                  </div>
                  <div className="gallery-overlay">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-cta">
            <h3>Want to See More?</h3>
            <p>
              Visit our specialized product gallery for detailed images of our
              product range and quality standards.
            </p>
            <Link to="/gallery/products" className="btn-primary">
              View Product Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;
