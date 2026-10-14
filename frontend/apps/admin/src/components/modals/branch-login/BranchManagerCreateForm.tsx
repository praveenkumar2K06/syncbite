import { Input } from "../../ui/input";
import React from "react";
import type { Branch, Brand } from "../../../api/admin";
import { RESTAURANT_PORTAL_URL } from "../../../config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface BranchManagerCreateFormProps {
  branch?: Branch | null;
  branches?: Branch[];
  brands?: Brand[];
  targetBranchId?: string;
  setTargetBranchId?: (id: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (pwd: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  creating: boolean;
  onGeneratePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  variant?: "branch_inline" | "branch_empty" | "global";
}

export default function BranchManagerCreateForm({
  branch,
  branches = [],
  brands = [],
  targetBranchId = "",
  setTargetBranchId,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  creating,
  onGeneratePassword,
  onSubmit,
  onCancel,
  variant = "branch_inline",
}: BranchManagerCreateFormProps) {
  if (variant === "global") {
    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Select Branch Outlet *
          </label>
          <Select
            value={targetBranchId}
            onValueChange={(value) => setTargetBranchId?.(value ?? "")}
          >
            <SelectTrigger
              aria-required
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground focus:border-emerald-500"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" disabled>
                Select physical branch...
              </SelectItem>
              {branches.map((b) => {
                const br = brands.find((brand) => brand.id === b.brand_id);
                return (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} [{br?.name || "Brand"}] ({b.address_text || "Campus Zone"})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Branch Manager Login Email *
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. manager@restaurant.com"
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-emerald-300 font-mono focus:border-emerald-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-slate-300">
              Initial Password (Min 8 chars) *
            </label>
            <button
              type="button"
              onClick={onGeneratePassword}
              className="text-[11px] font-medium text-emerald-400 hover:underline cursor-pointer"
            >
              🎲 Generate Secure Password
            </button>
          </div>
          <div className="relative flex items-center">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-3.5 pr-20 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-amber-300 font-mono focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 px-2.5 py-1 rounded text-xs bg-slate-800 text-slate-300 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating || !email.trim() || !password.trim() || !targetBranchId}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-all shadow-md cursor-pointer"
          >
            {creating ? "Creating..." : "Create & Bind Manager"}
          </button>
        </div>
      </form>
    );
  }

  if (variant === "branch_empty") {
    return (
      <form
        onSubmit={onSubmit}
        className="p-5 rounded-xl bg-background border border-emerald-900/40 flex flex-col gap-4 shadow-inner"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔑</span> Create Branch Manager Login
          </span>
          <span className="text-[11px] font-mono text-slate-400">Target: {branch?.name}</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Branch Manager Login Email *
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. manager@restaurant.com"
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-slate-900 border border-input text-emerald-300 font-mono focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-slate-300">
              Initial Password (Min 8 chars) *
            </label>
            <button
              type="button"
              onClick={onGeneratePassword}
              className="text-[11px] font-medium text-emerald-400 hover:underline cursor-pointer"
            >
              🎲 Generate Secure Password
            </button>
          </div>
          <div className="relative flex items-center">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-3.5 pr-20 py-2.5 rounded-xl text-sm outline-none bg-slate-900 border border-input text-amber-300 font-mono focus:border-emerald-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Staff will use this email and password to log into the Restaurant Portal at{" "}
            {RESTAURANT_PORTAL_URL}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating || !email.trim() || !password.trim()}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            {creating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Manager...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Create & Assign Branch Manager</span>
              </>
            )}
          </button>
        </div>
      </form>
    );
  }

  // variant === "branch_inline" (when branch has existing managers, expand sub-form)
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div>
        <label className="block text-[11px] font-medium text-slate-300 mb-1">
          Manager Login Email *
        </label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. lead2@restaurant.com"
          className="w-full px-3.5 py-2 rounded-xl text-xs outline-none bg-slate-900 border border-input text-emerald-300 font-mono focus:border-emerald-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-medium text-slate-300">
            Initial Password (Min 8 chars) *
          </label>
          <button
            type="button"
            onClick={onGeneratePassword}
            className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
          >
            🎲 Generate Secure Password
          </button>
        </div>
        <div className="relative flex items-center">
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none bg-slate-900 border border-input text-amber-300 font-mono focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={creating || !email.trim() || !password.trim()}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          {creating ? "Creating..." : "Save & Bind Manager"}
        </button>
      </div>
    </form>
  );
}
