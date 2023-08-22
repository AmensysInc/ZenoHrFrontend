import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const capitalizeFirstLetter = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const nameToShow = isLast
            ? capitalizeFirstLetter(name)
            : capitalizeFirstLetter(params[name] || name);

          if (isLast) {
            return (
              <li key={index} className="breadcrumb-item active" aria-current="page">
                {nameToShow}
              </li>
            );
          } else if (name.toLowerCase() === "orders") {
            
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else if (name.toLowerCase() === "tracking") {
            
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else if (name.toLowerCase() === "project-history") {
            
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else if (name.toLowerCase() === "visa-details") {
            
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          }else if (name.toLowerCase() === "editemployee") {
            
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else if (name.toLowerCase() === "withholdSheet") {
            
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          }else {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            return (
              <li key={index} className="breadcrumb-item">
                <Link to={routeTo}>{nameToShow}</Link>
              </li>
            );
          }
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
