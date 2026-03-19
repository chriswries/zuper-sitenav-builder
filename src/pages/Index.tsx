import NavPreview from "@/components/NavPreview";
import NavEditor from "@/components/NavEditor";
import { useNavData } from "@/hooks/useNavData";
import { useNavEditor } from "@/hooks/useNavEditor";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const { navItems, loading, refetch } = useNavData();
  const editor = useNavEditor(refetch);
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {!loading && <NavPreview navItems={navItems} />}

      {/* Body content */}
      <div className="flex flex-col items-center pt-32 px-8 pb-16">
        <p className="text-center text-sm max-w-md mb-8" style={{ color: '#7A6B5A' }}>
          Hover over nav items to preview mega menus. Edit navigation below.
        </p>

        {!loading && <NavEditor navItems={navItems} editor={editor} />}

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

      <Toaster />
    </div>
  );
};

export default Index;
