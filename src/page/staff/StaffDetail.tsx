import {
  Close as CloseIcon,
  Edit,
  Delete,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  Business,
  LocationOn,
  Cake,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Avatar,
  TextField,
  IconButton,
} from "@mui/material";
import type { Profile } from "../../services/profileService";
import { useState } from "react";
import { profileService } from "../../services/profileService";
import { useAppDispatch } from "../../store/hooks";
import { fetchAllStaff } from "../../store/staffSlice";
import { t } from "i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  staff: Profile | null;
};

const StaffDetail = ({ open, onClose, staff }: Props) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  if (!staff) return null;

  const currentStaff = isEditing ? editedStaff : staff;

  const handleEdit = () => {
    setEditedStaff({ ...staff });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedStaff(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedStaff) return;

    setLoading(true);
    try {
      await profileService.updateInfor(editedStaff.id, editedStaff);
      await dispatch(fetchAllStaff());
      setIsEditing(false);
      setEditedStaff(null);
      onClose();
    } catch (error) {
      console.error("Failed to update staff:", error);
      alert("Không thể cập nhật thông tin nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;

    setLoading(true);
    try {
      await profileService.deleteProfile(staff.id);
      await dispatch(fetchAllStaff());
      onClose();
    } catch (error) {
      console.error("Failed to delete staff:", error);
      alert("Không thể xóa nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (!editedStaff) return;
    setEditedStaff({
      ...editedStaff,
      [field]: value,
    });
  };

  const roleColor = staff.role === "ADMIN" ? "#667eea" : "#4caf50";
  const roleBgColor = staff.role === "ADMIN" ? "#f0f2ff" : "#e8f5e9";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, border: `3px solid ${roleColor}` },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: roleBgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={currentStaff?.avatar}
            sx={{
              width: 60,
              height: 60,
              border: `3px solid ${roleColor}`,
            }}
          >
            {currentStaff?.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: roleColor }}>
              {currentStaff?.name}
            </Typography>
            <Chip
              label={
                staff.role === "ADMIN" ? t("staff.admin") : t("staff.employee")
              }
              size="small"
              icon={<Person sx={{ color: "white" }} />}
              sx={{
                mt: 0.5,
                bgcolor: roleColor,
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#666" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Person sx={{ fontSize: 20, color: roleColor }} />
              <Typography variant="subtitle2" fontWeight={600} color="#666">
                {t("profile.name")}
              </Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editedStaff?.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <Typography variant="body1">{currentStaff?.name}</Typography>
            )}
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Email sx={{ fontSize: 20, color: roleColor }} />
              <Typography variant="subtitle2" fontWeight={600} color="#666">
                {t("profile.email")}
              </Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                type="email"
                value={editedStaff?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <Typography variant="body1">{currentStaff?.email}</Typography>
            )}
          </Grid>

          {/* Phone */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Phone sx={{ fontSize: 20, color: roleColor }} />
              <Typography variant="subtitle2" fontWeight={600} color="#666">
                {t("profile.phone")}
              </Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editedStaff?.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            ) : (
              <Typography variant="body1">
                {currentStaff?.phoneNumber || "Chưa cập nhật"}
              </Typography>
            )}
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Business sx={{ fontSize: 20, color: roleColor }} />
              <Typography variant="subtitle2" fontWeight={600} color="#666">
                {t("profile.company")}
              </Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editedStaff?.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            ) : (
              <Typography variant="body1">
                {currentStaff?.company || "Chưa cập nhật"}
              </Typography>
            )}
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocationOn sx={{ fontSize: 20, color: roleColor }} />
              <Typography variant="subtitle2" fontWeight={600} color="#666">
                {t("profile.address")}
              </Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                value={editedStaff?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            ) : (
              <Typography variant="body1">
                {currentStaff?.address || "Chưa cập nhật"}
              </Typography>
            )}
          </Grid>

          {/* Date of Birth */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Cake sx={{ fontSize: 20, color: roleColor }} />
              <Typography variant="subtitle2" fontWeight={600} color="#666">
                {t("profile.dob")}
              </Typography>
            </Box>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                type="date"
                value={
                  editedStaff?.dob
                    ? new Date(editedStaff.dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const timestamp = new Date(e.target.value).getTime();
                  handleInputChange("dob", timestamp.toString());
                }}
              />
            ) : (
              <Typography variant="body1">
                {currentStaff?.dob
                  ? new Date(currentStaff.dob).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {isEditing ? (
          <>
            <Button
              onClick={handleCancelEdit}
              variant="outlined"
              startIcon={<Cancel />}
              disabled={loading}
            >
              {t("button.cancel")}
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
              sx={{
                bgcolor: roleColor,
                "&:hover": { bgcolor: roleColor, opacity: 0.9 },
              }}
            >
              {t("saveChanges")}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onClose}
              variant="text"
              sx={{ color: "#666" }}
              disabled={loading}
            >
              {t("button.close")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              disabled={loading}
            >
              {t("button.delete")}
            </Button>
            <Button
              onClick={handleEdit}
              variant="contained"
              startIcon={<Edit />}
              sx={{
                bgcolor: roleColor,
                "&:hover": { bgcolor: roleColor, opacity: 0.9 },
              }}
            >
              {t("button.edit")}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StaffDetail;
