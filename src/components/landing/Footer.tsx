import { Logo } from "@/components/Logo";

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
            aria-label="Retour en haut"
            className="flex items-center gap-2 text-[15px] font-medium tracking-tight"
          >
            <Logo className="h-5 w-5 text-foreground" />
            <span>AtlasLedger</span>
          </button>
          <p className="mt-4 max-w-xs text-muted-foreground leading-relaxed">
            Infrastructure crypto pour la prochaine génération de la finance.
          </p>
        </div>
        {[
          { title: "Plateforme", links: ["Trading", "Garde", "Analytique", "Automatisation"] },
          { title: "Entreprise", links: ["À propos", "Clients", "Carrières", "Presse"] },
          { title: "Ressources", links: ["Statut", "Sécurité", "Contact"] },
        ].map((col) => {
          const linkMap: Record<string, string> = {
            "Trading": "#features",
            "Garde": "#security",
            "Analytique": "#features",
            "Automatisation": "#features",
            "Clients": "#customers",
            "Sécurité": "#security",
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
          <div>© {new Date().getFullYear()} AtlasLedger · Paris. Tous droits réservés.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}