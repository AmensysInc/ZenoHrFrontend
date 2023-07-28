import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// import { AiFillHome } from "react-icons/ai";

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
            // Handle "Orders" link differently to navigate back to PurchaseOrder page
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else if (name.toLowerCase() === "tracking") {
            // Handle "Tracking" link differently to navigate back to WithHoldTracking page
            return (
              <li key={index} className="breadcrumb-item">
                <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
                  {nameToShow}
                </span>
              </li>
            );
          } else {
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

// import React from "react";
// import { Link, useLocation, useParams } from "react-router-dom";

// const Breadcrumb = () => {
//   const location = useLocation();
//   const params = useParams();
//   const pathnames = location.pathname.split("/").filter((x) => x);

//   const capitalizeFirstLetter = (string) => {
//     if (string) {
//       return string.charAt(0).toUpperCase() + string.slice(1);
//     }
//     return "";
//   };

//   return (
//     <nav aria-label="breadcrumb">
//       <ol className="breadcrumb">
//         <li className="breadcrumb-item">
//           <Link to="/">Home</Link>
//         </li>
//         {pathnames.map((name, index) => {
//           const isLast = index === pathnames.length - 1;
//           const nameToShow = isLast ? capitalizeFirstLetter(name) : capitalizeFirstLetter(params[name] || name);
//           if (isLast) {
//             return (
//               <li key={index} className="breadcrumb-item active" aria-current="page">
//                 {nameToShow}
//               </li>
//             );
//           } else if (name.toLowerCase() === "orders") {
//             // Handle "Orders" link differently to navigate back to PurchaseOrder page
//             return (
//               <li key={index} className="breadcrumb-item">
//                 <span onClick={() => window.history.back()} style={{ cursor: "pointer" }}>
//                   {nameToShow}
//                 </span>
//               </li>
//             );
//           } else {
//             const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
//             return (
//               <li key={index} className="breadcrumb-item">
//                 <Link to={routeTo}>{nameToShow}</Link>
//               </li>
//             );
//           }
//         })}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumb;


/*
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
          const nameToShow = isLast ? capitalizeFirstLetter(name) : capitalizeFirstLetter(params[name] || name);
          return isLast ? (
            <li key={index} className="breadcrumb-item active" aria-current="page">
              {nameToShow}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item">
              <Link to={`/${pathnames.slice(0, index + 1).join("/")}`}>{nameToShow}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
*/

/*
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
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const nameToShow = isLast ? capitalizeFirstLetter(name) : capitalizeFirstLetter(params[name]);
          return isLast ? (
            <li key={index} className="breadcrumb-item active" aria-current="page">
              {nameToShow}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item">
              <Link to={routeTo}>{nameToShow}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
*/


/*
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <li key={index} className="breadcrumb-item active" aria-current="page">
              {name}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item">
              <Link to={routeTo}>{name}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
*/
