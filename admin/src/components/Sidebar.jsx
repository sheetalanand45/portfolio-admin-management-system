import {
  LayoutDashboard,
  House,
  User,
  Code2,
  FolderKanban,
  BookOpen,
  Briefcase,
  MessageSquareQuote,
  Wrench,
  Image,
  Contact,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Home", icon: House },
    { name: "About", icon: User },
    { name: "Skills", icon: Code2 },
    { name: "Projects", icon: FolderKanban },
    { name: "Blogs", icon: BookOpen },
    { name: "Experience", icon: Briefcase },
    { name: "Contact Info", icon: Contact },
    { name: "Testimonials", icon: MessageSquareQuote },
    { name: "Services", icon: Wrench },
    { name: "Media", icon: Image },
    { name: "Messages", icon: Mail },
    { name: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">M</div>
        <div>
          <h2>MyPortfolio</h2>
          <span>CMS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`sidebar-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={17} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={17} />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default Sidebar;