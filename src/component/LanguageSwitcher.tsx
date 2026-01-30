import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const currentLanguage =
    i18n.language === "vi" ? t("navbar.Vi") : t("navbar.EN");

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{ color: "white" }}
      >
        {currentLanguage}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleLanguageChange("vi")}>
          {t("navbar.Vi")}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("en")}>
          {t("navbar.EN")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
