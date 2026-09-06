export interface LoginForm {
    email: string;
    password: string;
}

export interface SignupForm extends LoginForm {
    name: string;
}

export type UserRole = "ADMIN" | "TEAM_MEMBER";

export function getRolePath(role: UserRole) {
    return role === "ADMIN" ? "/admin" : "/team-member";
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}