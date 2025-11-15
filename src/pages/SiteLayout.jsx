import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import BottomNavigation from "../components/custom/BottomNavigation";
import AppBar from "../components/custom/AppBar";

const SiteLayout = () => {
  // Media query para determinar se estamos em mobile
  const isMobile = useMediaQuery("(max-width:600px)");
  const bottomPadding = isMobile ? "56px" : "0px";

  return (
    <Box
      // O Box principal encapsula todo o layout
      sx={{
        minHeight: "100vh",
        paddingBottom: bottomPadding,
        background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
      }}
    >
      {!isMobile && <AppBar />}

      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>

      {isMobile && <BottomNavigation />}
    </Box>
  );
};

export default SiteLayout;
