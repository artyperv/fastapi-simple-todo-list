import { loginLogout } from "@/client";
import { usersReadUserMeOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  session: string | null;
  updateSession: () => void;
  logOut: () => Promise<void>;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: user,
    refetch,
    isLoading,
    isRefetchError
  } = useQuery({
    ...usersReadUserMeOptions(),
    retry: 0,
  })

  const [session, setSession] = useState<string | null>(() => {
    const savedSession = localStorage.getItem("session");
    return savedSession || null;
  });

  const setSessionWithStorage = (newSession: string | null) => {
    if (newSession === null) localStorage.removeItem("session")
    else localStorage.setItem("session", newSession);
    setSession(newSession);
  };

  const logOut = async () => {
    await loginLogout();
    await refetch();
  };

  useEffect(() => {
    if (user && !isRefetchError) {
      setSessionWithStorage(user.id);
    } else {
      setSessionWithStorage(null);
    }
  }, [user, isRefetchError])

  return (
    <SessionContext.Provider
      value={{ session, updateSession: refetch, isLoading, logOut }}
    >
      {children}
    </SessionContext.Provider>
  );
};
