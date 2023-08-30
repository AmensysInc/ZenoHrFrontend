import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const isUUID = (str) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
  };

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

          if (isUUID(name)) {
            return null;
          } else if (isLast) {
            return (
              <li key={index} className="breadcrumb-item active" aria-current="page">
                {nameToShow}
              </li>
            );
          } else if ([ "withholdSheet"].includes(name.toLowerCase())) {
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else if (name.toLowerCase() === "visa-details") {
            const employeeId = pathnames.at(pathnames.findIndex(x => x.toLowerCase() === "visa-details") - 1);
            return (
              <li key={index} className="breadcrumb-item">
              <Link to={`editemployee/${employeeId}/visa-details`}>
                {nameToShow}
              </Link>
            </li>
            );
          }else if (name.toLowerCase() === "project-history") {
            const employeeId = pathnames.at(pathnames.findIndex(x => x.toLowerCase() === "project-history") - 1);
            return (
              <li key={index} className="breadcrumb-item">
              <Link to={`editemployee/${employeeId}/project-history`}>
                {nameToShow}
              </Link>
            </li>
            );
          }else if (name.toLowerCase() === "tracking") {
            const employeeId = pathnames.at(pathnames.findIndex(x => x.toLowerCase() === "tracking") + 1);
            return (
              <li key={index} className="breadcrumb-item">
              <Link to={`/tracking/${employeeId}`}>
                {nameToShow}
              </Link>
            </li>
            );
          }else if (name.toLowerCase() === "orders") {
            const employeeId = pathnames.at(pathnames.findIndex(x => x.toLowerCase() === "orders") + 1);
            return (
              <li key={index} className="breadcrumb-item">
              <Link to={`/orders/${employeeId}`}>
                {nameToShow}
              </Link>
            </li>
            );
          }else if (name.toLowerCase() === "editemployee") {
            const employeeId = pathnames.at(pathnames.findIndex(x => x.toLowerCase() === "editemployee") + 1);
            return (
              <li key={index} className="breadcrumb-item">
              <Link to={`/editemployee/${employeeId}`}>
                {nameToShow}
              </Link>
            </li>
            );
          }
          return null;
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
