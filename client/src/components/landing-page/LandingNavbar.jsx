import { useState } from "react";
import logo from "../../assets/images/logo.png";
import m_1 from "../../assets/images/1.png";
import { navItems } from "../../constants/index";
import MenuIcon from "@mui/icons-material/Menu";
import X from "@mui/icons-material/Close";
import styles from "../../style";

const LandingNavbar = ({
  HandleLoginPopup,
  HandleCreateAccountPopup,
  activeIndex,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg bg-white bg-opacity-80 border-b border-neutral-700/40">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-12 w-12 mr-1 mb-2" src={logo} alt="logo" />
            <span className="text-xl tracking-tight">
              <span className="font-bold" style={{ color: styles.textColor1 }}>
                Lizaso
              </span>
              <span
                className="font-regular"
                style={{ color: styles.textColor2 }}
              >
                {" "}
                Laundry Hub
              </span>
            </span>
          </div>
          <ul
            className="hidden lg:flex ml-14 space-x-10 font-medium"
            style={{ color: styles.textColor2, fontSize: styles.h3FontSize }}
          >
            {navItems.map((item, index) => (
              <li key={index} className="relative">
                <a
                  href={item.href}
                  style={{
                    color:
                      activeIndex === index
                        ? styles.buttonColor1
                        : styles.textColor2,
                  }}
                >
                  {item.label}
                </a>
                {/* Add the blue line below the active item */}
                <div
                  className={`absolute left-0 right-0 bottom-[-5px] h-[2px] bg-[#5787C8] transition-all duration-300 ${
                    activeIndex === index ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{
                    transformOrigin: "left",
                    transition: "transform 0.3s ease-in-out",
                  }}
                ></div>
              </li>
            ))}
          </ul>
          <div
            className="hidden lg:flex justify-center space-x-6 items-center"
            style={{ color: styles.textColor1 }}
          >
            <button
              onClick={HandleLoginPopup}
              className="py-2 px-5 border rounded-3xl"
              style={{ borderColor: styles.buttonColor1 }}
            >
              Sign In
            </button>
            <button
              onClick={HandleCreateAccountPopup}
              className="text-white  py-2 px-5 rounded-3xl shadow-md"
              style={{ background: styles.buttonColor1 }}
            >
              Create Account
            </button>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <>
            <div
              className="fixed left-0 z-10 w-full p-10 flex flex-col justify-center items-center lg:hidden border-b-2 border-gray-300"
              style={{
                backgroundImage: `url(${m_1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                backgroundColor: styles.divider,
                top: "73px",
              }}
            >
              <ul
                style={{
                  fontSize: styles.h3FontSize,
                  color: styles.primary,
                  fontWeight: 500,
                }}
              >
                {navItems.map((item, index) => (
                  <li key={index} className="py-4">
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-6 mt-5">
                <button
                  onClick={HandleLoginPopup}
                  className="py-2 px-5 border rounded-3xl text-white"
                  style={{
                    borderColor: styles.buttonColor1,
                    color: styles.secondary,
                    fontWeight: 500,
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={HandleCreateAccountPopup}
                  className="text-white py-2 px-5 rounded-3xl shadow-md"
                  style={{ background: styles.buttonColor1, fontWeight: 500 }}
                >
                  Create Account
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
