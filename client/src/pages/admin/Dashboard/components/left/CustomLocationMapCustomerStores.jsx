import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Box, Paper, Typography } from "@mui/material";
import { COLORS } from "../../../../../constants/color";
import customer_mark from "../../../../../assets/images/customer_mark.png";
import store_mark from "../../../../../assets/images/store_mark_location.png"; // Main store marker icon
import useFetchData from "../../../../../hooks/common/useFetchData";
import { getListStoreAndCustomerLocation } from "../../../../../services/api/getApi";
import L from "leaflet";

const CustomLocationMapCustomerStores = () => {
  const [latitude, setLatitude] = useState(14.814821);
  const [longitude, setLongitude] = useState(120.91127);
  const [loading, setLoading] = useState(true);
  const { data, fetchData: fetchStoreAndCustomerLocation } = useFetchData();

  const fetchStoreAndCustomerLocationData = useCallback(async () => {
    setLoading(true);
    await fetchStoreAndCustomerLocation(
      getListStoreAndCustomerLocation.getStoreCustomerLocation
    );
    setLoading(false);
  }, [fetchStoreAndCustomerLocation]);

  useEffect(() => {
    fetchStoreAndCustomerLocationData();
    // const interval = setInterval(() => {

    // }, 20000);

    // return () => clearInterval(interval);
  }, [fetchStoreAndCustomerLocationData]);

  // Default icons for main store and customer
  const defaultStoreIcon = new L.Icon({
    iconUrl: store_mark, // Main store icon
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const defaultCustomerIcon = new L.Icon({
    iconUrl: customer_mark, // Customer icon
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Function to check if two locations are close enough to be considered the same
  const isLocationClose = (lat1, lon1, lat2, lon2, threshold = 0.0001) => {
    return (
      Math.abs(lat1 - lat2) < threshold && Math.abs(lon1 - lon2) < threshold
    );
  };

  return (
    <Paper
      sx={{
        p: 5,
        boxShadow: "none",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: "14px",
      }}
    >
      <Typography fontWeight={600} color={COLORS.primary} fontSize={20}>
        Map of Customer and Store Locations
      </Typography>

      <Box mt={5}>
        <Box
          sx={{
            flex: "0 0 auto",
            height: "500px",
            width: "100%",
            padding: 1,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <MapContainer
            center={[latitude, longitude]} // Store location is the center
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Main store markers */}
            {data?.stores?.map((store) => (
              <Marker
                key={store.store_id}
                position={[store.store_latitude, store.store_longitude]}
                icon={defaultStoreIcon}
              >
                <Popup>{store.store_name}</Popup>
              </Marker>
            ))}
            {/* 
            <Circle
              center={[latitude, longitude]}
              radius={6000}
              color={COLORS.secondary}
              fillColor="rgba(0, 0, 255, 0.2)"
              fillOpacity={0.1}
              weight={2}
            >
              <Popup>Radar Zone</Popup>
            </Circle> */}

            {data?.customers?.map((customer, index) => {
              const isDuplicate = data.customers
                .slice(0, index)
                .some((existingCustomer) =>
                  isLocationClose(
                    customer.customer_latitude,
                    customer.customer_longitude,
                    existingCustomer.customer_latitude,
                    existingCustomer.customer_longitude
                  )
                );

              return !isDuplicate ? (
                <Marker
                  key={customer.user_id}
                  position={[
                    customer.customer_latitude,
                    customer.customer_longitude,
                  ]}
                  icon={defaultCustomerIcon}
                >
                  <Popup>{customer.full_name}</Popup>
                </Marker>
              ) : null;
            })}
          </MapContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default CustomLocationMapCustomerStores;
