import { useState, useEffect } from "react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
  Code2,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  GitBranch,
  ArrowRight,
  Send,
  Moon,
  Menu,
  ChevronUp,
  Database,
  FileCode2,
  Smartphone,
  BrainCircuit,
  Terminal,
  Globe,
  Bug,
  CircleCheck,
  Server,
} from "lucide-react";

import "./App.css";

function App() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sendingMessage, setSendingMessage] = useState(false);

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setSendingMessage(true);

      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send message.");
        return;
      }

      alert("Message sent successfully!");

      setContactForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setSendingMessage(false);
    }
  };

  const [home, setHome] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch("http://localhost:5000/home");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch Home");
        }

        setHome(data);
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setHomeLoading(false);
      }
    };

    fetchHome();
  }, []);

  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/skills");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch skills");
        }

        setSkills(data);
      } catch (error) {
        console.error("Skills fetch error:", error);
        setSkillsError("Unable to load skills.");
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const skillIcons = {
    React: "⚛",
    JavaScript: "JS",
    HTML: "5",
    CSS: "CSS",
    Tailwind: "TW",
    "Node.js": "N",
    "Express.js": "EX",
    MySQL: "SQL",
    MongoDB: "M",
    Git: "G",
    Python: "PY",
    Postman: "P",
    FastAPI: "API",
  };

  const [about, setAbout] = useState(null);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [aboutError, setAboutError] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("http://localhost:5000/about");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch About");
        }

        setAbout(data);
      } catch (error) {
        console.error("About fetch error:", error);
        setAboutError("Unable to load About information.");
      } finally {
        setAboutLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(true);
  const [experiencesError, setExperiencesError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("http://localhost:5000/experience");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch experiences"
          );
        }

        setExperiences(data);
      } catch (error) {
        console.error("Experience fetch error:", error);
        setExperiencesError("Unable to load experience.");
      } finally {
        setExperiencesLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/projects");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        setProjects(data);
      } catch (error) {
        console.error("Projects fetch error:", error);
        setProjectsError("Unable to load projects.");
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const projectIcons = {
    "Full Stack": <Code2 size={42} />,
    "AI / Machine Learning": <BrainCircuit size={42} />,
    "Data Analytics": <Database size={42} />,
    "Python": <Terminal size={42} />,
    "Web Development": <Globe size={42} />,
    "Software Testing": <Bug size={42} />,
  };

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blogs");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch blogs");
        }

        setBlogs(data.filter((blog) => blog.published));
      } catch (error) {
        console.error("Blog fetch error:", error);
        setBlogsError("Unable to load blogs.");
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const [contactInfo, setContactInfo] = useState(null);
  const [contactInfoLoading, setContactInfoLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/contact-info"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch contact information"
          );
        }

        setContactInfo(data);
      } catch (error) {
        console.error("Contact info fetch error:", error);
      } finally {
        setContactInfoLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="portfolio">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="nav-container">

          <a href="#home" className="logo">
            <Code2 size={24} />
            <span>MyPortfolio</span>
          </a>

          <nav className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-actions">
            <button className="theme-button">
              <Moon size={18} />
            </button>

            <button className="menu-button">
              <Menu size={22} />
            </button>
          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <section id="home" className="hero">

        <div className="hero-container">

          <div className="hero-content">

            <p className="hello-text">
              {home?.greeting || "Hello, I'm"}
            </p>

            <h1>
              {home?.name ? (
                <>
                  {home.name.split(" ")[0]}{" "}
                  <span>
                    {home.name.split(" ").slice(1).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Sheetal <span>Anand</span>
                </>
              )}
            </h1>

            <h2>
              {home?.headline ||
                "Computer Science Engineer & Full Stack Developer"}
            </h2>

            <p className="hero-description">
              {home?.description ||
                "I build responsive web applications and enjoy solving problems through technology."}
            </p>

            <div className="hero-buttons">

              <a href="#projects" className="primary-button">
                {home?.primaryButtonText || "View My Projects"}
                <ArrowRight size={17} />
              </a>

              <a href="#contact" className="secondary-button">
                {home?.secondaryButtonText || "Contact Me"}
              </a>

            </div>

            <div className="social-links">

              {home?.githubUrl && (
                <a
                  href={home.githubUrl}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub size={22} />
                </a>
              )}

              {home?.linkedinUrl && (
                <a
                  href={home.linkedinUrl}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={22} />
                </a>
              )}

              {home?.email && (
                <a
                  href={`mailto:${home.email}`}
                  className="social-link"
                  aria-label="Email"
                >
                  <Mail size={21} />
                </a>
              )}

            </div>

          </div>

          {/* PROFILE */}

          <div className="hero-profile">

            <div className="profile-glow"></div>

            <div className="profile-box">

              {home?.profileImage ? (
                <img
                  src={home.profileImage}
                  alt={home.name || "Profile"}
                  className="hero-profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  SA
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section id="about" className="section about-section">

        <div className="section-container">

          <div className="section-title">
            <h2>About Me</h2>
            <div className="title-line"></div>
          </div>

          <div className="about-grid">

            <div className="about-text">

              {aboutLoading && (
                <p>Loading About information...</p>
              )}

              {!aboutLoading && aboutError && (
                <p>{aboutError}</p>
              )}

              {!aboutLoading && !aboutError && about && (
                <>
                  <p>{about.description}</p>

                  {about.education && (
                    <p>
                      Currently pursuing {about.education}.
                    </p>
                  )}
                </>
              )}

              <div className="about-details">

                <div>
                  <MapPin size={17} />
                  <span>{about?.location || "India"}</span>
                </div>

                <div>
                  <Mail size={17} />
                  <span>{about?.email || "Email"}</span>
                </div>

                <div>
                  <span>
                    {about?.education || "B.Tech CSE — GGSIPU"}
                  </span>
                </div>

              </div>

            </div>


            <div className="about-avatar">
              {about?.profileImage ? (
                <img
                  src={about.profileImage}
                  alt={about.name || "Profile"}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-circle">SA</div>
              )}
            </div>

          </div>


          {/* EXPERIENCE */}

          <div id="experience" className="experience">

            <div className="section-title">
              <h2>My Journey</h2>
              <div className="title-line"></div>
            </div>

            {experiencesLoading && (
              <p>Loading experience...</p>
            )}

            <div className="timeline">
              {!experiencesLoading && experiencesError && (
                <p>{experiencesError}</p>
              )}

              {!experiencesLoading &&
                !experiencesError &&
                experiences.map((experience) => (
                  <div
                    className="timeline-item"
                    key={experience._id}
                  >
                    <div className="timeline-dot"></div>

                    <div>
                      <span>
                        {experience.startDate}
                        {experience.endDate
                          ? ` — ${experience.endDate}`
                          : ""}
                      </span>

                      <h3>{experience.title}</h3>

                      <p>{experience.organization}</p>

                      {experience.description && (
                        <p>{experience.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>

          </div>

        </div>

      </section>


      {/* ================= SKILLS ================= */}

      <section id="skills" className="section skills-section">

        <div className="section-container">

          <div className="section-title centered">
            <h2>My Skills</h2>
            <div className="title-line"></div>
          </div>

          <div className="skills-grid">

            {skillsLoading && (
              <p>Loading skills...</p>
            )}

            {!skillsLoading && skillsError && (
              <p>{skillsError}</p>
            )}

            {!skillsLoading &&
              !skillsError &&
              skills.map((skill) => (
                <div className="skill-card" key={skill._id}>

                  <div className="skill-icon">
                    {skillIcons[skill.name] || "•"}
                  </div>

                  <span>
                    {skill.name}
                  </span>

                </div>
              ))}

          </div>

        </div>

      </section>


      {/* ================= PROJECTS ================= */}

      <section id="projects" className="section projects-section">

        <div className="section-container">

          <div className="section-title">
            <h2>Featured Projects</h2>
            <div className="title-line"></div>
          </div>

          <div className="projects-grid">

            {projectsLoading && <p>Loading projects...</p>}

            {!projectsLoading && projectsError && (
              <p>{projectsError}</p>
            )}

            {!projectsLoading &&
              !projectsError &&
              projects.map((project) => (

                <div className="project-card" key={project._id}>

                  <div className="project-preview">
                    {projectIcons[project.category] || <Code2 size={42} />}
                  </div>

                  <div className="project-content">

                    <span className="project-category">
                      {project.category}
                    </span>

                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      {project.description}
                    </p>

                    <a
                      href={project.liveUrl || project.githubUrl || "#"}
                      className="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                      <ArrowRight size={15} />
                    </a>

                  </div>

                </div>

              ))}

          </div>

        </div>

      </section>


      {/* ================= BLOG ================= */}

      <section id="blog" className="section blog-section">

        <div className="section-container">

          <div className="section-title centered">
            <h2>Latest Blog</h2>
            <div className="title-line"></div>
          </div>

          <div className="blog-card">

            {blogsLoading && (
              <div className="blog-card">
                <div>
                  <h3>Loading blogs...</h3>
                </div>
              </div>
            )}

            {!blogsLoading && blogsError && (
              <div className="blog-card">
                <div>
                  <h3>{blogsError}</h3>
                </div>
              </div>
            )}

            {!blogsLoading &&
              !blogsError &&
              blogs.length === 0 && (
                <div className="blog-card">
                  <div className="blog-icon">
                    <FileCode2 size={32} />
                  </div>

                  <div>
                    <span>Coming Soon</span>

                    <h3>My Development Journey</h3>

                    <p>
                      I'll be sharing my experiences, projects,
                      tutorials and things I learn while developing.
                    </p>
                  </div>
                </div>
              )}

            {!blogsLoading &&
              !blogsError &&
              blogs.map((blog) => (
                <div className="blog-card" key={blog._id}>
                  <div className="blog-icon">
                    <FileCode2 size={32} />
                  </div>

                  <div>
                    <span>Published</span>

                    <h3>{blog.title}</h3>

                    <p>{blog.excerpt || blog.content}</p>
                  </div>
                </div>
              ))}

          </div>

        </div>

      </section>


      {/* ================= CONTACT ================= */}

      <section id="contact" className="section contact-section">

        <div className="section-container">

          <div className="section-title">
              <h2>
                {contactInfo?.heading || "Get In Touch"}
              </h2>
              <div className="title-line"></div>
          </div>

          <div className="contact-grid">

            <div className="contact-info">

              <p>
                {contactInfo?.description ||
                  "Let's connect and discuss opportunities."}
              </p>

              <div className="contact-item">

                <Mail size={18} />

                <div>
                  <span>Email</span>
                  <p>
                    {contactInfo?.email || "Email"}
                  </p>
                </div>

              </div>

              <div className="contact-item">

                <Phone size={18} />

                <div>
                  <span>Phone</span>
                  <p>
                    {contactInfo?.phone || "Phone"}
                  </p>
                </div>

              </div>

              <div className="contact-item">

                <MapPin size={18} />

                <div>
                  <span>Location</span>
                  <p>
                    {contactInfo?.location || "Location"}
                  </p>
                </div>

              </div>

              <div className="contact-item">

                <CircleCheck size={18} />

                <div>
                  <span>Availability</span>
                  <p>
                    {contactInfo?.availability || "Available for opportunities"}
                  </p>
                </div>

              </div>

            </div>


            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={contactForm.name}
                onChange={handleContactChange}
              />

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={contactForm.email}
                onChange={handleContactChange}
              />

              <label>Message</label>

              <textarea
                name="message"
                rows="5"
                placeholder="Your message"
                value={contactForm.message}
                onChange={handleContactChange}
              ></textarea>

              <button type="submit" disabled={sendingMessage}>
                {sendingMessage ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-container">

          <div>
            <div className="logo">
              <Code2 size={22} />
              <span>MyPortfolio</span>
            </div>

            <p>
              © 2026 Sheetal Anand. All rights reserved.
            </p>
          </div>


          <div className="footer-social">

            {/* <a href="#">
              <Github size={18} />
            </a> */}

            {/* <a href="#">
              <Linkedin size={18} />
            </a> */}

            {/* <a href="#">
              <Instagram size={18} />
            </a> */}

          </div>


          <a href="#home" className="top-button">
            <ChevronUp size={18} />
          </a>

        </div>

      </footer>

    </div>
  );
}

export default App;