import { useState, useEffect } from 'react';

function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredImages, setFilteredImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const galleryImages = [
    { 
      category: "Products", 
      image: "/images/istockphoto-637719416-612x612.jpg", 
      title: "Premium Spices Collection",
      description: "Hand-picked aromatic spices from the finest farms",
      tags: ["Organic", "Export Quality"]
    },
    { 
      category: "Products", 
      image: "/images/istockphoto-1126541751-612x612.jpg", 
      title: "Fresh Vegetables",
      description: "Farm-fresh vegetables ready for global export",
      tags: ["Fresh", "Nutritious"]
    },
    { 
      category: "Products", 
      image: "/images/photo-1457530378978-8bac673b8062.jpg", 
      title: "Exotic Fruits",
      description: "Tropical and seasonal fruits with guaranteed freshness",
      tags: ["Tropical", "Seasonal"]
    },
    { 
      category: "Facility", 
      image: "/images/istockphoto-637719416-612x612.jpg", 
      title: "Processing Unit",
      description: "State-of-the-art processing facility with modern equipment",
      tags: ["Modern", "Certified"]
    },
    { 
      category: "Facility", 
      image: "/images/istockphoto-1126541751-612x612.jpg", 
      title: "Quality Control Lab",
      description: "Advanced testing and quality assurance laboratory",
      tags: ["Testing", "Quality"]
    },
    { 
      category: "Facility", 
      image: "/images/photo-1457530378978-8bac673b8062.jpg", 
      title: "Packaging Center",
      description: "Automated packaging with international standards",
      tags: ["Automated", "Standards"]
    },
    { 
      category: "Team", 
      image: "/images/istockphoto-637719416-612x612.jpg", 
      title: "Expert Team",
      description: "Dedicated professionals ensuring quality at every step",
      tags: ["Professional", "Experienced"]
    },
    { 
      category: "Team", 
      image: "/images/istockphoto-1126541751-612x612.jpg", 
      title: "Farmer Partnership",
      description: "Strong partnerships with local farming communities",
      tags: ["Partnership", "Community"]
    },
    { 
      category: "Team", 
      image: "/images/photo-1457530378978-8bac673b8062.jpg", 
      title: "Quality Inspectors",
      description: "Expert quality inspectors ensuring premium standards",
      tags: ["Inspection", "Premium"]
    }
  ];

  const categories = ['All', 'Products', 'Facility', 'Team'];

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === activeFilter));
    }
  }, [activeFilter]);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
  };

  const openLightbox = (image) => {
    setCurrentImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img === currentImage);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = filteredImages.findIndex(img => img === currentImage);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImage(filteredImages[prevIndex]);
  };

  return (
    <section className="gallery-modern" id="gallery">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-modern">
          <span className="section-badge">Gallery</span>
          <h2>Visual Journey</h2>
          <p>Explore our world-class facilities, premium products, and dedicated team</p>
        </div>

        {/* Filter Tabs */}
        <div className="gallery-filters-modern">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-tab ${activeFilter === category ? 'active' : ''}`}
              onClick={() => handleFilterChange(category)}
            >
              <span className="filter-text">{category}</span>
              <span className="filter-count">
                {category === 'All' ? galleryImages.length : galleryImages.filter(img => img.category === category).length}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid-modern">
          {filteredImages.map((item, index) => (
            <div
              key={index}
              className="gallery-card"
              onClick={() => openLightbox(item)}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="gallery-image-container">
                <img src={item.image} alt={item.title} className="gallery-img" />
                <div className="gallery-overlay-modern">
                  <div className="gallery-content">
                    <div className="gallery-tags">
                      {item.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="gallery-tag">{tag}</span>
                      ))}
                    </div>
                    <h3 className="gallery-title">{item.title}</h3>
                    <p className="gallery-description">{item.description}</p>
                    <div className="gallery-category-badge">{item.category}</div>
                  </div>
                  <div className="gallery-action">
                    <button className="view-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 3L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className="lightbox-image-container">
              <img src={currentImage.image} alt={currentImage.title} className="lightbox-image" />
            </div>
            
            <div className="lightbox-info">
              <div className="lightbox-tags">
                {currentImage.tags.map((tag, index) => (
                  <span key={index} className="lightbox-tag">{tag}</span>
                ))}
              </div>
              <h3 className="lightbox-title">{currentImage.title}</h3>
              <p className="lightbox-description">{currentImage.description}</p>
              <span className="lightbox-category">{currentImage.category}</span>
            </div>

            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="lightbox-nav lightbox-next" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
