function OurTeam() {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      experience: "20+ Years",
      description:
        "Visionary leader with extensive experience in agricultural exports and international trade.",
      expertise: [
        "Strategic Planning",
        "International Markets",
        "Business Development",
      ],
    },
    {
      name: "Priya Sharma",
      position: "Head of Quality Control",
      experience: "15+ Years",
      description:
        "Expert in food safety standards and quality assurance with multiple certifications.",
      expertise: ["Quality Management", "Food Safety", "HACCP Implementation"],
    },
    {
      name: "Amit Patel",
      position: "Export Operations Manager",
      experience: "12+ Years",
      description:
        "Specialist in export documentation, logistics, and international shipping.",
      expertise: [
        "Export Documentation",
        "Logistics",
        "Supply Chain Management",
      ],
    },
    {
      name: "Sunita Reddy",
      position: "Farmer Relations Head",
      experience: "10+ Years",
      description:
        "Dedicated to building strong partnerships with farmers and ensuring fair trade practices.",
      expertise: [
        "Farmer Relations",
        "Agricultural Practices",
        "Sustainability",
      ],
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <div className="container">
          <h1>Our Team</h1>
          <p>Meet the Experts Behind Our Success</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="content-intro">
            <h2>Leadership Team</h2>
            <p>
              Our experienced team combines deep agricultural knowledge with
              international trade expertise to deliver exceptional results for
              our partners and customers worldwide.
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <span className="avatar-placeholder">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <h4>{member.position}</h4>
                  <span className="experience">
                    {member.experience} Experience
                  </span>
                  <p>{member.description}</p>
                  <div className="expertise">
                    <strong>Expertise:</strong>
                    <div className="expertise-tags">
                      {member.expertise.map((skill, idx) => (
                        <span key={idx} className="expertise-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="team-culture">
            <h3>Our Team Culture</h3>
            <div className="culture-grid">
              <div className="culture-item">
                <h4>🤝 Collaboration</h4>
                <p>
                  We work together across departments to achieve common goals
                </p>
              </div>
              <div className="culture-item">
                <h4>🎓 Continuous Learning</h4>
                <p>
                  Regular training and development programs for all team members
                </p>
              </div>
              <div className="culture-item">
                <h4>🌱 Growth Mindset</h4>
                <p>Encouraging innovation and embracing new challenges</p>
              </div>
              <div className="culture-item">
                <h4>⚖️ Work-Life Balance</h4>
                <p>Supporting our team's well-being and personal development</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OurTeam;
