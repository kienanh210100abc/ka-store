import { Facebook, LinkedIn, Twitter } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const SOCIAL_ICONS = [Facebook, LinkedIn, Twitter];

export const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    transition: "all 0.3s ease",
    "&:hover fieldset": { borderColor: "#667eea" },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(102, 126, 234, 0.2)",
    },
  },
};

interface FormContentProps {
  showFullName?: boolean;
  formData: {
    fullName?: string;
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export const FormContent = ({
  showFullName,
  formData,
  handleChange,
  handleSubmit,
  loading = false,
}: FormContentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
        {showFullName ? t("login.createAccount") : t("login.signIn")}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {SOCIAL_ICONS.map((Icon, idx) => (
          <IconButton
            key={idx}
            sx={{
              color: "#667eea",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                transform: "scale(1.1)",
              },
            }}
          >
            <Icon />
          </IconButton>
        ))}
      </Stack>
      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
        {showFullName ? "" : t("login.orUseEmail")}
      </Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        {showFullName && (
          <TextField
            fullWidth
            required
            placeholder={t("login.fullName")}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            size="small"
            sx={inputStyles}
          />
        )}
        <TextField
          fullWidth
          required
          placeholder={t("login.email")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          size="small"
          sx={inputStyles}
        />
        <TextField
          fullWidth
          required
          placeholder={t("login.password")}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          size="small"
          sx={inputStyles}
        />
        {!showFullName && (
          <Link
            href="#"
            sx={{
              fontSize: "14px",
              color: "#667eea",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline", color: "#764ba2" },
            }}
          >
            {t("login.forgotPassword")}
          </Link>
        )}
      </Stack>
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textTransform: "uppercase",
          fontWeight: 600,
          padding: "10px",
          borderRadius: "5px",
          transition: "all 0.3s",
          "&:hover": {
            opacity: 0.9,
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
          },
          "&:disabled": {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            opacity: 0.6,
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : showFullName ? (
          t("login.signUp")
        ) : (
          t("login.signIn")
        )}
      </Button>
    </>
  );
};
