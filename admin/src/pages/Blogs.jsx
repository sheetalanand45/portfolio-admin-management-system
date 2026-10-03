import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import "./Blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    published: false,
  });

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs`
      );
      const data = await response.json();

      if (response.ok) {
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSaveBlog = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const url = editingBlog
        ? `${import.meta.env.VITE_API_URL}/blogs/${editingBlog._id}`
        : `${import.meta.env.VITE_API_URL}/blogs`;

      const method = editingBlog ? "PUT" : "POST";

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
        alert(data.message || "Failed to save blog");
        return;
      }

      alert(
        editingBlog
          ? "Blog updated successfully!"
          : "Blog added successfully!"
      );

      setFormData({
        title: "",
        content: "",
        excerpt: "",
        image: "",
        published: false,
      });

      setEditingBlog(null);
      setShowForm(false);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);

    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      image: blog.image || "",
      published: blog.published || false,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete blog");
        return;
      }

      alert("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);

    setFormData({
      title: "",
      content: "",
      excerpt: "",
      image: "",
      published: false,
    });
  };

  return (
    <main className="blogs-page">
      <div className="blogs-header">
        <div>
          <h1>Blogs</h1>
          <p>Manage your portfolio blog posts.</p>
        </div>

        <button
          className="add-blog-btn"
          onClick={() => {
            setEditingBlog(null);
            setFormData({
              title: "",
              content: "",
              excerpt: "",
              image: "",
              published: false,
            });
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Blog
        </button>
      </div>

      {showForm && (
        <div className="blog-form-card">
          <div className="blog-form-header">
            <div>
              <h2>{editingBlog ? "Edit Blog" : "Add New Blog"}</h2>
              <p>
                {editingBlog
                  ? "Update your blog post."
                  : "Create a new blog post."}
              </p>
            </div>

            <button
              className="close-blog-btn"
              onClick={handleCancel}
            >
              <X size={18} />
            </button>
          </div>

          <div className="blog-form">
            <div className="blog-field">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="blog-field">
              <label>Image URL</label>
              <input
                type="text"
                placeholder="Blog image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.value,
                  })
                }
              />
            </div>

            <div className="blog-field full-width">
              <label>Excerpt</label>
              <textarea
                className="excerpt-input"
                placeholder="Short description of the blog"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    excerpt: e.target.value,
                  })
                }
              />
            </div>

            <div className="blog-field full-width">
              <label>Content</label>
              <textarea
                className="content-input"
                placeholder="Write your blog content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: e.target.value,
                  })
                }
              />
            </div>

            <label className="publish-toggle">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    published: e.target.checked,
                  })
                }
              />
              <span>Publish this blog</span>
            </label>
          </div>

          <div className="blog-form-actions">
            <button
              className="cancel-blog-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-blog-btn"
              onClick={handleSaveBlog}
            >
              {editingBlog ? "Update Blog" : "Save Blog"}
            </button>
          </div>
        </div>
      )}

      <div className="blogs-card">
        <div className="blogs-card-header">
          <div className="blogs-icon">
            <BookOpen size={19} />
          </div>

          <div>
            <h2>Blog Posts</h2>
            <p>
              View and manage your published and draft posts.
            </p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-blogs">
            <BookOpen size={40} />
            <h3>No blog posts yet</h3>
            <p>
              Create your first blog post to get started.
            </p>
          </div>
        ) : (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <div className="blog-item" key={blog._id}>
                <div className="blog-info">
                  <div className="blog-title-row">
                    <h3>{blog.title}</h3>

                    <span
                      className={
                        blog.published
                          ? "status published"
                          : "status draft"
                      }
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p>{blog.excerpt || blog.content}</p>
                </div>

                <div className="blog-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(blog)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(blog._id)}
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

export default Blogs;