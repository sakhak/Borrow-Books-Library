import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBookOpen, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaBookOpenReader } from "react-icons/fa6";
import { HiLibrary } from "react-icons/hi";
import { FaUserClock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa";
import { FaPlus, FaList, FaEdit, FaTrash } from "react-icons/fa";

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});

  const [sideBarLink] = useState([
    {
      key: "dashboard",
      route: "/",
      name: "Dashboard",
      icon: <BiSolidDashboard className="w-6 h-6" />,
    },
    {
      key: "author",
      route: "/author",
      name: "Author",
      icon: <FaBookOpenReader className="w-6 h-6" />,
      subItems: [
        {
          key: "author-list",
          route: "/author/list",
          name: "Author List",
          icon: <FaList className="w-4 h-4" />,
        },
        {
          key: "author-add",
          route: "/author/add",
          name: "Add Author",
          icon: <FaPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "book",
      route: "/book",
      name: "Book",
      icon: <FaBookOpen className="w-6 h-6" />,
      subItems: [
        {
          key: "book-list",
          route: "/book/list",
          name: "Book List",
          icon: <FaList className="w-4 h-4" />,
        },
        {
          key: "book-add",
          route: "/book/add",
          name: "Add Book",
          icon: <FaPlus className="w-4 h-4" />,
        },
        {
          key: "book-categories",
          route: "/book/categories",
          name: "Categories",
          icon: <FaEdit className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "employee",
      route: "/employee",
      name: "Employee",
      icon: <FaUserClock className="w-6 h-6" />,
      subItems: [
        {
          key: "employee-list",
          route: "/employee/list",
          name: "Employee List",
          icon: <FaList className="w-4 h-4" />,
        },
        {
          key: "employee-add",
          route: "/employee/add",
          name: "Add Employee",
          icon: <FaPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "inventory",
      route: "/inventory",
      name: "Inventory",
      icon: <FaClipboardCheck className="w-6 h-6" />,
      subItems: [
        {
          key: "inventory-stock",
          route: "/inventory/stock",
          name: "Stock Management",
          icon: <FaList className="w-4 h-4" />,
        },
        {
          key: "inventory-orders",
          route: "/inventory/orders",
          name: "Orders",
          icon: <FaEdit className="w-4 h-4" />,
        },
      ],
    },
    {
      key: "user",
      route: "/user",
      name: "User",
      icon: <FaUser className="w-6 h-6" />,
      subItems: [
        {
          key: "user-list",
          route: "/user/list",
          name: "User List",
          icon: <FaList className="w-4 h-4" />,
        },
        {
          key: "user-add",
          route: "/user/add",
          name: "Add User",
          icon: <FaPlus className="w-4 h-4" />,
        },
      ],
    },
  ]);

  // Auto-expand menu if current route is a submenu item
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedMenus = { ...expandedMenus };

    sideBarLink.forEach((navItem) => {
      if (navItem.subItems) {
        const hasActiveSubItem = navItem.subItems.some(
          (subItem) => subItem.route === currentPath
        );
        if (hasActiveSubItem) {
          newExpandedMenus[navItem.key] = true;
        }
      }
    });

    setExpandedMenus(newExpandedMenus);
  }, [location.pathname]);

  // Check if current route matches the link
  const isActiveLink = (route) => {
    return location.pathname === route;
  };

  // Check if any submenu item is active
  const hasActiveSubItem = (navItem) => {
    if (!navItem.subItems) return false;
    return navItem.subItems.some((subItem) => isActiveLink(subItem.route));
  };

  // Handle main menu click
  const handleMainMenuClick = (navItem, e) => {
    if (navItem.subItems) {
      // Prevent navigation for items with submenus
      e.preventDefault();
      
      // Toggle submenu expansion
      setExpandedMenus((prev) => ({
        ...prev,
        [navItem.key]: !prev[navItem.key],
      }));
      
      // Navigate to main route
      navigate(navItem.route);
    }
  };

  // Get current page name for header
  const getCurrentPageName = () => {
    const currentPath = location.pathname;
    
    // Check main routes first
    const mainRoute = sideBarLink.find((link) => link.route === currentPath);
    if (mainRoute) return mainRoute.name;
    
    // Check sub routes
    for (const navItem of sideBarLink) {
      if (navItem.subItems) {
        const subRoute = navItem.subItems.find((sub) => sub.route === currentPath);
        if (subRoute) return subRoute.name;
      }
    }
    
    return "Page";
  };

  return (
    <div className="w-screen h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-blue-600 h-screen shadow-xl">
        {/* Header */}
        <div className="h-20 bg-blue-800 flex items-center justify-center px-6">
          <HiLibrary className="w-8 h-8 text-white mr-3" />
          <h1 className="text-white font-bold text-2xl">Book Store</h1>
        </div>

        {/* Navigation */}
        <nav className="py-6">
          <ul className="space-y-1">
            {sideBarLink.map((navItem) => (
              <li key={navItem.key}>
                {/* Main Menu Item */}
                {navItem.subItems ? (
                  <div
                    className={`flex items-center justify-center px-6 py-4 transition-all duration-200 group cursor-pointer ${
                      isActiveLink(navItem.route) || hasActiveSubItem(navItem)
                        ? "bg-blue-800 text-white shadow-lg border-l-4 border-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    }`}
                    onClick={(e) => handleMainMenuClick(navItem, e)}
                  >
                    <span
                      className={`mr-3 transition-colors ${
                        isActiveLink(navItem.route) || hasActiveSubItem(navItem)
                          ? "text-white"
                          : "text-blue-200 group-hover:text-white"
                      }`}
                    >
                      {navItem.icon}
                    </span>
                    <span className="text-lg font-medium flex-1 text-center">{navItem.name}</span>
                    <span className="transition-transform duration-200">
                      {expandedMenus[navItem.key] ? (
                        <FaChevronDown className="w-4 h-4" />
                      ) : (
                        <FaChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={navItem.route}
                    className={`flex items-center justify-center px-6 py-4 transition-all duration-200 group ${
                      isActiveLink(navItem.route)
                        ? "bg-blue-800 text-white shadow-lg border-l-4 border-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    <span
                      className={`mr-3 transition-colors ${
                        isActiveLink(navItem.route)
                          ? "text-white"
                          : "text-blue-200 group-hover:text-white"
                      }`}
                    >
                      {navItem.icon}
                    </span>
                    <span className="text-lg font-medium">{navItem.name}</span>
                  </Link>
                )}

                {/* Submenu Items */}
                {navItem.subItems && expandedMenus[navItem.key] && (
                  <ul className="bg-blue-700">
                    {navItem.subItems.map((subItem) => (
                      <li key={subItem.key}>
                        <Link
                          to={subItem.route}
                          className={`flex items-center px-12 py-3 transition-all duration-200 group ${
                            isActiveLink(subItem.route)
                              ? "bg-blue-800 text-white shadow-lg border-l-4 border-white"
                              : "text-blue-100 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          <span
                            className={`mr-3 transition-colors ${
                              isActiveLink(subItem.route)
                                ? "text-white"
                                : "text-blue-200 group-hover:text-white"
                            }`}
                          >
                            {subItem.icon}
                          </span>
                          <span className="text-sm font-medium">{subItem.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {getCurrentPageName()}
          </h2>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;