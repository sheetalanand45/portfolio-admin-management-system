import { useEffect, useState } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import "./Media.css";

function Media() {
  const [media, setMedia] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/upload/images",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMedia(data);
      }
      else {
        console.error("Media fetch failed:", data);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        "http://localhost:5000/upload/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Image upload failed.");
        return;
      }

      alert("Image uploaded successfully!");

      setSelectedFile(null);

      const fileInput = document.getElementById("media-upload");
      if (fileInput) {
        fileInput.value = "";
      }

      fetchMedia();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Unable to connect to backend.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/upload/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete image.");
        return;
      }

      alert("Image deleted successfully!");
      fetchMedia();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <main className="media-page">
      <div className="media-header">
        <div>
          <h1>Media</h1>
          <p>Upload and manage images used across your portfolio.</p>
        </div>
      </div>

      <div className="media-upload-card">
        <div className="media-upload-icon">
          <Upload size={21} />
        </div>

        <div className="media-upload-content">
          <h2>Upload Image</h2>
          <p>
            Select an image and upload it to your portfolio media library.
          </p>

          <div className="media-upload-controls">
            <input
              id="media-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            <button
              className="upload-media-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {selectedFile && (
            <div className="selected-file">
              Selected: <strong>{selectedFile.name}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="media-library-card">
        <div className="media-card-header">
          <div className="media-card-icon">
            <ImageIcon size={19} />
          </div>

          <div>
            <h2>Media Library</h2>
            <p>View images uploaded to your CMS.</p>
          </div>
        </div>

        {media.length === 0 ? (
          <div className="empty-media">
            <ImageIcon size={42} />

            <h3>No media yet</h3>

            <p>Upload your first image to get started.</p>
          </div>
        ) : (
          <div className="media-grid">
            {media.map((item) => (
              <div className="media-item" key={item._id}>
                <div className="media-preview">
                  <img
                    src={`http://localhost:5000${item.path}`}
                    alt={item.filename}
                  />
                </div>

                <div className="media-item-footer">
                    <span title={item.filename}>
                        {item.filename}
                    </span>

                    <div className="media-actions">
                        <button
                        className="use-profile-btn"
                        onClick={() => {
                            localStorage.setItem(
                            "selectedProfileImage",
                            `http://localhost:5000${item.path}`
                            );
                            alert("Profile image selected!");
                        }}
                        >
                        Use as Profile
                        </button>

                        <button
                            onClick={() => {
                                localStorage.setItem(
                                "selectedHomeImage",
                                `http://localhost:5000${item.path}`
                                );
                                alert("Home image selected!");
                            }}
                            >
                            Use for Home
                        </button>

                        <button
                        className="media-delete-btn"
                        onClick={() => handleDelete(item._id)}
                        >
                        <Trash2 size={15} />
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Media;