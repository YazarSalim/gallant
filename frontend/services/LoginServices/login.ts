import api from '../../hooks/useAxios';


interface LoginPayload {
  email: string;
  password: string;
}

export const login = (data: LoginPayload) => api.post("/auth/login", data);