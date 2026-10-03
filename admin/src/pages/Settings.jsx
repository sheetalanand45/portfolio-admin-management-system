import { useState } from "react";
import { ShieldCheck, LogOut, Server } from "lucide-react";

import "./Settings.css";

function Settings() {
  const [newUsername, setNewUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [changingUsername, setChangingUsername] = useState(false);

  const handleChangeUsername = async (e) => {
    e.preventDefault();

    setUsernameMessage("");
    setUsernameError("");

    if (!newUsername.trim()) {
      setUsernameError("Please enter a new username.");
      return;
    }

    if (newUsername.trim().length < 3) {
      setUsernameError(
        "Username must be at least 3 characters long."
      );
      return;
    }

    try {
      setChangingUsername(true);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/change-username`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newUsername: newUsername.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change username"
        );
      }

      setUsernameMessage(
        "Username changed successfully. Please login again."
      );

      setNewUsername("");

      // Old JWT contains the old username.
      // Remove it so user must login again.
      localStorage.removeItem("adminToken");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Change username error:", error);
      setUsernameError(error.message);
    } finally {
      setChangingUsername(false);
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters long."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password"
        );
      }

      setPasswordMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordError(error.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (
    <main className="settings">

      {/* Header */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your CMS settings and admin account.
          </p>
        </div>
      </div>

      {/* Admin Account */}
      <section className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2>Admin Account</h2>
            <p>
              Manage your administrator account.
            </p>
          </div>
        </div>

        <div className="settings-details">

          <div className="setting-row">
            <div>
              <strong>Username</strong>
              <span>Admin</span>
            </div>
          </div>

          <form
            className="username-form"
            onSubmit={handleChangeUsername}
          >
            <h3>Change Username</h3>

            <div className="username-field">
              <label>New Username</label>

              <input
                type="text"
                value={newUsername}
                onChange={(e) =>
                  setNewUsername(e.target.value)
                }
                placeholder="Enter new username"
              />
            </div>

            {usernameError && (
              <p className="username-error">
                {usernameError}
              </p>
            )}

            {usernameMessage && (
              <p className="username-success">
                {usernameMessage}
              </p>
            )}

            <button
              type="submit"
              className="change-username-button"
              disabled={changingUsername}
            >
              {changingUsername
                ? "Changing..."
                : "Change Username"}
            </button>
          </form>

        </div>

        {/* Change Password */}
        <form
          className="password-form"
          onSubmit={handleChangePassword}
        >

          <h3>Change Password</h3>

          <div className="password-field">
            <label>Current Password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              placeholder="Enter current password"
            />
          </div>

          <div className="password-field">
            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
            />
          </div>

          <div className="password-field">
            <label>Confirm New Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
            />
          </div>

          {passwordError && (
            <p className="password-error">
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p className="password-success">
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            className="change-password-button"
            disabled={changingPassword}
          >
            {changingPassword
              ? "Changing..."
              : "Change Password"}
          </button>

        </form>

      </section>

      {/* CMS Status */}
      <section className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <Server size={20} />
          </div>

          <div>
            <h2>CMS Status</h2>
            <p>
              Current status of your portfolio CMS.
            </p>
          </div>
        </div>

        <div className="status-row">

          <div>
            <strong>System Status</strong>
            <span>
              Portfolio CMS is running normally.
            </span>
          </div>

          <span className="settings-status">
            Active
          </span>

        </div>

      </section>

      {/* Logout */}
      <section className="settings-card danger-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <LogOut size={20} />
          </div>

          <div>
            <h2>Admin Session</h2>
            <p>
              Sign out from the admin dashboard.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>

      </section>

    </main>
  );
}

export default Settings;