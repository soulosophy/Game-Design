import { useCallback, useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "sonner";

import { SiteShell } from "@/components/site-shell";
import ContactPage from "@/pages/contact-page";
import HomePage from "@/pages/home-page";
import ProjectsPage from "@/pages/projects-page";
import ResumePage from "@/pages/resume-page";
import StudioPage from "@/pages/studio-page";
import {
  getContactMessages,
  getPortfolioContent,
  submitContactMessage,
  updatePortfolioContent,
} from "@/lib/api";

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAppData = useCallback(async () => {
    try {
      setLoading(true);
      const [portfolioResponse, messagesResponse] = await Promise.all([
        getPortfolioContent(),
        getContactMessages(),
      ]);

      setPortfolio(portfolioResponse);
      setMessages(messagesResponse);
    } catch (error) {
      console.error(error);
      toast.error("Couldn’t load the portfolio content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    loadAppData();
  }, [loadAppData]);

  const handleSavePortfolio = async (nextPortfolio) => {
    try {
      setSaving(true);
      const updatedPortfolio = await updatePortfolioContent(nextPortfolio);
      setPortfolio(updatedPortfolio);
      toast.success("Portfolio content updated.");
      return updatedPortfolio;
    } catch (error) {
      console.error(error);
      toast.error("Couldn’t save your changes.");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitContact = async (payload) => {
    await submitContactMessage(payload);
    const refreshedMessages = await getContactMessages();
    setMessages(refreshedMessages);
  };

  if (loading || !portfolio) {
    return (
      <div className="app-loading-screen" data-testid="app-loading-screen">
        <div className="loading-panel scanlines" data-testid="loading-panel">
          <p className="loading-kicker" data-testid="loading-kicker">
            INITIALIZING PORTFOLIO
          </p>
          <h1 className="loading-title" data-testid="loading-title">
            Loading your cyberpunk showcase
          </h1>
          <p className="loading-copy" data-testid="loading-copy">
            Pulling portfolio content, project lanes, resume details, and inbox
            messages from the grid.
          </p>
        </div>
        <Toaster richColors position="top-right" theme="dark" />
      </div>
    );
  }

  return (
    <div className="App" data-testid="portfolio-app-shell">
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <SiteShell
                messages={messages}
                onRefresh={loadAppData}
                onSavePortfolio={handleSavePortfolio}
                onSubmitContact={handleSubmitContact}
                portfolio={portfolio}
                saving={saving}
              />
            }
          >
            <Route element={<HomePage />} path="/" />
            <Route element={<ProjectsPage />} path="/projects" />
            <Route element={<ResumePage />} path="/resume" />
            <Route element={<ContactPage />} path="/contact" />
            <Route element={<StudioPage />} path="/studio" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" theme="dark" />
    </div>
  );
}

export default App;
