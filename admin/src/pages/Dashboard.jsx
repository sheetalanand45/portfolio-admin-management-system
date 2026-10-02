import { useEffect, useState } from "react";

import {
  FolderKanban,
  Code2,
  MessageSquareQuote,
  Mail,
  ArrowUpRight,
  Clock,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({ setActivePage }) {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    testimonials: 0,
    messages: 0,
  });

  const token = localStorage.getItem("adminToken");

    let username = "Admin";

    if (token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        username = payload.username || "Admin";
    } catch (error) {
        console.error("Token decode error:", error);
    }
    }

  const [about, setAbout] = useState(null);

    useEffect(() => {
    const fetchAbout = async () => {
        try {
        const response = await fetch("http://localhost:5000/about");
        const data = await response.json();

        if (response.ok) {
            setAbout(data);
        }
        } catch (error) {
        console.error("About fetch error:", error);
        }
    };

    fetchAbout();
   }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          projectsResponse,
          skillsResponse,
          testimonialsResponse,
          messagesResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/projects"),
          fetch("http://localhost:5000/skills"),
          fetch("http://localhost:5000/testimonials"),
          fetch("http://localhost:5000/contact", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }),
        ]);

        const projects = await projectsResponse.json();
        const skills = await skillsResponse.json();
        const testimonials = await testimonialsResponse.json();
        const messages = await messagesResponse.json();

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          testimonials: Array.isArray(testimonials)
            ? testimonials.length
            : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
    },
    {
      title: "Total Skills",
      value: stats.skills,
      icon: Code2,
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquareQuote,
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
    },
  ];

  return (
    <main className="dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your portfolio content from one place.</p>
        </div>

        <div className="dashboard-admin-avatar">
            {about?.profileImage ? (
                <img
                src={about.profileImage}
                alt={about.name || "Admin"}
                className="dashboard-admin-image"
                />
            ) : (
                "SA"
            )}

            <div className="dashboard-admin-info">
                <strong>{username}</strong>
                <span>Administrator</span>
            </div>
        </div>
      </div>

      {/* Statistics */}
      <section className="stats-grid">

        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>

              <div className="stat-top">
                <div className="stat-icon">
                  <Icon size={19} />
                </div>

                <ArrowUpRight
                  size={16}
                  className="stat-arrow"
                />
              </div>

              <h2>
                {loading ? "..." : stat.value}
              </h2>

              <p>{stat.title}</p>

            </div>
          );
        })}

      </section>

      {/* Recent Content */}
      <section className="content-card">

        <div className="section-heading">
          <div>
            <h2>Recent Content</h2>
            <p>Your latest portfolio updates.</p>
          </div>
        </div>

        <div className="recent-list">

          {/* Projects */}
          <div className="recent-item">
            <div className="recent-icon project">
                <FolderKanban size={18} />
            </div>

            <div className="recent-info">
                <strong>Projects</strong>
                <span>Manage your portfolio projects</span>
            </div>

            <button onClick={() => setActivePage("Projects")}>
              Manage
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Skills */}
          <div className="recent-item">

            <div className="recent-icon skill">
              <Code2 size={18} />
            </div>

            <div className="recent-info">
              <strong>Skills</strong>
              <span>
                Manage your technical skills
              </span>
            </div>

            <button onClick={() => setActivePage("Skills")}>
              Manage
              <ArrowUpRight size={14} />
            </button>

          </div>

          {/* Testimonials */}
          <div className="recent-item">

            <div className="recent-icon testimonial">
              <MessageSquareQuote size={18} />
            </div>

            <div className="recent-info">
              <strong>Testimonials</strong>
              <span>
                Manage client testimonials
              </span>
            </div>

            <button onClick={() => setActivePage("Testimonials")}>
               Manage
               <ArrowUpRight size={14} />
            </button>

          </div>

          {/* Messages */}
          <div className="recent-item">

            <div className="recent-icon message">
              <Mail size={18} />
            </div>

            <div className="recent-info">
              <strong>Messages</strong>
              <span>
                View messages from visitors
              </span>
            </div>

            <button onClick={() => setActivePage("Messages")}>
               View
               <ArrowUpRight size={14} />
            </button>

          </div>

        </div>

      </section>

      {/* Quick Info */}
      <section className="dashboard-info">

        <div className="info-card">

          <div className="info-icon">
            <Clock size={19} />
          </div>

          <div>
            <h3>CMS Status</h3>

            <p>
              Your content management system is ready.
            </p>
          </div>

          <span className="status-badge">
            Active
          </span>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;