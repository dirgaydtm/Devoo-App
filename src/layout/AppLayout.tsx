import type { PropsWithChildren } from "react";

import Sidebar from "../components/Sidebar";
import { useLayoutStore } from "../store/useLayoutStore";

interface AppLayoutProps {
    drawerClassName?: string;
    contentClassName?: string;
}

export const AppLayout = ({
    children
}: PropsWithChildren<AppLayoutProps>) => {
    const { isSidebarOpen, setSidebarOpen } = useLayoutStore();

    return (
        <div className="flex flex-col max-h-screen">
            <div className={`drawer flex-1 md:drawer-open not-md:drawer-end`}>
                <input
                    id="sidebar-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                    checked={isSidebarOpen}
                    onChange={(event) => setSidebarOpen(event.target.checked)}
                />
                <div className={`drawer-content flex flex-col min-h-screen bg-base-100`}>
                    {children}
                </div>

                <Sidebar />
            </div>
        </div>
    );
};

export default AppLayout;
