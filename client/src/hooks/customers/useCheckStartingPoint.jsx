import { useState, useRef, useEffect } from "react";
import useAuth from "../../contexts/AuthContext";
import { viewStore } from "../../services/api/getApi";
import { updateCustomerBasicInformation } from "../../services/api/putApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Function to fetch latitude and longitude from an address using Nominatim API
const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await response.json();
  if (data.length > 0) {
    const location = data[0];
    return { lat: location.lat, lng: location.lon };
  }
  return null;
};

const useCheckStartingPoint = () => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const hasFetchedRef = useRef(false);

  // Step 1
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [country, setCountry] = useState("PH");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setRegion("");
    setCity("");
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setProvince("");
    setCity("");
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setCity("");
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // useEffect(() => {
  //   if (latitude !== null && longitude !== null) {
  //     console.log("Lat: " + latitude + " Lon: " + longitude);
  //   }
  // }, [latitude, longitude]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !addressLine1 ||
      !country ||
      !region ||
      !province ||
      !city ||
      !postalCode
    ) {
      toast.error("Please complete all fields.");
      return;
    }

    const address = `${addressLine1}, ${
      addressLine2 ? addressLine2 + ", " : ""
    }${city}, ${province}, ${postalCode}, ${country}`;

    try {
      // Try to fetch latitude and longitude for the given address
      const location = await geocodeAddress(address);

      if (location) {
        // Set the latitude and longitude
        setLatitude(location.lat);
        setLongitude(location.lng);
        setStep(2); // Proceed to step 2
      } else {
        // If geocode fails, use browser geolocation
        if (navigator.geolocation) {
          console.log("Using browser geolocation...");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
              console.log(`Latitude: ${position.coords.latitude}`);
              console.log(`Longitude: ${position.coords.longitude}`);
              setStep(2); // Proceed to step 2
            },
            (error) => {
              console.error("Error getting location:", error);
              toast.error("Unable to get your location.");
            }
          );
        } else {
          toast.error("Geolocation is not supported by this browser.");
        }
      }
    } catch (error) {
      console.error("Error fetching address or location:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  // Set 2
  const [selectedStore, setSelectedStore] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleStoreSelection = (store) => {
    setSelectedStore(store);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStore) {
      toast.error("Please select a store.");
      return;
    }

    if (!userDetails || !userDetails.userId) {
      console.error("User details are not properly set.");
      return;
    }

    setLoading(true);

    try {
      const storeId = selectedStore.id;
      const customerData = {
        store_id: storeId,
        address_line: addressLine1,
        country: country,
        province: province,
        city: city,
        postal_code: postalCode,
        latitude: latitude,
        longitude: longitude,
      };

      const response =
        await updateCustomerBasicInformation.setCustomerInformation(
          userDetails.userId,
          customerData
        );

      if (response.success) {
        toast.success(response.message);
        navigate("/customer-page/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error updating customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance.toFixed(1);
  };

  const fetchStoreData = async () => {
    try {
      if (latitude === null || longitude === null) {
        console.error("Latitude or Longitude is not set.");
        return;
      }

      const response = await viewStore.getStoreList({});
      const storeList = response.data
        .map((store) => {
          const storeLat = parseFloat(store.latitude);
          const storeLon = parseFloat(store.longitude);

          // Check if storeLat and storeLon are valid numbers
          if (isNaN(storeLat) || isNaN(storeLon)) {
            console.error(
              "Invalid store coordinates:",
              store.latitude,
              store.longitude
            );
            return null;
          }

          const distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            storeLat,
            storeLon
          );

          return { ...store, distance };
        })
        .filter((store) => store !== null); // Filter out any null entries

      // Sort stores by distance
      storeList.sort((a, b) => a.distance - b.distance);

      setStoreData(storeList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching store data:", error);
      setLoading(false);
    }
  };

  return {
    storeData,
    loading,
    step,
    setStep,
    hasFetchedRef,
    latitude,
    longitude,

    // Step 1
    addressLine1,
    addressLine2,
    country,
    region,
    province,
    city,
    postalCode,
    setAddressLine1,
    setAddressLine2,
    setCountry,
    setRegion,
    setProvince,
    setCity,
    setPostalCode,
    handleCountryChange,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleAddressSubmit,

    // Step 2
    selectedStore,
    email,
    phoneNumber,
    setSelectedStore,
    setEmail,
    setPhoneNumber,
    handleStoreSelection,

    //
    handleFinalSubmit,
    fetchStoreData,
  };
};

export default useCheckStartingPoint;
