import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Briefcase } from "lucide-react";
import "./Experience.css";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const fetchExperiences = async () => {
    try {
      const response = await fetch("http://localhost:5000/experience");
      const data = await response.json();

      if (response.ok) {
        setExperiences(data);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSaveExperience = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const url = editingExperience
        ? `http://localhost:5000/experience/${editingExperience._id}`
        : "http://localhost:5000/experience";

      const method = editingExperience ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save experience");
        return;
      }

      alert(
        editingExperience
          ? "Experience updated successfully!"
          : "Experience added successfully!"
      );

      setFormData({
        title: "",
        organization: "",
        description: "",
        startDate: "",
        endDate: "",
      });

      setEditingExperience(null);
      setShowForm(false);
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);

    setFormData({
      title: experience.title || "",
      organization: experience.organization || "",
      description: experience.description || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/experience/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete experience");
        return;
      }

      alert("Experience deleted successfully!");
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExperience(null);

    setFormData({
      title: "",
      organization: "",
      description: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <main className="experience-page">
      <div className="experience-header">
        <div>
          <h1>Experience</h1>
          <p>Manage your professional journey and experience.</p>
        </div>

        <button
          className="add-experience-btn"
          onClick={() => {
            setEditingExperience(null);

            setFormData({
              title: "",
              organization: "",
              description: "",
              startDate: "",
              endDate: "",
            });

            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Experience
        </button>
      </div>

      {showForm && (
        <div className="experience-form-card">
          <div className="experience-form-header">
            <div>
              <h2>
                {editingExperience
                  ? "Edit Experience"
                  : "Add New Experience"}
              </h2>

              <p>
                {editingExperience
                  ? "Update your experience details."
                  : "Add a new entry to your professional journey."}
              </p>
            </div>

            <button
              className="close-experience-btn"
              onClick={handleCancel}
            >
              <X size={18} />
            </button>
          </div>

          <div className="experience-form">
            <div className="experience-field">
              <label>Title</label>

              <input
                type="text"
                placeholder="e.g. Software Development Intern"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="experience-field">
              <label>Organization</label>

              <input
                type="text"
                placeholder="e.g. Company or Organization"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: e.target.value,
                  })
                }
              />
            </div>

            <div className="experience-field">
              <label>Start Date</label>

              <input
                type="text"
                placeholder="e.g. June 2026"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="experience-field">
              <label>End Date</label>

              <input
                type="text"
                placeholder="e.g. Present"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="experience-field full-width">
              <label>Description</label>

              <textarea
                placeholder="Describe your role, responsibilities, or learning."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="experience-form-actions">
            <button
              className="cancel-experience-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-experience-btn"
              onClick={handleSaveExperience}
            >
              {editingExperience ? "Update Experience" : "Save Experience"}
            </button>
          </div>
        </div>
      )}

      <div className="experience-card">
        <div className="experience-card-header">
          <div className="experience-icon">
            <Briefcase size={19} />
          </div>

          <div>
            <h2>Professional Journey</h2>
            <p>View and manage your experience entries.</p>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="empty-experience">
            <Briefcase size={40} />

            <h3>No experience added yet</h3>

            <p>
              Add your first experience entry to get started.
            </p>
          </div>
        ) : (
          <div className="experience-list">
            {experiences.map((experience) => (
              <div
                className="experience-item"
                key={experience._id}
              >
                <div className="experience-item-info">
                  <div className="experience-title-row">
                    <h3>{experience.title}</h3>

                    <span>
                      {experience.startDate}
                      {experience.endDate
                        ? ` — ${experience.endDate}`
                        : ""}
                    </span>
                  </div>

                  <h4>{experience.organization}</h4>

                  <p>{experience.description}</p>
                </div>

                <div className="experience-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(experience)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(experience._id)
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Experience;