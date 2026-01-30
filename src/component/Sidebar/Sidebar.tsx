import { useState, useEffect } from "react";
import { Box, Tooltip, Typography, Collapse } from "@mui/material";
import {
  Home,
  Mail,
  Settings,
  ChevronLeft,
  ExpandMore,
  MoreHoriz,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ImgIcon = ({
  src,
  alt,
  size = 30,
}: {
  src: string;
  alt: string;
  size?: number;
}) => <img src={src} alt={alt} style={{ width: size, height: size }} />;

const Sidebar = ({ onToggle }: { onToggle?: (expanded: boolean) => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => onToggle?.(isExpanded), [isExpanded, onToggle]);

  const menuItems = [
    { text: t("sidebar.products"), icon: <Home />, path: "/" },
    {
      text: t("sidebar.shoes"),
      // icon: <ImgIcon src={shoes} alt="shoes" />,
      dropdown: "shoes",
      subItems: [
        {
          text: t("sidebar.footballshoes"),
          path: "/shoes?sport=football",
          // icon: <ImgIcon src={soccer} alt="football" />,
        },
        {
          text: t("sidebar.badmintonshoes"),
          path: "/shoes?sport=badminton",
          // icon: <ImgIcon src={badminton} alt="badminton" />,
        },
      ],
    },
    {
      text: t("sidebar.clothes"),
      // icon: <ImgIcon src={clothes} alt="clothes" />,
      dropdown: "clothes",
      subItems: [
        {
          text: t("sidebar.footballclothes"),
          path: "/clothes?sport=football",
          // icon: <ImgIcon src={soccer} alt="football" size={24} />,
        },
        {
          text: t("sidebar.badmintonclothes"),
          path: "/clothes?sport=badminton",
          // icon: <ImgIcon src={badminton} alt="badminton" size={24} />,
        },
      ],
    },
    { text: t("sidebar.accessories"), icon: <MoreHoriz />, path: "/accessory" },
    { text: t("sidebar.contact"), icon: <Mail />, path: "/" },
    { text: t("sidebar.about"), icon: <Settings />, path: "/" },
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
        // display: { xs: "none", md: "block" },
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
              fontSize: 20,
              fontWeight: "bold",
              opacity: 1,
              transition: "opacity 0.3s",
            }}
          >
            KA Sport
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
                onClick={() =>
                  item.dropdown
                    ? setOpenDropdowns((prev) => ({
                        ...prev,
                        [item.dropdown]: !prev[item.dropdown],
                      }))
                    : item.path && handleNavigate(item.path)
                }
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
                {item.dropdown && (
                  <ExpandMore
                    sx={{
                      transform: openDropdowns[item.dropdown]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  />
                )}
              </Box>
            </Tooltip>

            {item.dropdown && isExpanded && (
              <Collapse in={openDropdowns[item.dropdown]} timeout={500}>
                <Box>
                  {item.subItems?.map((sub) => (
                    <Box
                      key={sub.path}
                      onClick={() => handleNavigate(sub.path)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        height: 48,
                        p: "0 16px 0 40px",
                        color: "white",
                        cursor: "pointer",
                        fontSize: 14,
                        "&:hover": {
                          opacity: 1,
                          background: "rgba(255,255,255,0.05)",
                          pl: "44px",
                          transform: "translateX(2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      >
                        {/* {sub.icon} */}
                      </Box>
                      <Box sx={{ color: "white" }}>{sub.text}</Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
