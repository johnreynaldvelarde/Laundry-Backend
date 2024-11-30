const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph:
    "font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",

  /*  Text Color or Button Color */
  textColor1: "#5787C8",
  textColor2: "#595959",

  /* Input Box Focus Color */
  inputBorderColor1: "#5787C8",

  buttonColor1: "#5787C8",

  /*  Font and Typography */
  biggestFontSize: "2.5rem",
  h1FontSize: "1.5rem",
  h2FontSize: "1.25rem",
  h3FontSize: "1rem",
  normalFontSize: ".938 rem",
  smallFontSize: ".813rem",
  smallestFontSize: ".75rem",

  // Admin Color
  backgroundColor1: "#f1f1f1",

  // COLORS VARIATIONS

  // Basic colors
  white: "#FFFFFF",
  black: "#222222",
  light: "#F5F5F5",
  divider: "#ddd",

  // Text Colors
  text1: "#161616",
  text2: "#2C2C2C",
  text3: "#393939",

  // Primary and Secondary colors
  primary: "#595959",
  secondary: "#5787C8",
  secondaryHover: "#3D6F9B",

  // Status Colors
  success: "#28a745", // For success messages or indicators
  error: "#dc3545", // For error messages or alerts
  warning: "#ffc107", // For warning alerts
  info: "#17a2b8", // For informational messages
  pending: "#f0ad4e", // For pending status (added color for Pending)

  // Grays
  grayLight: "#f8f9fa",
  grayMedium: "#6c757d",
  grayDark: "#343a40",

  // Accent Colors
  accent: "#ff7f50", // Optional accent color for special components

  // Background and Border Colors
  background: "#f4f4f4",
  border: "#e0e0e0",
  border1: "#ccc",

  // Colors Additonal
  message: "#F23F42",
  online: "#23A55A",
  idle: "#F0B232",

  lightgray: "#D3D3D3",

  // Disable Button
  disableButtonBg: "#E5E5E5",
  disableButtonTxt: "#B0B0B0",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;

// Wave Svg - later we will use it
/* <div className="absolute inset-x-0 bottom-0 z-0">
      <svg
        className="block w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill={`${darkMode ? "#334155" : "white"}`}
          fillOpacity="1"
          d="M0,224L40,240C80,256,160,288,240,293.3C320,299,400,277,480,261.3C560,245,640,235,720,240C800,245,880,267,960,277.3C1040,288,1120,288,1200,261.3C1280,235,1360,181,1400,154.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div> */
