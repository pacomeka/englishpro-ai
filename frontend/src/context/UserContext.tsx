import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  userId: string;
  nom: string;
  niveau: string;
  phase: number;
  setUserInfo: (info: Partial<UserContextType>) => void;
}

const UserContext = createContext<UserContextType>({
  userId: "demo-user-1",
  nom: "Kofi",
  niveau: "A2",
  phase: 1,
  setUserInfo: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<UserContextType, "setUserInfo">>({
    userId: "demo-user-1",
    nom: "Kofi",
    niveau: "A2",
    phase: 1,
  });

  useEffect(() => {
    const saved = localStorage.getItem("englishpro_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const setUserInfo = (info: Partial<UserContextType>) => {
    setUser((prev) => {
      const next = { ...prev, ...info };
      localStorage.setItem("englishpro_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ ...user, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
