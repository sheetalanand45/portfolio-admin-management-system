import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Briefcase } from "lucide-react";
import "./Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services`
      );
      const data = await response.json();

      if (response.ok) {
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "",
    });
  };

  const handleSaveService = async () => {
    if (!formData.title || !formData.description) {
      alert("Please enter title and description.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const url = editingService
        ? `${import.meta.env.VITE_API_URL}/services/${editingService._id}`
        : `${import.meta.env.VITE_API_URL}/services`;

      const method = editingService ? "PUT" : "POST";

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
        alert(data.message || "Failed to save service");
        return;
      }

      alert(
        editingService
          ? "Service updated successfully!"
          : "Service added successfully!"
      );

      resetForm();
      setEditingService(null);
      setShowForm(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);

    setFormData({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete service");
        return;
      }

      alert("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    resetForm();
  };

  return (
    <main className="services-page">
      <div className="services-header">
        <div>
          <h1>Services</h1>
          <p>Manage the services displayed on your portfolio.</p>
        </div>

        <button
          className="add-service-btn"
          onClick={() => {
            setEditingService(null);
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Service
        </button>
      </div>

      {showForm && (
        <div className="service-form-card">
          <div className="service-form-header">
            <div>
              <h2>
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>

              <p>
                {editingService
                  ? "Update the service details."
                  : "Add a service that you provide."}
              </p>
            </div>

            <button
              className="close-service-btn"
              onClick={handleCancel}
            >
              <X size={18} />
            </button>
          </div>

          <div className="service-form">
            <div className="service-field">
              <label>Service Title</label>

              <input
                type="text"
                placeholder="e.g. Web Development"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="service-field">
              <label>Icon</label>

              <input
                type="text"
                placeholder="e.g. Code"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    icon: e.target.value,
                  })
                }
              />
            </div>

            <div className="service-field full-width">
              <label>Description</label>

              <textarea
                placeholder="Describe this service..."
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

          <div className="service-form-actions">
            <button
              className="cancel-service-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-service-btn"
              onClick={handleSaveService}
            >
              {editingService ? "Update Service" : "Save Service"}
            </button>
          </div>
        </div>
      )}

      <div className="services-card">
        <div className="services-card-header">
          <div className="services-icon">
            <Briefcase size={19} />
          </div>

          <div>
            <h2>Service Entries</h2>
            <p>View and manage your service content.</p>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="empty-services">
            <Briefcase size={40} />

            <h3>No services yet</h3>

            <p>Add your first service to get started.</p>
          </div>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div className="service-item" key={service._id}>
                <div className="service-item-icon">
                  <Briefcase size={20} />
                </div>

                <div className="service-info">
                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  {service.icon && (
                    <span className="service-icon-name">
                      Icon: {service.icon}
                    </span>
                  )}
                </div>

                <div className="service-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(service._id)}
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

export default Services;