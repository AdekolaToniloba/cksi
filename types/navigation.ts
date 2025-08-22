// types/navigation.ts
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  description?: string;
}

export interface NavigationDropdown {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  main: NavigationDropdown[];
  footer: {
    sections: FooterSection[];
    social: SocialMediaLink[];
  };
}

export interface FooterSection {
  title: string;
  links: NavigationItem[];
}

export interface SocialMediaLink {
  platform: "facebook" | "instagram" | "linkedin" | "twitter";
  url: string;
  icon: string;
}
