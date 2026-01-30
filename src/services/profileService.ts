export interface Profile {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  company?: string;
  dob?: number;
  phoneNumber?: string;
  avatar?: string; // Base64 string of avatar image
}

const BASE_URL = "https://693a6dea9b80ba7262c9e0fe.mockapi.io";
export const profileService = {
  // GET /users/:id
  getProfile: async (id: string): Promise<Profile> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  // PUT /users/:id
  updateInfor: async (id: string, data: Profile): Promise<Profile> => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Update failed: ${response.status}`);
    }

    return response.json();
  },

  // DELETE /users/:id (nên có)
  deleteProfile: async (userId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete profile");
    }
  },

  // Change Password
  changePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<Profile> => {
    // Lấy thông tin profile hiện tại
    const profile = await profileService.getProfile(userId);

    // Kiểm tra mật khẩu cũ có khớp không
    if (profile.password !== oldPassword) {
      throw new Error("Old password is incorrect");
    }

    // Cập nhật mật khẩu mới
    const updatedProfile = {
      ...profile,
      password: newPassword,
    };

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    });

    if (!response.ok) {
      throw new Error("Failed to change password");
    }

    return response.json();
  },
};
