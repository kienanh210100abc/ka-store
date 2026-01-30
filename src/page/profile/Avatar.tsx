import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Box, Button, Avatar as MuiAvatar } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ImageUploading, { type ImageListType } from "react-images-uploading";
import { toast } from "react-toastify";
import { profileService, type Profile } from "../../services/profileService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";

/**
 * Props truyền từ component cha
 * - profile: thông tin người dùng hiện tại
 * - onAvatarUpdate: callback để báo cho component cha biết avatar đã thay đổi
 */
type Props = {
  profile: Profile | null;
  onAvatarUpdate?: (updatedProfile: Profile) => void;
};

const Avatar = ({ profile, onAvatarUpdate }: Props) => {
  /**
   * images: danh sách ảnh đang upload (react-images-uploading yêu cầu dạng này)
   * loading: trạng thái đang upload / update avatar
   */
  const [images, setImages] = React.useState<ImageListType>([]);
  const [loading, setLoading] = React.useState(false);
  // Chỉ cho phép upload tối đa 1 ảnh
  const maxNumber = 1;
  const { t } = useTranslation();
  // Lấy thông tin user đang đăng nhập từ Redux
  const { user } = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();

  /**
   * useEffect:
   * - Khi component mount
   * - Hoặc khi profile thay đổi
   *
   * Nếu profile có avatar → hiển thị avatar đó
   * Nếu không → reset ảnh
   */
  useEffect(() => {
    if (profile?.avatar) {
      setImages([{ data_url: profile.avatar }]);
    } else {
      setImages([]);
    }
  }, [profile]);

  /**
   * Hàm nén ảnh trước khi upload
   * Mục đích:
   * - Giảm dung lượng
   * - Tránh lưu base64 quá lớn vào MockAPI
   */
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Đọc file ảnh thành base64
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          // Tạo canvas để vẽ lại ảnh
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Giới hạn kích thước tối đa
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          let width = img.width;
          let height = img.height;

          /**
           * Tính toán lại kích thước ảnh
           * để giữ nguyên tỉ lệ (không bị méo)
           */
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Vẽ ảnh đã resize lên canvas
          ctx?.drawImage(img, 0, 0, width, height);

          /**
           * Convert canvas thành base64
           * - image/jpeg
           * - quality = 0.7 (70%)
           */
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  /**
   * Hàm xử lý khi người dùng chọn / đổi avatar
   */
  const onChangeAvatar = async (imageList: ImageListType) => {
    // Nếu có ảnh mới và có file
    if (imageList.length > 0 && imageList[0].file) {
      try {
        setLoading(true);

        // Nén ảnh trước khi lưu
        const compressedBase64 = await compressImage(imageList[0].file);

        // Set ảnh preview
        setImages([{ data_url: compressedBase64 }]);

        /**
         * Tự động lưu avatar ngay sau khi chọn
         * Điều kiện:
         * - Có user đang đăng nhập
         * - Có profile
         */
        if (user?.id && profile) {
          // Tạo object profile mới với avatar mới
          const updatedProfile = {
            ...profile,
            avatar: compressedBase64,
          };

          // Gọi API update avatar (PATCH)
          await profileService.updateInfor(user.id, updatedProfile);

          // Cập nhật Redux store để Navbar cập nhật avatar
          dispatch(updateUser({ avatar: compressedBase64 }));

          // Thông báo thành công
          toast.success(
            t("toast.avatarUpdateSuccess") || "Avatar updated successfully!",
            {
              position: "bottom-right",
            },
          );

          // Gọi callback để component cha cập nhật lại state
          if (onAvatarUpdate) {
            onAvatarUpdate(updatedProfile);
          }
        }
      } catch (error) {
        // Bắt lỗi khi upload / update avatar
        console.error("Error uploading avatar:", error);

        toast.error(t("toast.avatarUpdateError") || "Failed to upload avatar", {
          position: "bottom-right",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Trường hợp xoá ảnh
      setImages(imageList);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        px: { xs: 2, sm: 0 },
        py: { xs: 2, sm: 0 },
      }}
    >
      {/* Component upload ảnh */}
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChangeAvatar}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={["jpg", "png", "jpeg"]}
      >
        {({ imageList, onImageUpload, onImageUpdate }) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Hiển thị avatar */}
            {imageList.length === 0 ? (
              // Khi chưa có avatar → icon mặc định
              <AccountCircleIcon
                sx={{
                  width: { xs: "150px", sm: "180px", md: "200px" },
                  height: { xs: "150px", sm: "180px", md: "200px" },
                  color: "#667eea",
                }}
              />
            ) : (
              // Khi có avatar → hiển thị ảnh
              <MuiAvatar
                src={imageList[0]?.data_url}
                alt="Avatar"
                sx={{
                  width: { xs: "150px", sm: "180px", md: "200px" },
                  height: { xs: "150px", sm: "180px", md: "200px" },
                  border: { xs: "3px solid #667eea", md: "4px solid #667eea" },
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              />
            )}

            {/* Nút upload / đổi avatar */}
            <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              onClick={
                imageList.length === 0 ? onImageUpload : () => onImageUpdate(0)
              }
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  opacity: 0.9,
                },
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: "300px", sm: "none" },
              }}
            >
              {loading
                ? t("Uploading")
                : imageList.length === 0
                  ? t("profile.uploadAvatar") || "Thay Đổi Ảnh Đại Diện"
                  : t("profile.changeAvatar") || "Thay Đổi Ảnh Đại Diện"}
            </Button>
          </Box>
        )}
      </ImageUploading>
    </Box>
  );
};

export default Avatar;
