import {
  AccountCircle,
  ChevronLeft,
  Dashboard,
  People,
  Settings,
  TableRestaurant,
} from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const Sidebar = ({ onToggle }: { onToggle?: (expanded: boolean) => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => onToggle?.(isExpanded), [isExpanded, onToggle]);

  const menuItems = [
    ...(user?.role === "ADMIN"
      ? [
          {
            text: t("sidebar.dashboard"),
            icon: <Dashboard />,
            path: "/dashboard",
          },
        ]
      : []),
    {
      text: t("sidebar.tableManagement"),
      icon: <TableRestaurant />,
      path: "/tables",
    },

    ...(user?.role === "ADMIN"
      ? [
          {
            text: t("sidebar.staff"),
            icon: <People />,
            path: "/staff",
          },
        ]
      : []),
    {
      text: t("sidebar.settings"),
      icon: <Settings />,
      path: "/settings",
    },
    {
      text: t("sidebar.account"),
      icon: <AccountCircle />,
      path: "/profile",
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <Box
      sx={{
        width: isExpanded ? 280 : 70,
        height: "calc(100vh - 100px)",
        bgcolor: "black",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "fixed",
        top: 100,
        left: 0,
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 999,
        "@media (max-width: 850px)": { display: "none" },
        boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: "16px 0",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            display: "flex",
            cursor: "pointer",
            mr: isExpanded ? 1.5 : 0,
            p: 0.5,
            borderRadius: "50%",
            transition,
            "&:hover": {
              background: "rgba(255,255,255,0.08)",
              transform: isExpanded
                ? "scale(1.1)"
                : "scale(1.1) rotate(180deg)",
            },
          }}
        >
          <ChevronLeft
            sx={{
              color: "white",
              transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </Box>
        {isExpanded && (
          <Typography
            sx={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              opacity: 1,
              transition: "opacity 0.3s",
              textAlign: "center",
            }}
          >
            KA Food&Chill
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, pt: "20px" }}>
        {menuItems.map((item, i) => (
          <Box
            key={item.text}
            sx={{
              animation: "slideIn 0.3s ease forwards",
              animationDelay: `${i * 0.05}s`,
              opacity: 0,
              "@keyframes slideIn": {
                from: { opacity: 0, transform: "translateX(-20px)" },
                to: { opacity: 1, transform: "translateX(0)" },
              },
            }}
          >
            <Tooltip title={!isExpanded ? item.text : ""} placement="right">
              <Box
                onClick={() => item.path && handleNavigate(item.path)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "16px 0",
                  pl: isExpanded ? "24px" : "20px",
                  pr: isExpanded ? "16px" : 0,
                  color: "white",
                  cursor: "pointer",
                  transition,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    pl: isExpanded ? "28px" : "24px",
                    transform: "translateX(2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      minWidth: 30,
                      display: "flex",
                      justifyContent: "center",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.15)" },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box
                    sx={{
                      fontSize: 15,
                      whiteSpace: "nowrap",
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded
                        ? "translateX(0)"
                        : "translateX(-10px)",
                      transition,
                      color: "white",
                    }}
                  >
                    {item.text}
                  </Box>
                </Box>
              </Box>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
