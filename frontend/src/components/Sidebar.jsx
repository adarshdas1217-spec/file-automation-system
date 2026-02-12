// import { NavLink } from "react-router-dom";

// const Sidebar = () => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   const role = user?.role;
  

//   return (
//     <aside className="sidebar">
//       <h2 className="sidebar-title">File System</h2>

//       <nav>
//         <ul>
//           {/* FILE SYSTEM */}
//           <li>
//             <NavLink to="/">Dashboard</NavLink>
//           </li>

//           <li>
//             <NavLink to="/files">All Files</NavLink>
//           </li>

//           {/* ACCOUNTS */}
//           {(role === "ACCOUNTS" ||
//             role === "TREASURER" ||
//             role === "HONORARY_SECRETARY" ||
//             role === "ADMIN") && (
//             <>
//               <hr />
//               <li className="section-title">Accounts</li>

//               <li>
//                 <NavLink to="/accounts">Vouchers</NavLink>

//               </li>

//               <li>
//                 <NavLink to="/accounts/payment-register">
//                   Payment Register
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink to="/accounts/savings">Savings</NavLink>
//               </li>

//               <li>
//                 <NavLink to="/accounts/deposits">Deposits</NavLink>
//               </li>
//             </>
//           )}

//           {/* REPORTS */}
//           {(role === "HONORARY_SECRETARY" || role === "ADMIN") && (
//             <>
//               <hr />
//               <li className="section-title">Reports</li>

//               <li>
//                 <NavLink to="/reports/accounts">
//                   Accounts Reports
//                 </NavLink>
//               </li>
//             </>
//           )}
//         </ul>
//       </nav>
//     </aside>
//   );
// };


// export default Sidebar;


import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">File System</h2>

      <nav>
        <ul>
          {/* DASHBOARD */}
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>

          {/* FILES */}
          <li>
            <NavLink to="/files">All Files</NavLink>
          </li>

          {/* ACCOUNTS SECTION */}
          {(role === "ACCOUNTS" ||
            role === "TREASURER" ||
            role === "HONORARY_SECRETARY" ||
            role === "ADMIN") && (
            <>
              <hr />
              <li className="section-title">Accounts</li>

              <li>
                <NavLink to="/accounts">Vouchers</NavLink>
              </li>

              <li>
                <NavLink to="/accounts/payment-register">
                  Payment Register
                </NavLink>
              </li>

              <li>
                <NavLink to="/accounts/savings">Savings</NavLink>
              </li>

              <li>
                <NavLink to="/accounts/deposits">Deposits</NavLink>
              </li>
            </>
          )}

          {/* REPORTS */}
          {(role === "HONORARY_SECRETARY" || role === "ADMIN") && (
            <>
              <hr />
              <li className="section-title">Reports</li>

              <li>
                <NavLink to="/reports/accounts">
                  Accounts Reports
                </NavLink>
              </li>
            </>
          )}

          {/* LOGOUT */}
          <hr />
          <li>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
