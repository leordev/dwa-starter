import { useState } from "react";
import { Link } from "react-router-dom";
import "./GlobalNav.css";

export const GlobalNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`global-nav ${isOpen ? "open" : ""}`}>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/settings" onClick={() => setIsOpen(false)}>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};
