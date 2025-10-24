import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

/**
 * Breadcrumb Component
 * @param {Array} items - Array of breadcrumb items: [{ label, path }]
 * @example
 * <Breadcrumb items={[
 *   { label: 'Trang chủ', path: '/' },
 *   { label: 'Sự kiện', path: '/events' },
 *   { label: 'Chi tiết sự kiện' }
 * ]} />
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumb-item">
              {!isLast && item.path ? (
                <>
                  <Link to={item.path} className="breadcrumb-link">
                    {item.label}
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                </>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
