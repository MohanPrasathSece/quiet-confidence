export function Footer() {
  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-16 grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 text-[13px]">
        <div className="col-span-2">
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            className="flex items-center gap-2 text-[15px] font-medium tracking-tight"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-border bg-foreground text-background text-[11px] font-semibold">
              A
            </span>
            <span>AtlasLedger</span>
          </button>
          <p className="mt-4 max-w-xs text-muted-foreground leading-relaxed">
            Crypto infrastructure for the next generation of finance.
          </p>
        </div>
        {[
          { title: "Platform", links: ["Trading", "Custody", "Analytics", "Automation"] },
          { title: "Company", links: ["About", "Customers", "Careers", "Press"] },
          { title: "Resources", links: ["Status", "Security", "Contact"] },
        ].map((col) => {
          const linkMap: Record<string, string> = {
            "Trading": "#features",
            "Custody": "#security",
            "Analytics": "#features",
            "Automation": "#features",
            "Customers": "#customers",
            "Security": "#security",
            "Contact": "#contact",
          };
          return (
            <div key={col.title}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{col.title}</div>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href={linkMap[l] || "#"} className="text-foreground/80 hover:text-foreground transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground">
          <div>© {new Date().getFullYear()} AtlasLedger · Paris. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}