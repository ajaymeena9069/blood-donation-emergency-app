import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

const MainLayout = () => {
    const location = useLocation();
    const publicPages = ['/', '/donors', '/find-donors', '/care', '/services', '/contact', '/learn-more'];
    const showPublicNavbar = publicPages.includes(location.pathname);

    return (
        <>
            <ScrollToTop />
            {showPublicNavbar && <Navbar />}
            <Outlet />
            {showPublicNavbar && <Footer />}
        </>
    );
};

export default MainLayout;
