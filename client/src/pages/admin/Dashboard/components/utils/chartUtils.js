export const getLast5Months = () => {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const currentMonthIndex = new Date().getMonth(); // Get current month index (0 = JAN, 11 = DEC)
  const last5Months = [];

  // Loop through the last 5 months starting from the current month
  for (let i = 0; i < 5; i++) {
    const monthIndex = (currentMonthIndex - i + 12) % 12; // Calculate month index, handling wraparound
    last5Months.push(months[monthIndex]); // Add to the end of the array to maintain the order
  }

  return last5Months.reverse(); // Reverse to get the correct order
};
