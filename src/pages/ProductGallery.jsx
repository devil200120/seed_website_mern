import { useState } from "react";

function ProductGallery() {
  const [activeFilter, setActiveFilter] = useState("all");

  const galleryItems = [
    {
      id: 1,
      category: "vegetables",
      title: "Fresh Onions",
      description: "Premium quality red onions ready for export",
    },
    {
      id: 2,
      category: "fruits",
      title: "Alphonso Mangoes",
      description: "World-famous Indian mangoes at perfect ripeness",
    },
    {
      id: 3,
      category: "spices",
      title: "Turmeric Powder",
      description: "Golden turmeric with high curcumin content",
    },
    {
      id: 4,
      category: "vegetables",
      title: "Fresh Potatoes",
      description: "Farm-fresh potatoes with excellent quality",
    },
    {
      id: 5,
      category: "fruits",
      title: "Pomegranates",
      description: "Ruby-red pomegranates packed with antioxidants",
    },
    {
      id: 6,
      category: "spices",
      title: "Red Chili",
      description: "Vibrant red chilies with perfect heat balance",
    },
    {
      id: 7,
      category: "processing",
      title: "Quality Testing",
      description: "Our state-of-the-art testing laboratory",
    },
    {
      id: 8,
      category: "processing",
      title: "Packaging Unit",
      description: "Hygienic packaging facility with modern equipment",
    },
    {
      id: 9,
      category: "vegetables",
      title: "Fresh Garlic",
      description: "Aromatic garlic bulbs with extended shelf life",
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
          <h1>Product Gallery</h1>
          <p>Visual Journey Through Our Quality Products</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="gallery-filters">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Products
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "vegetables" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("vegetables")}
            >
              Vegetables
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "fruits" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("fruits")}
            >
              Fruits
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "spices" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("spices")}
            >
              Spices
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "processing" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("processing")}
            >
              Processing
            </button>
          </div>

          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-image">
                  <div className="image-placeholder">
                    {item.category === "vegetables" && "🥬"}
                    {item.category === "fruits" && "🍎"}
                    {item.category === "spices" && "🌶️"}
                    {item.category === "processing" && "🏭"}
                  </div>
                  <div className="gallery-overlay">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-info">
            <h3>Quality Documentation</h3>
            <p>
              Every product in our gallery represents our commitment to quality
              and excellence. All items undergo rigorous quality control
              processes and are documented with complete traceability from farm
              to export.
            </p>

            <div className="documentation-grid">
              <div className="doc-item">
                <h4>📸 Photo Documentation</h4>
                <p>High-resolution images of all products before packaging</p>
              </div>
              <div className="doc-item">
                <h4>📊 Quality Reports</h4>
                <p>Detailed quality analysis reports for each batch</p>
              </div>
              <div className="doc-item">
                <h4>🏷️ Batch Tracking</h4>
                <p>
                  Complete traceability with batch numbers and source details
                </p>
              </div>
              <div className="doc-item">
                <h4>📋 Certificates</h4>
                <p>Quality certificates and compliance documentation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductGallery;
