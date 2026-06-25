// import '../styles/auth.css';

// const AuthLayout = ({ title, subtitle, children }) => {
//   return (
//     <div className="auth-page">
//       <div className="auth-wrapper">
//         <div className="brand-area">
//           <h1 className="brand-title">Fooder</h1>
//           <p className="brand-subtitle">{subtitle}</p>
//           <div className="profile-icon">👤</div>
//         </div>

//         <div className="auth-card">
//           <h2>{title}</h2>
//           {children}
//         </div>

//         <div className="footer-brand">@ The-Fooder</div>
//       </div>
//     </div>
//   );
// };

// export default AuthLayout;
import '../styles/auth.css';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="brand-area">
          <h1 className="brand-title">Fooder</h1>
          <p className="brand-subtitle">{subtitle}</p>
          <div className="profile-icon">👤</div>
        </div>

        <div className="auth-card">
          <h2>{title}</h2>
          {children}
        </div>

        <div className="footer-brand">@ The-Fooder</div>
      </div>
    </div>
  );
};

export default AuthLayout;