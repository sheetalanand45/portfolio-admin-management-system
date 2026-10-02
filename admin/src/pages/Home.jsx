import { useEffect, useState } from "react";

import "./Home.css";

function Home() {
  const [formData, setFormData] = useState({
    greeting: "",
    name: "",
    headline: "",
    description: "",
    primaryButtonText: "",
    secondaryButtonText: "",
    githubUrl: "",
    linkedinUrl: "",
    email: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch("http://localhost:5000/home");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch Home content");
        }

        setFormData({
          greeting: data.greeting || "",
          name: data.name || "",
          headline: data.headline || "",
          description: data.description || "",
          primaryButtonText: data.primaryButtonText || "",
          secondaryButtonText: data.secondaryButtonText || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          email: data.email || "",
          profileImage: data.profileImage || "",
        });
      } catch (error) {
        console.error("Home fetch error:", error);
        setError("Unable to load Home content.");
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);

      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:5000/home", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Home");
      }

      setFormData({
        ...data.data,
        profileImage: data.data.profileImage || "",
      });

      setMessage("Home content updated successfully.");
    } catch (error) {
      console.error("Home update error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="home-admin">
        <p>Loading Home content...</p>
      </main>
    );
  }

  return (
    <main className="home-admin">
      <div className="home-admin-header">
        <div>
          <h1>Home</h1>
          <p>Manage the content displayed on your portfolio homepage.</p>
        </div>
      </div>

      <form className="home-form" onSubmit={handleSubmit}>
        <section className="home-form-card">
          <h2>Hero Section</h2>

          <div className="form-group">
            <label>Greeting</label>
            <input
              type="text"
              name="greeting"
              value={formData.greeting}
              onChange={handleChange}
              placeholder="Hello, I'm"
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Computer Science Engineer & Full Stack Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Introduction</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short introduction..."
              rows="5"
              required
            />
          </div>
        </section>

        <section className="home-form-card">
          <h2>Buttons</h2>

          <div className="form-group">
            <label>Primary Button Text</label>
            <input
              type="text"
              name="primaryButtonText"
              value={formData.primaryButtonText}
              onChange={handleChange}
              placeholder="View My Projects"
            />
          </div>

          <div className="form-group">
            <label>Secondary Button Text</label>
            <input
              type="text"
              name="secondaryButtonText"
              value={formData.secondaryButtonText}
              onChange={handleChange}
              placeholder="Contact Me"
            />
          </div>
        </section>

        <section className="home-form-card">
          <h2>Social Links</h2>

          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
        </section>

        <section className="home-form-card">
            <h2>Home Image</h2>

            <div className="form-group">
                <label>Home Image URL</label>

                <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="Select an image from Media"
                />
            </div>

            <button
                type="button"
                className="home-media-button"
                onClick={() => {
                const selectedImage = localStorage.getItem("selectedHomeImage");

                if (!selectedImage) {
                    alert("Please select an image from the Media page first.");
                    return;
                }

                setFormData({
                    ...formData,
                    profileImage: selectedImage,
                });

                localStorage.removeItem("selectedHomeImage");

                alert("Home image added successfully!");
                }}
            >
                Use Selected Media Image
            </button>

            {formData.profileImage && (
                <div className="home-image-preview-container">
                <p>Preview</p>

                <img
                    src={formData.profileImage}
                    alt="Home preview"
                    className="home-profile-preview"
                />
                </div>
            )}
        </section>

        {error && <p className="home-error">{error}</p>}

        {message && <p className="home-success">{message}</p>}

        <button
          type="submit"
          className="home-save-button"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Home Content"}
        </button>
      </form>
    </main>
  );
}

export default Home;