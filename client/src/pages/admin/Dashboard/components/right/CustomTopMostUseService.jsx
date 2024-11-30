import React, { useState, useEffect, useCallback } from "react";
import { Paper, Typography, Box, Avatar } from "@mui/material";
import { COLORS } from "../../../../../constants/color";
import useFetchData from "../../../../../hooks/common/useFetchData";
import { getListTopMostUseService } from "../../../../../services/api/getApi";
import wash from "../../../../../assets/images/wash.jpg";
import dry from "../../../../../assets/images/dry.jpg";
import fold from "../../../../../assets/images/fold.jpg";
import wash_dry from "../../../../../assets/images/wash_dry.jpg";
import wash_dry_fold from "../../../../../assets/images/wash_dry_fold.jpg";

const serviceImages = {
  Wash: wash,
  Dry: dry,
  Fold: fold,
  "Wash/Dry": wash_dry,
  "Wash/Dry/Fold": wash_dry_fold,
};

const CustomTopMostUseService = () => {
  const [loading, setLoading] = useState(true);
  const { data: data, fetchData: fethMostUseService } = useFetchData();

  const fethMostUseServiceData = useCallback(async () => {
    setLoading(true);
    await fethMostUseService(getListTopMostUseService.getTopMostUseService);
    setLoading(false);
  }, [fethMostUseService]);

  useEffect(() => {
    fethMostUseServiceData();
  }, [fethMostUseServiceData]);

  return (
    <Paper
      sx={{
        p: 4,
        boxShadow: "none",
        border: 1,
        borderColor: COLORS.border,
        borderRadius: "12px",
        // width: 350, // Adjust width as needed
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={700} color={COLORS.text} variant="h6">
            Top Most Use Services
          </Typography>
          <Typography variant="body2" color={COLORS.primary}>
            Usage
          </Typography>
        </Box>
      </Box>

      <Box>
        {data.length === 0 ? (
          <Typography
            color={COLORS.subtitle}
            fontWeight={500}
            sx={{ textAlign: "center" }}
          >
            No data available
          </Typography>
        ) : (
          data.map((service, index) => {
            const serviceImage = serviceImages[service.service_name];

            return (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {serviceImage ? (
                    <Avatar
                      src={serviceImage}
                      alt={service.service_name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 45,
                        height: 45,
                        mr: 2,
                        bgcolor: COLORS.primary,
                      }}
                    >
                      {service.service_name[0]}
                    </Avatar>
                  )}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: COLORS.secondary }}
                    >
                      {service.service_name}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: COLORS.success }}
                >
                  {service.request_count}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default CustomTopMostUseService;
