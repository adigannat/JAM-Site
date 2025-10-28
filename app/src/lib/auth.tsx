import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { ID } from "appwrite";
import { account, AppwriteUser } from "./appwrite";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapAppwriteUser(user: AppwriteUser): AuthUser {
  return {
    id: user.$id,
    email: user.email,
    name: user.name
  };
}

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  const loadCurrent = useCallback(async () => {
    try {
      const result = await account.get();
      setUser(mapAppwriteUser(result));
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void loadCurrent();
  }, [loadCurrent]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        await account.createEmailPasswordSession(email, password);
        await loadCurrent();
      } finally {
        setLoading(false);
      }
    },
    [loadCurrent]
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      setLoading(true);
      try {
        await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        await loadCurrent();
      } finally {
        setLoading(false);
      }
    },
    [loadCurrent]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await loadCurrent();
    } finally {
      setLoading(false);
    }
  }, [loadCurrent]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      ready,
      login,
      signup,
      logout,
      refresh
    }),
    [loading, login, logout, ready, refresh, signup, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
