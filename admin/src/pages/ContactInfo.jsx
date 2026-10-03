import { useEffect, useState } from "react";

import "./ContactInfo.css";

function ContactInfo() {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    availability: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/contact-info`
        );

        const data = await response.json();

        if (response.ok) {
          setFormData({
            heading: data.heading || "",
            description: data.description || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            availability: data.availability || "",
          });
        }
      } catch (error) {
        console.error("Contact info fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update contact information"
        );
      }

      setMessage("Contact information updated successfully!");
    } catch (error) {
      console.error("Contact info update error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="contact-info-admin">Loading...</div>;
  }

  return (
    <div className="contact-info-admin">
      <div className="contact-info-header">
        <h1>Contact Info</h1>
        <p>Manage the information shown in the Get In Touch section.</p>
      </div>

      <form
        className="contact-info-form"
        onSubmit={handleSubmit}
      >
        <button
          type="submit"
          className="contact-info-save-button"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Contact Information"}
        </button>
      </form>

      {message && (
        <div className="contact-info-success">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-info-form">
        <div className="contact-info-card">
          <h2>Contact Section</h2>

          <div className="contact-info-group">
            <label>Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="Get In Touch"
            />
          </div>

          <div className="contact-info-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Let's connect and discuss..."
            />
          </div>
        </div>

        <div className="contact-info-card">
          <h2>Contact Details</h2>

          <div className="contact-info-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="contact-info-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="contact-info-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Delhi, India"
            />
          </div>

          <div className="contact-info-group">
            <label>Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Available for opportunities"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactInfo;