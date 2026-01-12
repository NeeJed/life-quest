import type { IUser } from "@/shared/types/Auth";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<IUser | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (email === "test@example.com" && password === "password") {
        const mockUser: IUser = {
          id: "1",
          email,
          name: "Test User",
        };
        const mockToken = "mock-jwt-token";
        user.value = mockUser;
        token.value = mockToken;
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        return true;
      }
      throw new Error("Неверные данные");
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser: IUser = { id: Date.now().toString(), email, name };
      const mockToken = "mock-jwt-token";
      user.value = mockUser;
      token.value = mockToken;
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Register error: ", error);
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const initAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  };

  return { user, token, isAuthenticated, login, register, logout, initAuth };
});
