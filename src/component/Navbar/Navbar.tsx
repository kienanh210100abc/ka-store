import { AccountCircle, ArrowDropDown } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import LanguageSwitcher from "../LanguageSwitcher";

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const menuItems = [
    ...(user?.role === "ADMIN"
      ? [{ label: "navbar.dashboard", path: "/dashboard" }]
      : []),

    { label: "navbar.tableManagement", path: "/tables" },
    { label: "navbar.orders", path: "/orders" },
    { label: "navbar.dishes", path: "/dishes" },
    { label: "navbar.categories", path: "/categories" },
    { label: "navbar.settings", path: "/settings" },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    // navigate("/");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "black",
          height: "100px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            sx={{
              display: "none",
              "@media (min-width: 850px)": {
                display: "block",
              },
            }}
          >
            <img
              src="/assets/kien-logo-transparent.png"
              alt="kien-logo-transparent"
              style={{ height: "80px", cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Box>

          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: "white",
              display: "flex",
              "@media (min-width: 850px)": {
                display: "none",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginRight: "50px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={(e) =>
              isAuthenticated ? handleMenuClick(e) : navigate("/login")
            }
          >
            {user?.avatar ? (
              <Box
                component="img"
                src={user.avatar}
                alt="avatar"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <AccountCircle />
            )}
            {isAuthenticated && user
              ? `${t("navbar.hello")}, ${user.name}`
              : t("login.title")}
            {isAuthenticated && <ArrowDropDown />}
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => (
                handleMenuClose(),
                console.log(
                  "Navigate to profile with id:",
                  localStorage.getItem("user"),
                ),
                navigate("/profile")
              )}
            >
              {t("navbar.profile")}
            </MenuItem>
            <MenuItem onClick={() => navigate("/changePass")}>
              {t("navbar.changePass")}
            </MenuItem>
            <MenuItem onClick={handleLogout}>{t("navbar.logout")}</MenuItem>
          </Menu>
          <LanguageSwitcher />
        </Box>
      </Box>

      <Box
        onClick={() => setOpen(false)}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          zIndex: 998,
          "@media (min-width: 850px)": {
            display: "none",
          },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "80%",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 999,
          overflowY: "auto",
          boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
          "@media (min-width: 850px)": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Menu
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <Box sx={{ pt: 2 }}>
          {menuItems.map((item, index) => (
            <Box
              key={item.path}
              sx={{
                px: 3,
                py: 2.5,
                color: "white",
                cursor: "pointer",
                borderLeft: "4px solid transparent",
                transition: "all 0.2s ease",
                animation: open
                  ? `slideIn 0.3s ease forwards ${index * 0.05}s`
                  : "none",
                opacity: 0,
                "@keyframes slideIn": {
                  from: { opacity: 0, transform: "translateX(-20px)" },
                  to: { opacity: 1, transform: "translateX(0)" },
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderLeftColor: "white",
                  pl: 4,
                },
              }}
              onClick={() => handleNavigate(item.path)}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                {t(item.label)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default Navbar;
