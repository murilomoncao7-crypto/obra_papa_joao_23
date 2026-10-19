export type ContentStatus = "draft" | "inReview" | "published" | "archived";

export type PortableTextContent = Array<{
  _type: string;
  _key?: string;
  [key: string]: unknown;
}>;

export interface PublicationImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: string;
  context?: string;
  photographedAt?: string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  image?: GalleryImage;
  noIndex?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: string;
  status: ContentStatus;
  variants?: Partial<Record<"hero" | "card" | "gallery" | "thumbnail", ImageVariant>>;
}

export interface ImageVariant {
  src: string;
  width: number;
  height: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
  external?: boolean;
}

export interface SiteSettings {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  logo?: GalleryImage;
  navigation: NavigationItem[];
  contacts: ContactChannel[];
  socialLinks: SocialLink[];
  seo?: SeoMetadata;
}

export interface HomePageContent {
  hero: {
    title: string;
    summary: string;
    summaryAccent?: string;
    image: GalleryImage;
    primaryAction: NavigationItem;
    secondaryAction: NavigationItem;
  };
  quickInformation: Array<{
    id: string;
    label: string;
    value: string;
    href?: string;
  }>;
  institution: {
    title: string;
    summary: string;
    history: string;
    foundationYear: string;
    foundationNote: string;
  };
  activityIntroduction: string;
  participation: {
    title: string;
    summary: string;
    options: string[];
  };
  galleryIntroduction: string;
  locationTitle: string;
  gallery: GalleryImage[];
}

export interface InstitutionalPage {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content: string | string[];
  image?: GalleryImage;
  gallery?: GalleryImage[];
  sections?: Array<{
    id: string;
    title: string;
    content?: string | string[];
    items?: string[];
  }>;
  status: ContentStatus;
  seo?: SeoMetadata;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content?: string | string[];
  image?: GalleryImage;
  gallery?: GalleryImage[];
  schedules?: Schedule[];
  audience?: string;
  frequency?: string;
  location?: string;
  responsible?: string;
  contacts?: ContactChannel[];
  participation?: NavigationItem;
  status: ContentStatus;
  seo?: SeoMetadata;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | PortableTextContent;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  coverImageAlt: string;
  coverImageCaption?: string;
  coverImageCredit?: string;
  coverImageContext?: string;
  gallery?: PublicationImage[];
  socialImage?: PublicationImage;
  featured?: boolean;
  status: ContentStatus;
  seo?: SeoMetadata;
}

export type EventKind = "event" | "campaign";

export interface Event {
  id: string;
  slug: string;
  kind: EventKind;
  title: string;
  summary: string;
  content: string | string[];
  sections?: Array<{
    id: string;
    title: string;
    content: string | string[];
  }>;
  startsAt: string;
  endsAt?: string;
  time?: string;
  location?: string;
  image?: string;
  imageAlt?: string;
  gallery?: GalleryImage[];
  registrationUrl?: string;
  eventStatus: "scheduled" | "cancelled" | "completed";
  contacts: ContactChannel[];
  status: ContentStatus;
  seo?: SeoMetadata;
}

export interface Schedule {
  id: string;
  label: string;
  dayOfWeek?: number[];
  startsAt?: string;
  endsAt?: string;
  notes?: string;
  status: ContentStatus;
}

export type ContactChannelType = "address" | "email" | "phone" | "whatsapp" | "map" | "other";

export interface ContactChannel {
  id: string;
  type: ContactChannelType;
  label: string;
  value: string;
  href?: string;
  status: ContentStatus;
}

export type SocialNetwork = "facebook" | "instagram" | "other";

export interface SocialLink {
  id: string;
  network: SocialNetwork;
  label: string;
  href: string;
  status: ContentStatus;
}
