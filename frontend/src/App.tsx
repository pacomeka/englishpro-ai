import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Session from "./pages/Session";
import Cards from "./pages/Cards";
import Programme from "./pages/Programme";
import Conversation from "./pages/Conversation";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="session" element={<Session />} />
            <Route path="cards" element={<Cards />} />
            <Route path="programme" element={<Programme />} />
            <Route path="conversation" element={<Conversation />} />
            <Route path="stats" element={<Stats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
