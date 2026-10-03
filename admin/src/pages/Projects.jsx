import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FolderKanban,
} from "lucide-react";
import "./Projects.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Full Stack",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
  });

  const [editingProject, setEditingProject] = useState(null);

  // ================= FETCH PROJECTS =================

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/projects`);

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        console.error("Failed to fetch projects:", data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= SAVE PROJECT =================

  const handleSaveProject = async () => {
    if (!formData.title || !formData.description) {
      alert("Please enter project title and description.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const url = editingProject
        ? `${BACKEND_URL}/projects/${editingProject._id}`
        : `${BACKEND_URL}/projects`;

      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          technologies: formData.technologies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          githubUrl: formData.githubUrl,
          liveUrl: formData.liveUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save project.");
        return;
      }

      alert(
        editingProject
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Unable to connect to backend.");
    }
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Full Stack",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
    });

    setEditingProject(null);
    setShowForm(false);
  };

  // ================= DELETE PROJECT =================

  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${BACKEND_URL}/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete project.");
        return;
      }

      alert("Project deleted successfully!");

      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <main className="projects-page">

      {/* ================= HEADER ================= */}

      <div className="projects-header">

        <div>
          <h1>Projects</h1>

          <p>
            Manage the projects displayed on your portfolio.
          </p>
        </div>

        <button
          className="add-project-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Project
        </button>

      </div>

      <div className="projects-card">

        {/* ================= FORM ================= */}

        {showForm && (

          <div className="project-form">

            <h2>
              {editingProject
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            {/* PROJECT TITLE */}

            <input
              type="text"
              placeholder="Project title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />

            {/* DESCRIPTION */}

            <textarea
              placeholder="Project description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            {/* CATEGORY */}

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            >
              <option value="Full Stack">
                Full Stack
              </option>

              <option value="AI / Machine Learning">
                AI / Machine Learning
              </option>

              <option value="Data Analytics">
                Data Analytics
              </option>

              <option value="Python">
                Python
              </option>

              <option value="Web Development">
                Web Development
              </option>

              <option value="Software Testing">
                Software Testing
              </option>
            </select>

            {/* TECHNOLOGIES */}

            <input
              type="text"
              placeholder="Technologies (e.g. React, Node.js, MongoDB)"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technologies: e.target.value,
                })
              }
            />

            {/* GITHUB */}

            <input
              type="text"
              placeholder="GitHub URL"
              value={formData.githubUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  githubUrl: e.target.value,
                })
              }
            />

            {/* LIVE URL */}

            <input
              type="text"
              placeholder="Live project URL"
              value={formData.liveUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  liveUrl: e.target.value,
                })
              }
            />

            {/* FORM BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProject}
              >
                {editingProject
                  ? "Update Project"
                  : "Save Project"}
              </button>

            </div>

          </div>
        )}

        {/* ================= PROJECT HEADER ================= */}

        <div className="projects-card-header">

          <div>

            <h2>All Projects</h2>

            <span>
              {projects.length} project(s)
            </span>

          </div>

        </div>

        {/* ================= PROJECT LIST ================= */}

        {loading ? (

          <div className="projects-empty">
            Loading projects...
          </div>

        ) : projects.length === 0 ? (

          <div className="projects-empty">

            <FolderKanban size={35} />

            <h3>No projects yet</h3>

            <p>
              Add your first project to display it
              on your portfolio.
            </p>

          </div>

        ) : (

          <div className="projects-list">

            {projects.map((project) => (

              <div
                className="project-row"
                key={project._id}
              >

                {/* PROJECT ICON */}

                <div className="project-icon">
                  <FolderKanban size={18} />
                </div>

                {/* PROJECT INFO */}

                <div className="project-info">

                  <strong>
                    {project.title}
                  </strong>

                  <p>
                    {project.description}
                  </p>

                  {/* CATEGORY */}

                  <small>
                    {project.category}
                  </small>

                  {/* TECHNOLOGIES */}

                  {project.technologies?.length > 0 && (

                    <small>
                      {project.technologies.join(" • ")}
                    </small>

                  )}

                </div>

                {/* ACTIONS */}

                <div className="project-actions">

                  <button
                    className="edit-btn"
                    onClick={() => {

                      setEditingProject(project);

                      setFormData({
                        title: project.title,
                        description: project.description,
                        category:
                          project.category ||
                          "Full Stack",
                        technologies:
                          project.technologies?.join(", ") ||
                          "",
                        githubUrl:
                          project.githubUrl || "",
                        liveUrl:
                          project.liveUrl || "",
                      });

                      setShowForm(true);
                    }}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteProject(
                        project._id
                      )
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

export default Projects;