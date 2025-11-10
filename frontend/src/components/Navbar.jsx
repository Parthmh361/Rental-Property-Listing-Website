import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, LogIn, UserPlus, LogOut, PlusCircle, User, BookOpen, Search } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  const active = ({ isActive }) =>
    isActive ? "nav-link active fw-semibold text-primary" : "nav-link text-dark";

  return (
    <nav className="navbar navbar-expand-lg navbar-light py-2">
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          <Home size={24} strokeWidth={2.5} />
          <span>Rentify</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={active} end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/browse" className={active}>
                <Search size={18} className="me-1" /> Browse
              </NavLink>
            </li>
          </ul>

          {/* Right Side */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-3">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={active}>
                    <LogIn size={18} className="me-1" /> Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/signup" className={active}>
                    <UserPlus size={18} className="me-1" /> Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/my-properties"
                    className={active}
                  >
                    <BookOpen size={18} className="me-1" /> My Properties
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/properties/new"
                    className="btn btn-primary fw-semibold px-3 d-flex align-items-center gap-1"
                  >
                    <PlusCircle size={18} />
                    List Property
                  </NavLink>
                </li>

                <li className="nav-item d-flex align-items-center text-dark small fw-semibold">
                  <User size={18} className="me-1 text-secondary" />
                  Hello, {user.name}
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={logout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
