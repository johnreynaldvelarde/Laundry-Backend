import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import CustomHeaderTitle from "../../../../components/common/CustomHeaderTitle";
import CustomAddButton from "../../../../components/common/CustomAddButton";
import { COLORS } from "../../../../constants/color";
import { PlusCircle } from "@phosphor-icons/react";

import styled from "@emotion/styled";

import BarChart from "../../../../components/sales/charts/BarChart";
import Stats from "../../../../components/sales/stats/Stats";
import TopCountries from "../../../../components/sales/stats/TopCountries";
import TransactionCustomer from "../../../../components/sales/stats/TransactionCustomer";
import Table from "../../../../components/common/Table";
import { orders, ordersColumns } from "../../../../data/orders";

const SectionUserDashboard = ({ store_id }) => {
  const ComponentWrapper = styled(Box)({
    marginTop: "10px",
    paddingBottom: "10px",
  });
  return (
    <>
      {/* Header */}
      <Box
        className="flex items-center justify-between mb-8"
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          width: "100%",
        }}
      >
        <CustomHeaderTitle
          title={"Dashboard"}
          subtitle={"Overview of Key Metrics and Insights"}
        />
      </Box>

      <Box>
        <ComponentWrapper>
          <Stats />
        </ComponentWrapper>
        <ComponentWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <BarChart />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  boxShadow: "none !important",
                  borderRadius: "12px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <TopCountries />
              </Paper>
            </Grid>
          </Grid>
        </ComponentWrapper>
        <ComponentWrapper>
          <TransactionCustomer />
        </ComponentWrapper>

        <ComponentWrapper>
          <Typography variant="h5" sx={{ my: 3 }}>
            Latest Orders
          </Typography>
          <Table
            data={orders}
            fields={ordersColumns}
            numberOfRows={5}
            enableTopToolBar={false}
            enableBottomToolBar={false}
            enablePagination={false}
            enableRowSelection={false}
            enableColumnFilters={false}
            enableEditing={false}
            enableColumnDragging={false}
          />
        </ComponentWrapper>
      </Box>
    </>
  );
};

export default SectionUserDashboard;
