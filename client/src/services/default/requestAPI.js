import axios from 'axios';

const API_URL = "http://localhost:3002/api";

// Function to fetch user profile
const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
    const { user } = response.data;

    console.log('User profile:', user);
    // Use user data in your application
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};


export { fetchUserProfile };


