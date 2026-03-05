export default function Navigation() {
  return (
    <header className="px-12 py-6 flex items-center justify-between border-b border-[rgba(201,168,76,0.2)] bg-[#0d1b2a] backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-linear-to-br from-[#c9a84c] to-[#e8c878] font-serif font-bold text-lg text-[#0d1b2a]">
          YML
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-bold text-white leading-tight">
            YML Legal
          </span>
          <span className="font-mono text-[10px] text-[#c9a84c] uppercase tracking-[0.2em]">
            Land Tax Disputes
          </span>
        </div>
      </div>

      {/* Reference Info */}
      <div className="font-mono text-[11px] text-[#8a9bb0] text-right leading-relaxed">
        <div>
          Portal Reference <span className="text-[#c9a84c]">LTD-2026</span>
        </div>
        <div>Secure Submission</div>
      </div>
    </header>
  );
}