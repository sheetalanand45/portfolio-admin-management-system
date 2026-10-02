import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import "./About.css";

function About() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    education: "",
    location: "",
    email: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAbout = async () => {
    try {
      const response = await fetch("http://localhost:5000/about");
      const data = await response.json();

      if (response.ok && data) {
        setFormData({
            name: data.name || "",
            title: data.title || "",
            description: data.description || "",
            education: data.education || "",
            location: data.location || "",
            email: data.email || "",
            profileImage: data.profileImage || "",
        });
      }
    } catch (error) {
      console.error("Error fetching About data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:5000/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save About information");
        return;
      }

      alert("About information saved successfully!");

      setFormData({
        name: data.name || "",
        title: data.title || "",
        description: data.description || "",
        education: data.education || "",
        location: data.location || "",
        email: data.email || "",
        profileImage: data.profileImage || "",
      });
    } catch (error) {
      console.error("Error saving About:", error);
      alert("Unable to connect to backend.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="about-page">
        <div className="about-loading">Loading About information...</div>
      </main>
    );
  }

  const useSelectedProfileImage = () => {
    const selectedImage = localStorage.getItem("selectedProfileImage");

    if (!selectedImage) {
        alert("Please select an image from the Media page first.");
        return;
    }

    setFormData({
        ...formData,
        profileImage: selectedImage,
    });

    localStorage.removeItem("selectedProfileImage");

    alert("Profile image added to About!");
  };

  return (
    <main className="about-page">
      <div className="about-header">
        <div>
          <h1>About</h1>
          <p>Manage the information displayed in your portfolio.</p>
        </div>

        <button
          className="save-about-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="about-card">
        <div className="about-card-header">
          <div className="about-icon">
            <User size={19} />
          </div>

          <div>
            <h2>About Information</h2>
            <p>Update your personal and professional information.</p>
          </div>
        </div>

        <div className="about-form">
          <div className="about-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="about-field">
            <label>Professional Title</label>
            <input
              type="text"
              placeholder="e.g. Computer Science Engineer"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="about-field full-width">
            <label>Description</label>
            <textarea
              placeholder="Write your About description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="about-field full-width">
            <label>Education</label>
            <input
              type="text"
              placeholder="e.g. B.Tech Computer Science"
              value={formData.education}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: e.target.value,
                })
              }
            />
          </div>

          <div className="about-field">
            <label>Location</label>
            <input
                type="text"
                placeholder="e.g. India"
                value={formData.location}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    location: e.target.value,
                })
                }
            />
            </div>

            <div className="about-field">
            <label>Email</label>
            <input
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    email: e.target.value,
                })
                }
            />
          </div>

          <div className="about-field full-width">
            <label>Profile Image</label>

            <input
                type="text"
                placeholder="Paste image URL or select from Media"
                value={formData.profileImage}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    profileImage: e.target.value,
                })
                }
            />

            <button
                type="button"
                onClick={useSelectedProfileImage}
                style={{ marginTop: "10px" }}
            >
                Use Selected Media Image
            </button>

            {formData.profileImage && (
                <div style={{ marginTop: "12px" }}>
                <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    }}
                />
                </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;