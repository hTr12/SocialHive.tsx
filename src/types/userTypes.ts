export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    isLoggedIn: boolean;
  }
  
  export interface UserState {
    currentUser: User | null;
    users: User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }