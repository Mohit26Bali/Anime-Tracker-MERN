import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { fetchCurrentUser } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import LandingPage from "./pages/LandingPage";
import BrowsePage from "./pages/BrowsePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";
import CharacterDetailsPage from "./pages/CharacterDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/anime/:id" element={<AnimeDetailsPage />} />
            <Route path="/characters/:id" element={<CharacterDetailsPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
