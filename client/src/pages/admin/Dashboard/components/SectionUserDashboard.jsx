import React from "react";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import CustomDashHorizontal from "./CustomDashHorizontal";
import CustomTotalRevenueByMonth from "./CustomTotalRevenueByMonth";
import CustomLocationMapCustomerStores from "./left/CustomLocationMapCustomerStores";
import CustomAllSample from "./right/CustomAllSample";
import CustomTopMostUseService from "./right/CustomTopMostUseService";
import CustomRightTopReadyToDelivery from "./left/CustomRightTopReadyToDelivery";
import CustomCustomerMostRequest from "./right/CustomCustomerMostRequest";

const SectionUserDashboard = ({ store_id }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-col sm:flex-row w-full">
        <CustomHeaderTitle
          title={"Dashboard"}
          subtitle={"Overview of Key Metrics and Insights"}
        />
      </div>
      <CustomDashHorizontal />

      {/* Grid Layout for the Dashboard */}
      <div className="mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Left Column with Three Tables */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="mb-3">
              <CustomRightTopReadyToDelivery storeId={store_id} />
            </div>
            <div className="mb-3">
              <CustomTotalRevenueByMonth />
            </div>
          </div>

          {/* Right Column with Paper List */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="mb-3">
              <CustomCustomerMostRequest />
            </div>
            <div className="mb-3">
              <CustomTopMostUseService />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionUserDashboard;
