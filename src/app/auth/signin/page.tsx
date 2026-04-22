"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("账号或密码错误");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F9F9F8] flex items-center justify-center z-[100]">
      <div className="w-full max-w-[420px] p-6">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-[#1D1D1B] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1D1D1B] tracking-tight">BrandMention</h1>
          <p className="text-[#6B6B66] text-sm mt-2 font-medium">请登录您的 GEO 运营台</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl border border-[#E5E5E1] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">用户名</label>
            <input 
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="claude-input py-3"
              placeholder="Admin / Operator"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">密码</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="claude-input py-3"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="claude-button-primary w-full py-3.5 flex items-center justify-center mt-4 shadow-none border border-slate-900"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "进入控制台"}
          </button>
        </form>

        <p className="text-center text-[10px] text-[#A1A19A] mt-12 font-bold uppercase tracking-widest">
          &copy; 2024 Anthropic Inspired UI <br />
          Brand AI Visibility Platform
        </p>
      </div>
    </div>
  );
}
