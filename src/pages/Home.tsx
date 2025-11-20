// import Navbar from "../components/Navbar";
import Sidebar from "../components/home/Sidebar";
import ChatArea from "../components/home/ChatArea";
import { useLayoutStore } from "../store/useLayoutStore";

const Home = () => {
    const { isSidebarOpen, setSidebarOpen } = useLayoutStore();

    return (
        <div className="flex flex-col max-h-screen">

            <div className="drawer flex-1 lg:drawer-open">
                <input
                    id="sidebar-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    checked={isSidebarOpen}
                    onChange={(e) => setSidebarOpen(e.target.checked)}
                />
                <div className="drawer-content flex flex-col h-screen bg-base-100">

                    <ChatArea />
                </div>

                {/* Drawer Sidebar */}
                <Sidebar />
            </div>
        </div>

    );
};

export default Home;
