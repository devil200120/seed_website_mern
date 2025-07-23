import { useState, useEffect } from 'react';

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Clean slider content - removing unnecessary elements
  const slides = [
    {
      id: 1,
      title: "One Stop Destination for",
      highlight: "SPICES",
      subtitle: "Your Trusted Partner in Premium Agricultural Exports",
      description: "Connecting Indian Farms to Global Markets with Quality, Trust and Excellence",
      image: "/src/new_image1.jpg",
      primaryBtn: "Our Products",
      secondaryBtn: "Contact Us",
      category: "Products"
    },
    {
      id: 2,
      title: "Premium Quality",
      highlight: "VEGETABLES",
      subtitle: "Fresh Farm-to-Export Vegetables",
      description: "Delivering the finest fresh vegetables from Indian farms to global markets",
      image: "/src/new_image3.jpg",
      primaryBtn: "View Vegetables",
      secondaryBtn: "Contact Us",
      category: "Vegetables"
    },
    {
      id: 3,
      title: "Exotic Indian",
      highlight: "FRUITS",
      subtitle: "Tropical & Seasonal Fruit Exports",
      description: "Experience the authentic taste of Indian fruits with guaranteed freshness",
      image: "/src/new_image2.jpg",
      primaryBtn: "Explore Fruits",
      secondaryBtn: "Contact Us",
      category: "Fruits"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length, isAutoPlay]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  return (
    <section className="hero-modern" id="home">
      <div className="hero-slider-modern" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide-modern ${index === currentSlide ? 'active' : ''}`}
          >
            {/* Background Image */}
            <div 
              className="hero-background-modern"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="hero-overlay-modern"></div>
            </div>

            {/* Clean Content Container */}
            <div className="hero-content-modern">
              <div className="container">
                <div className="hero-text-content">
                  <h1 className="hero-title-modern">
                    <span className="title-line">{slide.title}</span>
                    <span className="hero-highlight-modern">{slide.highlight}</span>
                  </h1>
                  
                  <p className="hero-subtitle-modern">{slide.subtitle}</p>
                  <p className="hero-description-modern">{slide.description}</p>

                  {/* Clean Action Buttons */}
                  <div className="hero-buttons-modern">
                    <a href="#products" className="btn-primary-modern">
                      <span className="btn-text">{slide.primaryBtn}</span>
                      
                    </a>
                    <a href="/contact" className="btn-secondary-modern">
                      <span className="btn-text">{slide.secondaryBtn}</span>
                      <span className="btn-icon">✉</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Simple Navigation */}
        
        {/* Clean Slide Indicators */}
        <div className="slider-indicators-modern">
          {slides.map((slide, index) => (
            <button
              key={index}
              className={`slider-indicator-modern ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="indicator-bg"></span>
              <span className="indicator-progress"></span>
            </button>
          ))}
        </div>

        {/* Simple Progress Bar */}
        <div className="slider-progress-modern">
          <div 
            className="slider-progress-bar-modern"
            style={{
              animationDuration: isAutoPlay ? '6s' : 'paused',
              animationPlayState: isAutoPlay ? 'running' : 'paused'
            }}
          />
        </div>

        {/* Simple Slide Counter */}
        
      </div>
    </section>
  );
}

export default Hero;