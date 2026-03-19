export interface NavItem {
  id: string;
  label: string;
  url: string | null;
  sort_order: number;
  is_cta: boolean;
  created_at: string;
  updated_at: string;
}

export interface MegaMenuSection {
  id: string;
  nav_item_id: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface MegaMenuLink {
  id: string;
  section_id: string;
  label: string;
  url: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface NavItemWithSections extends NavItem {
  sections: (MegaMenuSection & { links: MegaMenuLink[] })[];
}
