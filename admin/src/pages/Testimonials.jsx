import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, MessageSquareQuote } from "lucide-react";
import "./Testimonials.css";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    image: "",
  });

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/testimonials`
      );
      const data = await response.json();

      if (response.ok) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      message: "",
      image: "",
    });
  };

  const handleSaveTestimonial = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const url = editingTestimonial
        ? `${import.meta.env.VITE_API_URL}/testimonials/${editingTestimonial._id}`
        : `${import.meta.env.VITE_API_URL}/testimonials`;

      const method = editingTestimonial ? "PUT" : "POST";

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
        alert(data.message || "Failed to save testimonial");
        return;
      }

      alert(
        editingTestimonial
          ? "Testimonial updated successfully!"
          : "Testimonial added successfully!"
      );

      resetForm();
      setEditingTestimonial(null);
      setShowForm(false);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);

    setFormData({
      name: testimonial.name || "",
      role: testimonial.role || "",
      message: testimonial.message || "",
      image: testimonial.image || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete testimonial");
        return;
      }

      alert("Testimonial deleted successfully!");
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    resetForm();
  };

  return (
    <main className="testimonials-page">
      <div className="testimonials-header">
        <div>
          <h1>Testimonials</h1>
          <p>Manage testimonials displayed on your portfolio.</p>
        </div>

        <button
          className="add-testimonial-btn"
          onClick={() => {
            setEditingTestimonial(null);
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="testimonial-form-card">
          <div className="testimonial-form-header">
            <div>
              <h2>
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </h2>

              <p>
                {editingTestimonial
                  ? "Update the testimonial details."
                  : "Add feedback from a client, mentor, or colleague."}
              </p>
            </div>

            <button
              className="close-testimonial-btn"
              onClick={handleCancel}
            >
              <X size={18} />
            </button>
          </div>

          <div className="testimonial-form">
            <div className="testimonial-field">
              <label>Name</label>

              <input
                type="text"
                placeholder="Person's name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="testimonial-field">
              <label>Role</label>

              <input
                type="text"
                placeholder="e.g. Mentor, Client"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
              />
            </div>

            <div className="testimonial-field full-width">
              <label>Message</label>

              <textarea
                placeholder="Write the testimonial message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
              />
            </div>

            <div className="testimonial-field full-width">
              <label>Image URL</label>

              <input
                type="text"
                placeholder="Profile image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="testimonial-form-actions">
            <button
              className="cancel-testimonial-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-testimonial-btn"
              onClick={handleSaveTestimonial}
            >
              {editingTestimonial
                ? "Update Testimonial"
                : "Save Testimonial"}
            </button>
          </div>
        </div>
      )}

      <div className="testimonials-card">
        <div className="testimonials-card-header">
          <div className="testimonials-icon">
            <MessageSquareQuote size={19} />
          </div>

          <div>
            <h2>Testimonial Entries</h2>
            <p>View and manage your testimonial content.</p>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <div className="empty-testimonials">
            <MessageSquareQuote size={40} />

            <h3>No testimonials yet</h3>

            <p>Add your first testimonial to get started.</p>
          </div>
        ) : (
          <div className="testimonials-list">
            {testimonials.map((testimonial) => (
              <div
                className="testimonial-item"
                key={testimonial._id}
              >
                <div className="testimonial-avatar">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  ) : (
                    <span>
                      {testimonial.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="testimonial-info">
                  <h3>{testimonial.name}</h3>

                  {testimonial.role && (
                    <span>{testimonial.role}</span>
                  )}

                  <p>"{testimonial.message}"</p>
                </div>

                <div className="testimonial-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(testimonial._id)
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

export default Testimonials;