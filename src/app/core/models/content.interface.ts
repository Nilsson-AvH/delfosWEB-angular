export interface Slide {
    id?: string;
    title: string;
    text: string;
    imageDesktop: string;
    imageMobile: string;
    linkText: string;
    linkUrl: string;
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
}

export interface PreFooterContent {
    text: string;
    pdfUrl: string;
    pdfButtonText: string;
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
