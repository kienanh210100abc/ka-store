import { Box, OutlinedInput, Typography } from "@mui/material";
import React from "react";

/**
 * Component tái sử dụng cho các trường input trong form Profile
 * Giúp giảm code lặp lại và dễ bảo trì
 */

type ProfileFormFieldProps = {
  label: string; // Nhãn hiển thị (Họ Tên, Email, etc.)
  name: string; // Tên field trong formData
  value: string; // Giá trị hiện tại
  placeholder: string; // Placeholder cho input
  disabled: boolean; // Có disable input không
  error?: string; // Thông báo lỗi (nếu có)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Callback khi thay đổi
};

const ProfileFormField: React.FC<ProfileFormFieldProps> = ({
  label,
  name,
  value,
  placeholder,
  disabled,
  error,
  onChange,
}) => {
  return (
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
      {/* Label */}
      <Typography
        sx={{
          fontWeight: 600,
          width: { xs: "100%", sm: "150px" },
          mb: { xs: 0.5, sm: 0 },
        }}
      >
        {label}:
      </Typography>

      {/* Input và error message */}
      <Box
        sx={{
          width: { xs: "100%", sm: "calc(100% - 150px - 10px)" },
          flex: { sm: 1 },
        }}
      >
        <OutlinedInput
          sx={{ width: { xs: "calc(100% - 10px)", sm: "100%" } }}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          error={!!error} // Chuyển error string thành boolean
        />

        {/* Hiển thị error message nếu có */}
        {error && (
          <Typography
            color="error"
            variant="caption"
            sx={{ ml: 1.5, mt: 0.5, display: "block" }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProfileFormField;
