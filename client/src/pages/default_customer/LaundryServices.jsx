import React, { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../../contexts/AuthContext";
import background_1 from "../../assets/images/background_2.jpg";
import styles from "../../styles/style";
import {
  getCustomerServiceAndPromotions,
  getServicePromoHeader,
} from "../../services/api/customerApi";
import useLaundryPlans from "../../hooks/customers/useLaundryPlans";
import useFetchData from "../../hooks/common/useFetchData";
import { COLORS } from "../../constants/color";
import CustomHeaderPromo from "./components/CustomHeaderPromo";
import CustomerBottomServices from "./components/CustomerBottomServices";

const LaundryServices = () => {
  const { userDetails } = useAuth();
  const { selectedService, setSelectedService } = useLaundryPlans();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { data: services, fetchData: fetchServiceTypeAndPromotions } =
    useFetchData();

  const { data: servicesPromo, fetchData: fetchAvailablePromo } =
    useFetchData();

  const fetchServiceAndPromotionsData = useCallback(async () => {
    setLoading(true);
    if (userDetails.storeId) {
      await fetchServiceTypeAndPromotions(
        getCustomerServiceAndPromotions.getServiceWithPromotions,
        userDetails.storeId
      );
    }
    setLoading(false);
  }, [fetchServiceTypeAndPromotions, userDetails.storeId]);

  const fetchServicePromoAvailablePromoData = useCallback(async () => {
    setIsLoading(true);
    await fetchAvailablePromo(
      getServicePromoHeader.getPromoHeader,
      userDetails.storeId
    );
    setIsLoading(false);
  }, [fetchAvailablePromo, userDetails.storeId]);

  useEffect(() => {
    fetchServiceAndPromotionsData();
    fetchServicePromoAvailablePromoData();
  }, [fetchServiceAndPromotionsData, fetchServicePromoAvailablePromoData]);

  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  const handleClosePopup = () => {
    setSelectedService(null);
  };

  return (
    <>
      <div
        className="bg-green-100"
        style={{
          backgroundImage: `url(${background_1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: styles.border,
        }}
      >
        {/* Upper Section */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center min-h-[300px] py-10">
          {/* Left Side - Regular Services */}
          <div className="flex-1 min-w-[300px] lg:min-w-[700px] max-w-[800px]  mt-5 lg:mt-0">
            <h2 className="text-4xl font-bold text-[#5787C8] mb-4">
              Welcome to Lizaso Laundry Hub
            </h2>
            <p className="text-lg font-semibold text-[#595959] mb-6">
              Choose from our wide range of laundry services that cater to all
              your needs.
            </p>
            <button className="px-6 py-2 bg-[#5787C8] text-white rounded-md hover:bg-[#4A6D94] transition-colors duration-300 ease-in-out">
              Explore Services
            </button>
          </div>

          {/* Right Side - Special Promo Services */}
          <div className="flex-1 min-w-[300px] lg:min-w-[400px] max-w-[800px] flex flex-col justify-center mt-14 lg:mt-0">
            {/* <CustomHeaderPromo
              servicesPromo={servicesPromo}
              loading={loading}
            /> */}
          </div>
        </div>
      </div>

      {/* Below Section */}
      <CustomerBottomServices
        services={services}
        selectedService={selectedService}
        handleSelectService={handleSelectService}
        handleClosePopup={handleClosePopup}
        background_1={background_1}
        loading={isLoading}
      />
    </>
  );
};

export default LaundryServices;
