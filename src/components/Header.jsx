import { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const user = cookies.currentuser;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    removeCookie("currentuser");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#0a0a0d",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1.5 }}>
        <Box
         onClick={() => navigate("/courts")}
         sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
         >
          <SportsTennisIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>
            DBC Badminton Court
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAdmin && (
            <Tooltip title="Manage Users">
              <IconButton onClick={() => navigate("/manage-users")}>
                <ManageAccountsIcon />
              </IconButton>
            </Tooltip>
          )}

        <Tooltip
  title={isAdmin ? "Booking Management" : "My Bookings"}
>
  <IconButton
    onClick={() => {
      if (isAdmin) {
        navigate("/admin/bookings");
      } else {
        navigate("/my-bookings");
      }
    }}
  >
    <NotificationsNoneIcon />
  </IconButton>
</Tooltip>
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 5,
              pl: 0.5,
              pr: 1,
              py: 0.5,
            }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <PersonOutlineIcon fontSize="small" />
            </Avatar>
            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 260,
                  backgroundColor: "#1a1a22",
                  border: "1px solid rgba(255,255,255,0.08)",
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
              <Avatar sx={{ width: 56, height: 56, mx: "auto", mb: 1 }}>
                <PersonOutlineIcon />
              </Avatar>
              <Typography fontWeight={600}>
                {user?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || ""}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile/edit"); }}>
              <PersonOutlineIcon fontSize="small" sx={{ mr: 1.5 }} />
              Edit Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile/reset-password"); }}>
              <LockResetIcon fontSize="small" sx={{ mr: 1.5 }} />
              Reset Password
            </MenuItem>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            <MenuItem onClick={handleLogout} sx={{ color: "#f87171" }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;