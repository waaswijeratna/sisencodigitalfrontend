export interface LoginForm {
    email: string;
    password: string;
}

export interface SignupForm extends LoginForm {
    name: string;
}

export interface AuthResponse {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}