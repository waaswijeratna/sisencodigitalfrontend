import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const getInitials = (name?: string) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className="text-xs">
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-300 text-base text-white uppercase text-xs">
                    {getInitials(user?.name)}
                </div>

                <div className="w-full overflow-hidden">
                    <h1 className="font-bold truncate">{user?.name}</h1>
                    <p className="text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>

            <button onClick={() => void handleLogout()} className="mt-4 px-4 py-2 w-full rounded-full bg-red-500 text-white hover:bg-red-600">
                Log out
            </button>
        </div>
    );
}