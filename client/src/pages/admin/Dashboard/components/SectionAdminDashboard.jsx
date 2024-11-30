import React from "react";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import CustomDashHorizontal from "./CustomDashHorizontal";
import CustomTopNewCustomer from "./CustomTopNewCustomer";
import CustomTotalRevenueByMonth from "./CustomTotalRevenueByMonth";
import CustomLocationMapCustomerStores from "./left/CustomLocationMapCustomerStores";
import CustomTopMostUseService from "./right/CustomTopMostUseService";
import CustomRightTopReadyToDelivery from "./left/CustomRightTopReadyToDelivery";
import CustomAllSample from "./right/CustomAllSample";
import CustomCustomerMostRequest from "./right/CustomCustomerMostRequest";

const SectionAdminDashboard = ({ store_id }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-col sm:flex-row w-full">
        <CustomHeaderTitle
          title={"Dashboard"}
          subtitle={"Overview of Key Metrics and Insights"}
        />
      </div>
      {/* Key Metrics */}
      <CustomDashHorizontal />
      <div className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="mb-5">
              <CustomTotalRevenueByMonth />
            </div>
            <div className="mb-5">
              <CustomRightTopReadyToDelivery storeId={store_id} />
            </div>
            <div className="mb-5">
              <CustomLocationMapCustomerStores />
            </div>
          </div>

          {/* Right Column with Paper List */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <CustomTopMostUseService />
            </div>
            <div className="mb-5">
              <CustomCustomerMostRequest />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionAdminDashboard;
