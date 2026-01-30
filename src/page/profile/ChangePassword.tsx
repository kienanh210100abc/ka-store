import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks";
import { profileService } from "../../services/profileService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {};

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePassword = (props: Props) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate old password
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Mật khẩu cũ không được để trống";
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới không được để trống";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu cũ";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng", {
        position: "bottom-right",
      });
      return;
    }

    try {
      setLoading(true);
      await profileService.changePassword(
        user.id,
        formData.oldPassword,
        formData.newPassword,
      );

      toast.success("Đổi mật khẩu thành công!", {
        position: "bottom-right",
      });

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Change password error:", error);
      if (error.message === "Old password is incorrect") {
        toast.error("Mật khẩu cũ không chính xác", {
          position: "bottom-right",
        });
      } else {
        toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.", {
          position: "bottom-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 2, sm: 0 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "black",
          mb: 4,
          textAlign: "center",
        }}
      >
        {t("navbar.changePass")}
      </Typography>

      <FormControl
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Old Password */}
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
            {t("changePassword.oldPassword")}:
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPasswords.old ? "text" : "password"}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder={t("changePassword.oldPassword")}
            error={!!errors.oldPassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("old")}
                  edge="end"
                >
                  {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.oldPassword && (
            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.5, mt: 0.5, display: "block" }}
            >
              {errors.oldPassword}
            </Typography>
          )}
        </Box>

        {/* New Password */}
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
            {t("changePassword.newPassword")}:
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPasswords.new ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder={t("changePassword.newPassword")}
            error={!!errors.newPassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("new")}
                  edge="end"
                >
                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.newPassword && (
            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.5, mt: 0.5, display: "block" }}
            >
              {errors.newPassword}
            </Typography>
          )}
        </Box>

        {/* Confirm Password */}
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
            {t("changePassword.confirmPassword")}:
          </Typography>
          <OutlinedInput
            fullWidth
            type={showPasswords.confirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t("changePassword.confirmPassword")}
            error={!!errors.confirmPassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("confirm")}
                  edge="end"
                >
                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.confirmPassword && (
            <Typography
              color="error"
              variant="caption"
              sx={{ ml: 1.5, mt: 0.5, display: "block" }}
            >
              {errors.confirmPassword}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            marginTop: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textTransform: "uppercase",
            fontWeight: 600,
            padding: "12px",
            borderRadius: "8px",
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
          ) : (
            t("navbar.changePass")
          )}
        </Button>
      </FormControl>
    </Box>
  );
};

export default ChangePassword;
