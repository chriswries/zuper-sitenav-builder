import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ZuperLogo from "@/components/ZuperLogo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check if hash contains type=recovery
    if (window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/", { replace: true });
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#FFF8F0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ color: '#7A6B5A' }}>Verifying reset link...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#FFF8F0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-full max-w-sm p-8 rounded-2xl" style={{ background: '#FDF6ED', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
        <div className="flex justify-center mb-8"><ZuperLogo /></div>
        <h1 className="text-xl font-bold text-center mb-6" style={{ color: '#2D1E0E' }}>Set new password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2D1E0E' }}>New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'rgba(255,107,26,0.2)', background: '#FFF8F0', color: '#2D1E0E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#E85A0A' }}>{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-full text-sm font-bold disabled:opacity-50" style={{ background: '#FF6B1A', color: '#fff' }}>
            {loading ? '...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
