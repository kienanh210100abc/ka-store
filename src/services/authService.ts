export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address?: string;
  company?: string;
  dob?: number;
  phoneNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  company?: string;
  dob?: number;
  phoneNumber?: string;
  avatar?: string;
}

export interface LoginResponse {
  user: User;
}

const BASE_URL = "https://693a6dea9b80ba7262c9e0fe.mockapi.io";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Chỉ tìm user theo email
    const response = await fetch(`${BASE_URL}/users?email=${data.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const users: User[] = await response.json();

    // Kiểm tra email có tồn tại
    if (users.length === 0) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Kiểm tra password khớp
    const user = users[0];
    if (user.password !== data.password) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Fake token + user
    return {
      user: user,
    };
  },
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },
};
