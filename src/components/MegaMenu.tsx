import type { MegaMenuSection, MegaMenuLink } from "@/types/nav";

interface MegaMenuProps {
  sections: (MegaMenuSection & { links: MegaMenuLink[] })[];
}

const MegaMenu = ({ sections }: MegaMenuProps) => {
  return (
    <div
      className="flex gap-8 p-8"
      style={{ minWidth: 320 }}
    >
      {sections.map((section) => (
        <div key={section.id} className="min-w-[180px]">
          <h3
            className="text-sm font-bold mb-3"
            style={{ color: '#2D1E0E', letterSpacing: '0.02em' }}
          >
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <span
                    className="text-sm font-medium transition-colors group-hover:text-[#FF6B1A]"
                    style={{ color: '#2D1E0E' }}
                  >
                    {link.label}
                  </span>
                  {link.description && (
                    <span
                      className="block text-xs mt-0.5"
                      style={{ color: '#7A6B5A' }}
                    >
                      {link.description}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
