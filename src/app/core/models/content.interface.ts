export interface Slide {
    id?: string;
    title: string;
    text: string;
    imageDesktop: string;
    imageMobile: string;
    linkText: string;
    linkUrl: string;
    /** Texto ampliado que se muestra en la ventana "Ver más" (opcional). */
    details?: string;
}

export interface AboutUsItem {
    id?: string;
    title: string;
    imageUrl: string;
    description?: string;
}

export interface ServiceItem {
    id?: string;
    iconBg: string; // fa-solid fa-circle (usually fixed)
    icon: string; // fa-solid fa-house-lock
    title: string;
    description: string;
}

export interface Indicator {
    id?: string;
    number: number;
    label: string;
}

export interface GalleryItem {
    id?: string;
    imageUrl: string;
    alt: string;
}

export interface Testimonial {
    id?: string;
    text: string;
    authorName: string;
    authorRole: string;
    authorImage: string;
}

export interface NewsItem {
    id?: string;
    imageUrl: string;
    title: string;
    linkUrl: string;
    iframeUrl?: string; // Para incrustar artículos (ej. El Tiempo) sin salir
    description?: string; // Para noticias de texto directo
    source?: string; // Fuente y fecha, ej. "Supervigilancia · julio de 2025"
}

export interface SocialLinks {
    instagram: string;
    facebook: string;
    tiktok: string;
    linkedin: string;
}

export interface PqrsContent {
    title: string;
    text: string;
    /** Correo que recibe las PQRS */
    email: string;
    buttonText: string;
}

export interface PreFooterContent {
    text: string;
    pdfUrl: string;
    pdfButtonText: string;
}

export interface SiteContent {
    slides: Slide[];
    aboutUsTitle: string;
    aboutUsItems: AboutUsItem[];
    servicesTitle: string;
    servicesSubtitle: string;
    services: ServiceItem[];
    indicatorsTitle: string;
    indicators: Indicator[];
    galleryTitle: string;
    gallerySubtitle: string;
    galleryItems: GalleryItem[];
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    testimonials: Testimonial[];
    newsTitle: string;
    newsSubtitle: string;
    newsItems: NewsItem[];
    preFooter: PreFooterContent;
    contactNumber: string;
    utilsTitle: string;
    utilsLinks: ContentLink[];
    headerLinks: ContentLink[];
    footerAbout: FooterAbout;
    footerMainLinks: ContentLink[];
    socialLinks: SocialLinks;
    pqrs: PqrsContent;
}

export interface ContactInfo {
    contactNumber: string;
}

export interface ActionButton {
    text: string;
    url: string;
}

export type LinkType = 'internal' | 'external' | 'route';

export interface ContentLink {
    id?: string;
    text: string;
    type: LinkType;
    target: string;
}

export interface FooterAbout {
    title: string;
    description: string;
}
