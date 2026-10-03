import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Code2 } from "lucide-react";
import "./Skills.css";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "",
  });

  const [editingSkill, setEditingSkill] = useState(null);

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skills`
      );
      const data = await response.json();

      if (response.ok) {
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSaveSkill = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const url = editingSkill
        ? `${import.meta.env.VITE_API_URL}/skills/${editingSkill._id}`
        : `${import.meta.env.VITE_API_URL}/skills`;

      const method = editingSkill ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          level: formData.level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save skill");
        return;
      }

      alert(
        editingSkill
          ? "Skill updated successfully!"
          : "Skill added successfully!"
      );

      setFormData({
        name: "",
        category: "",
        level: "",
      });

      setEditingSkill(null);
      setShowForm(false);

      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleDeleteSkill = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skills/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete skill");
        return;
      }

      alert("Skill deleted successfully!");

      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <main className="skills-page">
      <div className="skills-header">
        <div>
          <h1>Skills</h1>
          <p>Manage the skills displayed on your portfolio.</p>
        </div>

        <button
          className="add-skill-btn"
          onClick={() => {
            setEditingSkill(null);
            setFormData({
              name: "",
              category: "",
              level: "",
            });
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Skill
        </button>
      </div>

      <div className="skills-card">
        {showForm && (
          <div className="skill-form">
            <h2>
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h2>

            <input
              type="text"
              placeholder="Skill name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Category (e.g. Frontend)"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Level (e.g. Intermediate)"
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value,
                })
              }
            />

            <div className="skill-form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSkill(null);
                }}
              >
                Cancel
              </button>

              <button type="button" onClick={handleSaveSkill}>
                {editingSkill ? "Update Skill" : "Save Skill"}
              </button>
            </div>
          </div>
        )}

        <div className="skills-card-header">
          <div>
            <h2>All Skills</h2>
            <span>{skills.length} skill(s)</span>
          </div>
        </div>

        {loading ? (
          <div className="skills-empty">
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="skills-empty">
            <Code2 size={35} />
            <h3>No skills yet</h3>
            <p>Add your first skill to your portfolio.</p>
          </div>
        ) : (
          <div className="skills-list">
            {skills.map((skill) => (
              <div className="skill-row" key={skill._id}>
                <div className="skill-icon">
                  <Code2 size={18} />
                </div>

                <div className="skill-info">
                  <strong>{skill.name}</strong>
                  <p>
                    {skill.category}
                    {skill.level && ` • ${skill.level}`}
                  </p>
                </div>

                <div className="skill-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingSkill(skill);

                      setFormData({
                        name: skill.name,
                        category: skill.category,
                        level: skill.level || "",
                      });

                      setShowForm(true);
                    }}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSkill(skill._id)}
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

export default Skills;