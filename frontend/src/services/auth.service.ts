import client from '../api/client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    admin: {
        id: string;
        email: string;
        name: string;
    };
}

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await client.post<LoginResponse>('/admin/login', credentials);
        return response.data;
    },

    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },

    getToken(): string | null {
        return localStorage.getItem('admin_token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('admin_user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
