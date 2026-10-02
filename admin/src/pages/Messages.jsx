import { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  Eye,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:5000/contact", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.error("Failed to fetch messages:", data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // View message and mark as read
  const handleView = async (message) => {
    setSelectedMessage(message);

    if (message.status === "unread") {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          `http://localhost:5000/contact/${message._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "read",
            }),
          }
        );

        if (response.ok) {
          await fetchMessages();
        } else {
          const data = await response.json();
          console.error("Failed to mark message as read:", data);
        }
      } catch (error) {
        console.error("Error updating message:", error);
      }
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/contact/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Read response as text first
      const responseText = await response.text();

      console.log("DELETE status:", response.status);
      console.log("DELETE response:", responseText);

      if (!response.ok) {
        alert(
          `Delete failed.\nStatus: ${response.status}\n${responseText}`
        );
        return;
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("Response is not JSON:", responseText);
        alert("Server returned an unexpected response.");
        return;
      }

      alert(data.message || "Message deleted successfully!");

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }

      await fetchMessages();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to connect to backend.");
    }
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  return (
    <main className="messages-page">
      <div className="messages-header">
        <div>
          <h1>Messages</h1>
          <p>
            View and manage messages submitted through your contact form.
          </p>
        </div>

        <div className="message-count">
          <Mail size={17} />
          {messages.length} Messages
        </div>
      </div>

      <div className="messages-card">
        <div className="messages-card-header">
          <div className="messages-icon">
            <Mail size={19} />
          </div>

          <div>
            <h2>Contact Messages</h2>
            <p>Messages received from your portfolio visitors.</p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="empty-messages">
            <Mail size={42} />
            <h3>No messages yet</h3>
            <p>
              Messages submitted through the contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                className={`message-item ${
                  message.status === "unread"
                    ? "message-unread"
                    : ""
                }`}
                key={message._id}
              >
                <div className="message-avatar">
                  {message.name?.charAt(0).toUpperCase()}
                </div>

                <div className="message-info">
                  <div className="message-top">
                    <h3>{message.name}</h3>

                    <span
                      className={`message-status ${
                        message.status === "unread"
                          ? "status-unread"
                          : "status-read"
                      }`}
                    >
                      {message.status === "unread" ? (
                        <>
                          <Clock size={12} />
                          Unread
                        </>
                      ) : (
                        <>
                          <CheckCircle size={12} />
                          Read
                        </>
                      )}
                    </span>
                  </div>

                  <span className="message-email">
                    {message.email}
                  </span>

                  {message.subject && (
                    <h4>{message.subject}</h4>
                  )}

                  <p>
                    {message.message.length > 120
                      ? `${message.message.substring(0, 120)}...`
                      : message.message}
                  </p>
                </div>

                <div className="message-actions">
                  <button
                    className="view-message-btn"
                    onClick={() => handleView(message)}
                    title="View message"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    className="delete-message-btn"
                    onClick={() => handleDelete(message._id)}
                    title="Delete message"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="message-modal-header">
              <div>
                <h2>Message Details</h2>
                <p>Contact form submission</p>
              </div>

              <button
                className="close-message-btn"
                onClick={closeMessage}
              >
                <X size={18} />
              </button>
            </div>

            <div className="message-modal-body">
              <div className="message-detail">
                <label>Name</label>
                <p>{selectedMessage.name}</p>
              </div>

              <div className="message-detail">
                <label>Email</label>
                <p>{selectedMessage.email}</p>
              </div>

              {selectedMessage.subject && (
                <div className="message-detail">
                  <label>Subject</label>
                  <p>{selectedMessage.subject}</p>
                </div>
              )}

              <div className="message-detail">
                <label>Message</label>
                <div className="message-content">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="message-detail">
                <label>Status</label>
                <p>
                  {selectedMessage.status === "unread"
                    ? "Unread"
                    : "Read"}
                </p>
              </div>
            </div>

            <div className="message-modal-actions">
              <button
                className="close-modal-btn"
                onClick={closeMessage}
              >
                Close
              </button>

              <button
                className="delete-modal-btn"
                onClick={() =>
                  handleDelete(selectedMessage._id)
                }
              >
                <Trash2 size={15} />
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Messages;