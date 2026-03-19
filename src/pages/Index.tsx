import NavPreview from "@/components/NavPreview";
import { useNavData } from "@/hooks/useNavData";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { navItems, loading } = useNavData();
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {!loading && <NavPreview navItems={navItems} />}

      {/* Body content */}
      <div className="flex flex-col items-center justify-center pt-32 px-8">
        <p className="text-center text-sm max-w-md" style={{ color: '#7A6B5A' }}>
          Hover over nav items to preview mega menus. Use the edit panel below to make changes.
        </p>

        {/* Edit panel placeholder */}
        <div
          className="mt-12 w-full max-w-3xl rounded-2xl p-8 text-center"
          style={{
            background: '#FDF6ED',
            border: '2px dashed rgba(255,107,26,0.2)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: '#7A6B5A' }}>
            Edit panel — coming in next prompt.
          </p>
        </div>

        {/* Logout */}
        <div className="mt-8 flex items-center gap-3">
          <span className="text-xs" style={{ color: '#7A6B5A' }}>
            Signed in as {user?.email}
          </span>
          <button
            onClick={signOut}
            className="text-xs font-semibold bg-transparent border-none cursor-pointer transition-colors"
            style={{ color: '#FF6B1A' }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
