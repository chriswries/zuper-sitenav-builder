import { useState, useRef, useCallback, useEffect } from "react";
import ZuperLogo from "./ZuperLogo";
import MegaMenu from "./MegaMenu";
import type { NavItemWithSections } from "@/types/nav";

interface NavPreviewProps {
  navItems: NavItemWithSections[];
}

const NavPreview = ({ navItems }: NavPreviewProps) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const handleItemEnter = useCallback((itemId: string, hasSections: boolean) => {
    if (!hasSections) return;
    clearTimers();
    openTimeoutRef.current = setTimeout(() => {
      setActiveItemId(itemId);
    }, 150);
  }, [clearTimers]);

  const handleItemLeave = useCallback(() => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveItemId(null);
    }, 200);
  }, [clearTimers]);

  const handleMenuEnter = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleMenuLeave = useCallback(() => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveItemId(null);
    }, 200);
  }, [clearTimers]);

  // Close mega menu on click outside
  useEffect(() => {
    if (!activeItemId) return;
    const handleClick = () => setActiveItemId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [activeItemId]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const regularItems = navItems.filter((item) => !item.is_cta);
  const ctaItem = navItems.find((item) => item.is_cta);
  const activeItem = navItems.find((item) => item.id === activeItemId);

  return (
    <div className="relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Nav bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3"
        style={{
          background: 'rgba(255,248,240,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,107,26,0.08)',
        }}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <ZuperLogo />
        </div>

        {/* Center nav links */}
        <div className="flex items-center gap-6">
          {regularItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => handleItemEnter(item.id, item.sections.length > 0)}
              onMouseLeave={handleItemLeave}
            >
              {item.sections.length > 0 ? (
                <button
                  className="bg-transparent border-none cursor-pointer transition-colors"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    color: activeItemId === item.id ? '#FF6B1A' : '#2D1E0E',
                    padding: '4px 0',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline transition-colors hover:text-[#FF6B1A]"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    color: '#2D1E0E',
                    padding: '4px 0',
                  }}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* CTA button */}
        {ctaItem && (
          <a
            href={ctaItem.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline transition-all"
            style={{
              background: '#FF6B1A',
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.875rem',
              padding: '10px 24px',
              borderRadius: 100,
              boxShadow: '0 2px 12px rgba(255,107,26,0.3)',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#E85A0A';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#FF6B1A';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            {ctaItem.label}
          </a>
        )}
      </nav>

      {/* Mega menu dropdown */}
      {activeItem && activeItem.sections.length > 0 && (
        <div
          className="fixed z-40 left-1/2 -translate-x-1/2"
          style={{ top: 56 }}
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Invisible bridge to prevent flicker between nav item and dropdown */}
          <div style={{ height: 8 }} />
          <div
            style={{
              background: '#FDF6ED',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <MegaMenu sections={activeItem.sections} layout={activeItem.mega_menu_layout} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavPreview;
