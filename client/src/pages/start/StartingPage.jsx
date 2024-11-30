import React, { useEffect, useState, useRef } from "react";

import LandingNavbar from "../../components/landing-page/LandingNavbar";
import PopupCreateAccount from "../../components/common/PopupCreateAccount";
import PopupLogin from "../../components/common/PopupLogin";
import Home from "../../components/landing-page/Home";
import Features from "../../components/landing-page/Features";
import Pricing from "../../components/landing-page/Pricing";
// import Services from "../../components/landing-page/Services";
import Footer from "../../components/landing-page/Footer";
import About from "../../components/landing-page/about-f/About";
import Contact from "../../components/landing-page/Contact";

const StartingPage = () => {
  const [showLoginPopup, setLoginShowPopup] = useState(false);
  const [showCreateAccountPopup, setShowCreateAccountPopup] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);

  const handleLoginPopup = () => {
    setLoginShowPopup(true);
  };

  const handleCreateAccountPopup = () => {
    setShowCreateAccountPopup(true);
  };

  // Set up the observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.4 }
    ); // Adjust threshold as needed

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <>
      <LandingNavbar
        HandleLoginPopup={handleLoginPopup}
        HandleCreateAccountPopup={handleCreateAccountPopup}
        activeIndex={activeIndex}
      />
      <div className="bg-[#f1f1f1]">
        <div id="#" ref={(el) => (sectionRefs.current[0] = el)}>
          <Home
            HandleLoginPopup={handleLoginPopup}
            HandleCreateAccountPopup={handleCreateAccountPopup}
          />
        </div>
        <div id="features" ref={(el) => (sectionRefs.current[1] = el)}>
          <Features />
        </div>
        {/* <div id="services" ref={(el) => (sectionRefs.current[2] = el)}>
          <Services />
        </div> */}
        <div id="pricing" ref={(el) => (sectionRefs.current[2] = el)}>
          <Pricing />
        </div>
        <div id="about" ref={(el) => (sectionRefs.current[3] = el)}>
          <About />
        </div>
        <div id="contact" ref={(el) => (sectionRefs.current[4] = el)}>
          <Contact />
        </div>

        <PopupLogin
          showLoginPopup={showLoginPopup}
          setLoginShowPopup={setLoginShowPopup}
        />
        <PopupCreateAccount
          showCreateAccountPopup={showCreateAccountPopup}
          setShowCreateAccountPopup={setShowCreateAccountPopup}
        />
      </div>
      <Footer />
    </>
  );
};

export default StartingPage;
