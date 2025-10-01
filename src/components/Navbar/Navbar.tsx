import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Box,
} from "@mui/material";
import React from "react";
import { CustomDialog } from "../CustomDialog";
import { FavoriteTable } from "./FavoriteTable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { People } from "@mui/icons-material";
import { dialogOpenSubject$ } from "../CustomDialog/CustomDialog";
import { useSelector } from "react-redux";
import { AppStore } from "@/redux/store";

export interface NavbarInterface {}

const Navbar: React.FC<NavbarInterface> = () => {
  const stateFavorites = useSelector((store: AppStore) => store.favorites);

  const handleClick = () => {
    dialogOpenSubject$.setSubject = true;
  };

  return (
    <>
      <CustomDialog>
        <FavoriteTable />
      </CustomDialog>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
        }}
      >
        <Toolbar sx={{ paddingY: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <People sx={{ fontSize: 28, color: "white" }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.5px",
              }}
            >
              People Directory
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            color="inherit"
            aria-label="favorites"
            onClick={handleClick}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Badge
              badgeContent={stateFavorites.length}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#ff4081",
                  color: "white",
                  fontWeight: 600,
                },
              }}
            >
              <FavoriteIcon sx={{ color: "white" }} />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
