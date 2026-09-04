import axios from 'axios';
import type {
  AuthResponseDto,
  UserResponseDto,
  UserRequestDto,
  UserUpdateRequestDto,
  RegisterRequestDto,
  DepartementResponseDto,
  DepartementRequestDto,
  PositionResponseDto,
  PositionRequestDto,
  RoleResponseDto,
  LeaveResponseDto,
  PredictionResponseDto,
  ContratResponseDto,
  PresenceResponseDto,
  EvaluationResponseDto,
} from '../types/api';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Automatically attach Authorization Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized API calls
export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponseDto>('/auth/login', data),

  register: (data: RegisterRequestDto) =>
    apiClient.post<AuthResponseDto>('/auth/register', data),

  // Users
  getUsers: async () => {
    const res = await apiClient.get<UserResponseDto[]>('/users');
    return res.data;
  },
  getUserById: async (id: number) => {
    const res = await apiClient.get<UserResponseDto>(`/users/${id}`);
    return res.data;
  },
  createUser: async (data: UserRequestDto) => {
    const res = await apiClient.post<UserResponseDto>('/users', data);
    return res.data;
  },
  updateUser: async (id: number, data: UserUpdateRequestDto) => {
    const res = await apiClient.patch<UserResponseDto>(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: number) => {
    const res = await apiClient.delete<void>(`/users/${id}`);
    return res.data;
  },

  // Departements
  getDepartements: async () => {
    const res = await apiClient.get<DepartementResponseDto[]>('/departements');
    return res.data;
  },
  getDepartementById: async (id: number) => {
    const res = await apiClient.get<DepartementResponseDto>(`/departements/${id}`);
    return res.data;
  },
  createDepartement: async (data: DepartementRequestDto) => {
    const res = await apiClient.post<DepartementResponseDto>('/departements', data);
    return res.data;
  },
  updateDepartement: async (id: number, data: DepartementRequestDto) => {
    const res = await apiClient.patch<DepartementResponseDto>(`/departements/${id}`, data);
    return res.data;
  },
  deleteDepartement: async (id: number) => {
    const res = await apiClient.delete<void>(`/departements/${id}`);
    return res.data;
  },

  // Positions
  getPositions: async () => {
    const res = await apiClient.get<PositionResponseDto[]>('/positions');
    return res.data;
  },
  getPositionById: async (id: number) => {
    const res = await apiClient.get<PositionResponseDto>(`/positions/${id}`);
    return res.data;
  },
  createPosition: async (data: PositionRequestDto) => {
    const res = await apiClient.post<PositionResponseDto>('/positions', data);
    return res.data;
  },
  updatePosition: async (id: number, data: PositionRequestDto) => {
    const res = await apiClient.patch<PositionResponseDto>(`/positions/${id}`, data);
    return res.data;
  },
  deletePosition: async (id: number) => {
    const res = await apiClient.delete<void>(`/positions/${id}`);
    return res.data;
  },

  // Roles
  getRoles: async () => {
    const res = await apiClient.get<RoleResponseDto[]>('/roles');
    return res.data;
  },

  // Leaves
  getLeaves: async () => {
    const res = await apiClient.get<LeaveResponseDto[]>('/leaves');
    return res.data;
  },

  // Predictions
  getPredictions: async () => {
    const res = await apiClient.get<PredictionResponseDto[]>('/predictions');
    return res.data;
  },

  // Contrats
  getContrats: async () => {
    const res = await apiClient.get<ContratResponseDto[]>('/contrats');
    return res.data;
  },

  // Presences
  getPresences: async () => {
    const res = await apiClient.get<PresenceResponseDto[]>('/presences');
    return res.data;
  },

  // Evaluations
  getEvaluations: async () => {
    const res = await apiClient.get<EvaluationResponseDto[]>('/evaluations');
    return res.data;
  },
};
