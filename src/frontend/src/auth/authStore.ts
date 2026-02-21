import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const OWNER_USERNAME = 'Bhanuchand';
const OWNER_PASSWORD = 'Prataap';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  role: 'owner' | 'customer' | null;
  handshakeComplete: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerCustomer: (username: string, password: string, mobileNumber: string) => Promise<boolean>;
  setHandshakeComplete: (complete: boolean) => void;
  clearHandshake: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      role: null,
      handshakeComplete: false,
      login: async (username: string, password: string) => {
        if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
          set({ isAuthenticated: true, username, role: 'owner', handshakeComplete: false });
          return true;
        }
        
        const storedCustomers = localStorage.getItem('customers');
        if (storedCustomers) {
          const customers = JSON.parse(storedCustomers);
          const customer = customers.find(
            (c: any) => c.username === username && c.password === password
          );
          if (customer) {
            set({ isAuthenticated: true, username, role: 'customer', handshakeComplete: false });
            return true;
          }
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, username: null, role: null, handshakeComplete: false });
      },
      registerCustomer: async (username: string, password: string, mobileNumber: string) => {
        const storedCustomers = localStorage.getItem('customers');
        const customers = storedCustomers ? JSON.parse(storedCustomers) : [];
        
        if (customers.find((c: any) => c.username === username)) {
          return false;
        }
        
        customers.push({ username, password, mobileNumber, registrationDate: Date.now() });
        localStorage.setItem('customers', JSON.stringify(customers));
        return true;
      },
      setHandshakeComplete: (complete: boolean) => {
        set({ handshakeComplete: complete });
      },
      clearHandshake: () => {
        set({ handshakeComplete: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
