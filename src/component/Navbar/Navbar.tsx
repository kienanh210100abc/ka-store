import { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AccountCircle, ArrowDropDown } from "@mui/icons-material";
import LanguageSwitcher from "../LanguageSwitcher";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/authSlice";

const menuItems = [
  { label: "navbar.products", path: "/" },
  { label: "navbar.shoes", path: "/shoes" },
  { label: "navbar.clothes", path: "/clothes" },
  { label: "navbar.racket", path: "/racket" },
  { label: "navbar.accessory", path: "/accessory" },
];

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate("/login");
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
              display: { xs: "none", sm: "flex" },
              "@media (min-width: 500px)": {
                display: "flex",
              },
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.1)",
              p: "6px 10px",
              borderRadius: "4px",
              "& input::placeholder": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          >
            <input
              type="text"
              placeholder={t("navbar.search")}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                display: "block",
              }}
              onKeyPress={(e) => {
                if (e.key !== "Enter") return;
                const searchTerm = (e.target as HTMLInputElement).value.trim();
                navigate(searchTerm ? `/?search=${searchTerm}` : "/");
              }}
            />
          </Box>
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

      {open && (
        <Box
          sx={{
            position: "fixed",
            top: "100px",
            left: 0,
            width: "100%",
            bgcolor: "black",
            display: "block",
            "@media (min-width: 850px)": {
              display: "none",
            },
            zIndex: 999,
          }}
        >
          {menuItems.map((item) => (
            <Box
              key={item.path}
              sx={{
                px: 3,
                py: 2,
                color: "white",
              }}
              onClick={() => handleNavigate(item.path)}
            >
              <Typography>{t(item.label)}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            display: "block",
            "@media (min-width: 850px)": {
              display: "none",
            },
            top: "100px",
          }}
        />
      )}
    </>
  );
}

export default Navbar;
