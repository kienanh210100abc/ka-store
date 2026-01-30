import { Box, Button, Card, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormContent } from "./Form";
import { authService } from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    company: "",
    dob: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError(t("login.requiredFields"));
      return;
    }

    if (!isSignIn && !formData.fullName) {
      setError(t("login.requiredFields"));
      return;
    }

    setLoading(true);

    try {
      if (isSignIn) {
        // Login
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        // Save to Redux store
        dispatch(
          setCredentials({
            user: response.user,
            token: "logged-in",
          }),
        );

        // Navigate to homepage
        navigate("/");
      } else {
        // Register
        await authService.register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          company: formData.company,
          dob: Number(formData.dob),
        });

        toast.success(t("toast.registerSuccess"), { position: "bottom-right" });

        // Switch to sign in after successful registration
        setIsSignIn(true);
        setFormData({
          fullName: "",
          email: "",
          password: "",
          address: "",
          phoneNumber: "",
          company: "",
          dob: "",
        });
      }
    } catch (err) {
      setError(isSignIn ? t("login.loginError") : t("login.registerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <Card
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          maxWidth: "900px",
          width: "100%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          borderRadius: "10px",
          background: "white",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
            position: "absolute",
            top: 0,
            left: isSignIn ? "50%" : "0",
            width: "42%",
            height: "100%",
            transition: "left 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            zIndex: 2,
          }}
        >
          {/* login (thẻ bên phải) */}
          <Box
            key={isSignIn ? "signin" : "signup"}
            sx={{
              animation: "fadeIn 0.6s ease-in-out 0.3s both",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "scale(0.9)" },
                to: { opacity: 1, transform: "scale(1)" },
              },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              {isSignIn ? t("login.welcomeBack") : t("login.heyThere")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              {isSignIn ? t("login.signInMessage") : t("login.signUpMessage")}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => (setError(""), setIsSignIn(!isSignIn))}
              sx={{
                color: "white",
                borderColor: "white",
                textTransform: "uppercase",
                fontWeight: 600,
                paddingX: 3,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              {isSignIn ? t("login.signUp") : t("login.signIn")}
            </Button>
          </Box>
        </Box>

        {/* login (thẻ bên trái) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: { xs: "30px", md: "40px" },
            gridColumn: { xs: "1", md: "1" },
            opacity: isSignIn ? 1 : 0,
            visibility: isSignIn ? "visible" : "hidden",
            pointerEvents: isSignIn ? "auto" : "none",
            transition: "opacity 0.4s ease 0.4s, visibility 0s linear 0.4s",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {/* form đăng nhập */}
          <FormContent
            showFullName={false}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: { xs: "30px", md: "40px" },
            gridColumn: { xs: "1", md: "2" },
            opacity: !isSignIn ? 1 : 0,
            visibility: !isSignIn ? "visible" : "hidden",
            pointerEvents: !isSignIn ? "auto" : "none",
            transition: "opacity 0.4s ease 0.4s, visibility 0s linear 0.4s",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {/* form đăng ký */}
          <FormContent
            showFullName={true}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
