import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import type { Profile as ProfileType } from "../../services/profileService";
import { profileService } from "../../services/profileService";
import { useAppSelector } from "../../store/hooks";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/authSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import Avatar from "./Avatar";
import {
  validateProfileForm,
  hasErrors,
  type ValidationErrors,
} from "./config";
import ProfileFormField from "./ProfileFormField";

const Profile = () => {
  const { user } = useAppSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    company: "",
    dob: "",
  });
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const { t } = useTranslation();

  useEffect(() => {
    async function getProfile() {
      try {
        if (!user?.id) {
          setError(t("profile.errorUserNotFound"));
          return;
        }

        const profileData = await profileService.getProfile(user.id);
        setProfile(profileData);
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          phoneNumber: profileData.phoneNumber || "",
          address: profileData.address || "",
          company: profileData.company || "",
          dob: profileData.dob?.toString() || "",
        });

        // Convert dob number to Dayjs (format: DDMMYYYY -> Date)
        if (profileData.dob) {
          const dobStr = profileData.dob.toString();
          if (dobStr.length === 8) {
            const day = dobStr.substring(0, 2);
            const month = dobStr.substring(2, 4);
            const year = dobStr.substring(4, 8);
            setDateValue(dayjs(`${year}-${month}-${day}`));
          }
        }

        console.log("Profile data:", profileData);
      } catch (err) {
        setError(t("profile.errorLoadingProfile"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user]);

  const handleUpdateInfor = async () => {
    try {
      if (!user?.id || !profile) {
        setError(t("profile.errorUserNotFound"));
        return;
      }

      // Convert Dayjs to DDMMYYYY format
      let dobNumber: number | undefined = undefined;
      if (dateValue) {
        const day = dateValue.format("DD");
        const month = dateValue.format("MM");
        const year = dateValue.format("YYYY");
        dobNumber = Number(`${day}${month}${year}`);
      }

      // Validate form data trước khi submit
      const errors = validateProfileForm(formData, dobNumber, t);

      // Nếu có lỗi, hiển thị errors và dừng lại
      if (hasErrors(errors)) {
        setValidationErrors(errors);

        return;
      }

      // Clear errors nếu validation pass
      setValidationErrors({});
      setLoading(true);

      const updatedProfile = {
        ...profile,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        company: formData.company,
        dob: dobNumber,
      };

      // Gọi API để update profile
      await profileService.updateInfor(user.id, updatedProfile);

      // Cập nhật Redux store để navbar cập nhật tên
      dispatch(
        updateUser({
          name: updatedProfile.name,
          email: updatedProfile.email,
          phoneNumber: updatedProfile.phoneNumber,
          address: updatedProfile.address,
          company: updatedProfile.company,
          dob: updatedProfile.dob,
        }),
      );

      setProfile(updatedProfile);
      setIsEditing(false);
      setLoading(false);

      // Hiện toast success
      toast.success(
        t("toast.profileUpdateSuccess") || "Cập nhật thông tin thành công!",
        {
          position: "bottom-right",
        },
      );
    } catch (err) {
      console.error("Update error:", err);
      setLoading(false);
      toast.error(t("toast.profileUpdateError") || "Cập nhật thất bại!", {
        position: "bottom-right",
      });
      setError(t("profile.errorUpdatingProfile"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!profile) return null;

  const handleAvatarUpdate = (updatedProfile: ProfileType) => {
    setProfile(updatedProfile);
  };

  return (
    <Grid container spacing={3} sx={{ marginTop: "30px" }}>
      {/* Avatar */}
      <Grid size={{ xs: 12, md: 4, lg: 3 }}>
        <Avatar profile={profile} onAvatarUpdate={handleAvatarUpdate} />
      </Grid>

      {/* Thông tin cá nhân */}
      <Grid sx={{ color: "black" }} size={{ xs: 12, md: 8, lg: 9 }}>
        <form noValidate autoComplete="off">
          <FormControl
            sx={{
              width: { xs: "auto", sm: "95%", md: "90%" },
              justifyContent: "center",
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
              px: { xs: 2, sm: 0 },
            }}
          >
            {/* Họ Tên */}
            <ProfileFormField
              label={t("profile.name")}
              name="name"
              value={formData.name}
              placeholder={t("profile.name")}
              disabled={!isEditing}
              error={validationErrors.name}
              onChange={handleChange}
            />

            {/* Email */}
            <ProfileFormField
              label={t("profile.email")}
              name="email"
              value={formData.email}
              placeholder={t("profile.email")}
              disabled={!isEditing}
              error={validationErrors.email}
              onChange={handleChange}
            />

            {/* Số Điện Thoại */}
            <ProfileFormField
              label={t("profile.phone")}
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder={t("profile.phone")}
              disabled={!isEditing}
              error={validationErrors.phoneNumber}
              onChange={handleChange}
            />

            {/* Địa Chỉ */}
            <ProfileFormField
              label={t("profile.address")}
              name="address"
              value={formData.address}
              placeholder={t("profile.address")}
              disabled={!isEditing}
              error={validationErrors.address}
              onChange={handleChange}
            />

            {/* Công Ty */}
            <ProfileFormField
              label={t("profile.company")}
              name="company"
              value={formData.company}
              placeholder={t("profile.company")}
              disabled={!isEditing}
              error={validationErrors.company}
              onChange={handleChange}
            />

            {/* Ngày Sinh */}
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: { xs: 0.5, sm: 2 },
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  width: { xs: "100%", sm: "150px" },
                  mb: { xs: 0.5, sm: 0 },
                }}
              >
                {t("profile.dob")}:
              </Typography>
              <Box
                sx={{
                  width: { xs: "100%", sm: "calc(100% - 150px - 16px)" },
                  flex: { sm: 1 },
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dateValue}
                    onChange={(newValue) => setDateValue(newValue)}
                    disabled={!isEditing}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        sx: { width: { xs: "calc(100% - 10px)", sm: "100%" } },
                        placeholder: t("profile.dob"),
                        error: !!validationErrors.dob,
                      },
                    }}
                  />
                </LocalizationProvider>
                {validationErrors.dob && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ ml: 1.5, mt: 0.5, display: "block" }}
                  >
                    {validationErrors.dob}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mt: 3,
              }}
            >
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsEditing(true);
                    setValidationErrors({}); // Reset errors khi bắt đầu edit
                  }}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      opacity: 0.9,
                    },
                    width: { xs: "auto", sm: "auto" },
                    px: 4,
                  }}
                >
                  {t("button.edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleUpdateInfor}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        opacity: 0.9,
                      },
                      width: { xs: "auto", sm: "auto" },
                      px: 4,
                    }}
                  >
                    {t("button.save")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setValidationErrors({}); // Reset errors khi cancel
                    }}
                    sx={{
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        borderColor: "#764ba2",
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                      },
                      width: { xs: "auto", sm: "auto" },
                      px: 4,
                    }}
                  >
                    {t("button.cancel")}
                  </Button>
                </>
              )}
            </Box>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};

export default Profile;
