export interface LoginState {
    login: string | null;
    admin?: boolean;
    editor?: boolean;
}

export const initialLoginState: LoginState = {
    login: null
};


