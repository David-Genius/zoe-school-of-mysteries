import "./AboutHero.css";

export default function Testimonies() {
  const testimonies = [
    {
      name: "Sarah M.",
      story:
        "I came broken and tired. Through prayer and community, God restored my peace and joy."
    },
    {
      name: "Daniel K.",
      story:
        "This church helped me rediscover my faith and purpose. I am forever grateful."
    },
    {
      name: "Grace A.",
      story:
        "I experienced healing and genuine love here. This is truly home."
    }
  ];

  return (
    <section className="testimonies">
      <h2>Stories of Transformation</h2>
      <p className="testimony-subtitle">
        Lives changed by faith, prayer, and God’s love.
      </p>

      <div className="testimony-grid">
        {testimonies.map((testimony, index) => (
          <div className="testimony-card" key={index}>
            <p className="story">“{testimony.story}”</p>
            <span className="name">— {testimony.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
