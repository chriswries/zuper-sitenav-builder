import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ZuperLogo from "@/components/ZuperLogo";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (isSignUp) {
      if (!email.trim().toLowerCase().endsWith("@zuper.co")) {
        setError("Only @zuper.co email addresses can register.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        navigate("/", { replace: true });
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a password reset link.");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: '#FFF8F0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: '#FDF6ED',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex justify-center mb-8">
          <ZuperLogo />
        </div>
        <h1
          className="text-xl font-bold text-center mb-6"
          style={{ color: '#2D1E0E' }}
        >
          {isSignUp ? 'Create an account' : 'Sign in'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2D1E0E' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
              style={{
                borderColor: 'rgba(255,107,26,0.2)',
                background: '#FFF8F0',
                color: '#2D1E0E',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#FF6B1A'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,107,26,0.2)'; }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2D1E0E' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
              style={{
                borderColor: 'rgba(255,107,26,0.2)',
                background: '#FFF8F0',
                color: '#2D1E0E',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#FF6B1A'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,107,26,0.2)'; }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#E85A0A' }}>{error}</p>
          )}
          {message && (
            <p className="text-sm" style={{ color: '#2D1E0E' }}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-50"
            style={{
              background: '#FF6B1A',
              color: '#fff',
              boxShadow: '0 2px 12px rgba(255,107,26,0.3)',
            }}
          >
            {loading ? '...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {!isSignUp && (
            <button
              onClick={handleForgotPassword}
              className="block w-full text-sm bg-transparent border-none cursor-pointer"
              style={{ color: '#7A6B5A' }}
            >
              Forgot password?
            </button>
          )}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            className="text-sm font-semibold bg-transparent border-none cursor-pointer"
            style={{ color: '#FF6B1A' }}
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
