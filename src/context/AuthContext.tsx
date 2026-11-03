import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  createLocalAccount,
  getLocalAccountEmail,
  getRememberedSession,
  initializeAuthDatabase,
  setRememberedSession,
  verifyLocalCredentials
} from '../database/auth';

type AuthValue = {
  ready: boolean;
  error: string | null;
  hasAccount: boolean;
  isAuthenticated: boolean;
  email: string | null;
  createAccount: (email: string, password: string, remember: boolean) => Promise<void>;
  signIn: (email: string, password: string, remember: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const Context = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        await initializeAuthDatabase();
        const [accountEmail, rememberedEmail] = await Promise.all([
          getLocalAccountEmail(),
          getRememberedSession()
        ]);

        if (!active) {
          return;
        }

        setHasAccount(accountEmail !== null);
        if (accountEmail && rememberedEmail === accountEmail) {
          setEmail(accountEmail);
        } else if (rememberedEmail) {
          await setRememberedSession(null);
        }
      } catch {
        if (active) {
          setError('Database login tidak dapat dibuka. Silakan mulai ulang aplikasi.');
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const createAccount = useCallback(
    async (accountEmail: string, password: string, remember: boolean) => {
      setError(null);
      await createLocalAccount(accountEmail, password);
      setHasAccount(true);
      await setRememberedSession(remember ? accountEmail : null);
      setEmail(accountEmail);
    },
    []
  );

  const signIn = useCallback(
    async (accountEmail: string, password: string, remember: boolean) => {
      setError(null);
      const valid = await verifyLocalCredentials(accountEmail, password);
      if (!valid) {
        return false;
      }

      setEmail(accountEmail);
      await setRememberedSession(remember ? accountEmail : null);
      return true;
    },
    []
  );

  const signOut = useCallback(async () => {
    await setRememberedSession(null);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      error,
      hasAccount,
      isAuthenticated: email !== null,
      email,
      createAccount,
      signIn,
      signOut
    }),
    [ready, error, hasAccount, email, createAccount, signIn, signOut]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth() {
  const value = useContext(Context);

  if (!value) {
    throw new Error('useAuth harus berada di dalam AuthProvider');
  }

  return value;
}
