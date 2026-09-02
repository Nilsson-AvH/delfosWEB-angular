import { Injectable, signal, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Slide, AboutUsItem, ServiceItem, Indicator, GalleryItem, Testimonial, NewsItem, PreFooterContent, ContactInfo, ActionButton, ContentLink, FooterAbout } from '../models/content.interface';

@Injectable({
    providedIn: 'root'
})
export class ContentService {

    // Header Data
    contactNumber = signal<string>('(+57) 601 523 0884');
    utilsTitle = signal<string>('Utils');
    utilsLinks = signal<ContentLink[]>([
        { id: '1', text: 'Asha CRM', type: 'external', target: 'http://asha-crm-url.com' },
        { id: '2', text: 'RondaKey', type: 'external', target: 'http://rondakey-url.com' }
    ]);
    headerLinks = signal<ContentLink[]>([
        { id: '1', text: 'Home', type: 'route', target: '/home' },
        { id: '2', text: 'About', type: 'internal', target: '#section-about' },
        { id: '3', text: 'Services', type: 'internal', target: '#section-services' },
        { id: '4', text: 'Indicators', type: 'internal', target: '#section-indicators' },
        { id: '5', text: 'Gallery', type: 'internal', target: '#section-gallery' }
    ]);

    // Footer Data
    footerAbout = signal<FooterAbout>({
        title: 'Delfos Ltda',
        description: '"Seguridad Delfos Ltda: más de 20 años brindando soluciones integrales de seguridad con cobertura nacional. Comprometidos con nuestros clientes y el bienestar de nuestro talento humano."'
    });
    footerMainLinks = signal<ContentLink[]>([
        { id: '1', text: 'About us', type: 'internal', target: '#section-about' },
        { id: '2', text: 'Delivery Information', type: 'route', target: '/delivery' },
        { id: '3', text: 'Terms & Condition', type: 'route', target: '/terms' },
        { id: '4', text: 'Privacy Policy', type: 'route', target: '/privacy' },
        { id: '5', text: 'Contac us', type: 'internal', target: '#section-contact' },
        { id: '6', text: 'Return Policy', type: 'route', target: '/returns' }
    ]);

    // Carousel Data
    slides = signal<Slide[]>([
        {
            id: '1',
            title: 'Physical Security Guards',
            text: 'Personal altamente capacitado brinda protección presencial en instalaciones comerciales y residenciales. Garantizamos control de acceso, rondas preventivas y respuesta inmediata ante cualquier eventualidad las 24 horas del día.',
            imageDesktop: 'images/generated-image01.webp',
            imageMobile: 'images/generated-image01-mf.webp',
            linkText: 'Learn More',
            linkUrl: '#'
        },
        {
            id: '2',
            title: 'Delfos Monitoring Center',
            text: 'Centro de monitoreo operando 24/7 con tecnología avanzada y personal especializado. Coordinamos operaciones de seguridad, gestionamos alarmas y videoseguridad en tiempo real para respuesta inmediata ante emergencias.',
            imageDesktop: 'images/generated-image02.webp',
            imageMobile: 'images/generated-image02-mf.webp',
            linkText: 'Learn More',
            linkUrl: '#'
        },
        {
            id: '3',
            title: 'Residential Complex Security',
            text: 'Vigilancia especializada para conjuntos residenciales con protocolos de propiedad horizontal. Ofrecemos guardas certificados, control de ingreso de visitantes, monitoreo de zonas comunes y atención permanente para tranquilidad de los residentes.',
            imageDesktop: 'images/generated-image03.webp',
            imageMobile: 'images/generated-image03-mf.webp',
            linkText: 'Learn More',
            linkUrl: '#'
        },
        {
            id: '4',
            title: 'CCTV Monitoring Services',
            text: 'Monitoreo remoto de cámaras de seguridad desde nuestro centro de control. Supervisión continua de imágenes en tiempo real, detección de actividades sospechosas y almacenamiento seguro de grabaciones para documentación y evidencia.',
            imageDesktop: 'images/generated-image04.webp',
            imageMobile: 'images/generated-image04-mf.webp',
            linkText: 'Learn More',
            linkUrl: '#'
        },
        {
            id: '5',
            title: 'Motorized Supervision',
            text: 'Patrullaje motorizado con escoltas certificados para desplazamientos ágiles y respuesta rápida. Ideal para supervisión de amplias zonas, reconocimiento de rutas y atención prioritaria a emergencias con máxima movilidad.',
            imageDesktop: 'images/generated-image05.webp',
            imageMobile: 'images/generated-image05-mf.webp',
            linkText: 'Learn More',
            linkUrl: '#'
        },
        {
            id: '6',
            title: 'Mobile Patrol Unit',
            text: 'Servicio de patrullaje vehicular para cobertura de extensas áreas con vigilancia preventiva y disuasoria. Unidades equipadas realizan rondas programadas, inspección perimetral y respuesta inmediata ante alertas de seguridad.',
            imageDesktop: 'images/generated-image06.webp',
            imageMobile: 'images/generated-image06-mf.webp',
            linkText: 'Learn More',
            linkUrl: '#'
        }
    ]);

    // About Us Data
    aboutUsTitle = signal<string>('We Always Try To Provide Cost Effective Security Solutions');
    aboutUsItems = signal<AboutUsItem[]>([
        {
            id: '1',
            title: 'Our Experience',
            imageUrl: 'images/keyboard-security.webp',
            description: 'Con más de 20 años de trayectoria ininterrumpida en el sector de la seguridad privada, hemos consolidado operaciones a nivel nacional protegiendo infraestructuras críticas y clientes de alto valor.'
        },
        {
            id: '2',
            title: 'Delfos History',
            imageUrl: 'images/security-cameras.webp',
            description: 'Fundada con la visión de transformar la vigilancia tradicional mediante la innovación tecnológica. Desde nuestros inicios hasta hoy, nuestra evolución constante nos mantiene como líderes del mercado.'
        },
        {
            id: '3',
            title: 'Our Mission',
            imageUrl: 'images/security-dial.webp',
            description: 'Nuestra misión es salvaguardar vidas, bienes y la tranquilidad absoluta de nuestros clientes, apoyados en personal altamente calificado y tecnología de vanguardia bajo estrictos protocolos de ética.'
        }
    ]);

    // Services Data
    servicesTitle = signal<string>('What We Offer');
    servicesSubtitle = signal<string>('OUR SERVICES');
    services = signal<ServiceItem[]>([
        {
            id: '1',
            iconBg: 'fa-solid fa-circle',
            icon: 'fa-solid fa-house-lock',
            title: 'HOME SECURITY',
            description: 'Vigilancia especializada para conjuntos residenciales y edificios. Protección 24/7 con personal capacitado, control de acceso y rondas preventivas que garantizan tranquilidad para su familia y propiedad.'
        },
        {
            id: '2',
            iconBg: 'fa-solid fa-circle',
            icon: 'fa-solid fa-camera',
            title: 'CCTV SYSTEM',
            description: 'Monitoreo en tiempo real con tecnología de videovigilancia avanzada. Cámaras de seguridad con grabación continua, visión nocturna y acceso remoto para supervisión constante de sus instalaciones.'
        },
        {
            id: '3',
            iconBg: 'fa-solid fa-circle',
            icon: 'fa-solid fa-lock',
            title: 'CLOUD SECURITY',
            description: 'Almacenamiento seguro de videos e información de vigilancia en servidores protegidos. Acceso inmediato a grabaciones desde cualquier dispositivo con máxima confidencialidad y respaldo automático.'
        },
        {
            id: '4',
            iconBg: 'fa-solid fa-circle',
            icon: 'fa-solid fa-computer',
            title: 'COMPUTER SECURITY',
            description: 'Protección integral de sistemas tecnológicos y datos empresariales. Control de acceso digital, monitoreo de equipos y prevención de amenazas cibernéticas para resguardar la información crítica de su organización.'
        },
        {
            id: '5',
            iconBg: 'fa-solid fa-circle',
            icon: 'fa-solid fa-person-military-pointing',
            title: 'BODYGUARD',
            description: 'Protección personal ejecutiva con personal altamente entrenado. Servicio especializado en seguridad física para directivos, empresarios y personas que requieren acompañamiento profesional en desplazamientos y eventos.'
        },
        {
            id: '6',
            iconBg: 'fa-solid fa-circle',
            icon: 'fa-solid fa-fingerprint',
            title: 'BIOMETRIC',
            description: 'Control de acceso inteligente mediante reconocimiento de huellas digitales y rasgos faciales. Tecnología avanzada que elimina tarjetas y códigos, garantizando identificación precisa e inviolable en sus instalaciones.'
        }
    ]);

    // Indicators Data
    indicatorsTitle = signal<string>('WE ARE READY TO PROVIDE SECURITY IN REASONABLE PRICE AND GUARANTEE YOUR SAFETY IN ANY SITUATION IN YOUR LIFE');
    indicators = signal<Indicator[]>([
        { id: '1', number: 2800, label: 'Project Done' },
        { id: '2', number: 1200, label: 'Qualified Employee' },
        { id: '3', number: 3100, label: 'Deal Assigned' },
        { id: '4', number: 2700, label: 'Satisfied Clients' }
    ]);

    // Gallery Data
    galleryTitle = signal<string>('See Our Experience');
    gallerySubtitle = signal<string>('PHOTO GALLERY');
    galleryItems = signal<GalleryItem[]>([
        { id: '1', imageUrl: 'images/image-card-1-gallery.webp', alt: 'Imagen card-gallery 1' },
        { id: '2', imageUrl: 'images/image-card-2-gallery.webp', alt: 'Imagen card-gallery 2' },
        { id: '3', imageUrl: 'images/image-card-3-gallery.webp', alt: 'Imagen card-gallery 3' },
        { id: '4', imageUrl: 'images/image-card-4-gallery.webp', alt: 'Imagen card-gallery 4' },
        { id: '5', imageUrl: 'images/image-card-5-gallery.webp', alt: 'Imagen card-gallery 5' },
        { id: '6', imageUrl: 'images/image-card-6-gallery.webp', alt: 'Imagen card-gallery 6' }
    ]);

    // Testimonials Data
    testimonialsTitle = signal<string>('What They Say');
    testimonialsSubtitle = signal<string>('Testimonials');
    testimonials = signal<Testimonial[]>([
        {
            id: '1',
            text: '"Desde que contratamos a Seguridad Delfos Ltda, nuestra tranquilidad ha sido total. Su profesionalismo y protocolo de seguridad son impecables, protegiendo nuestras instalaciones tecnológicas las 24 horas. Sin duda, la mejor inversión para proteger nuestros activos."',
            authorName: 'Sarah Mitchell',
            authorRole: 'CEO | GlobalTech Solutions',
            authorImage: 'images/client-image1.webp'
        },
        {
            id: '2',
            text: '"Seguridad Delfos Ltda ha transformado completamente nuestra seguridad en Pacific Trade & Logistics. Su sistema de vigilancia es excepcional y se adaptan perfectamente a nuestros horarios irregulares. Recomiendo Seguridad Delfos sin reservas."',
            authorName: 'Li Wei Chen',
            authorRole: 'CEO | Pacific Trade & Logistics',
            authorImage: 'images/client-image2.webp'
        },
        {
            id: '3',
            text: '"En Luxe Boutique Hotels, la seguridad y discreción son fundamentales. Seguridad Delfos Ltda ha superado todas nuestras expectativas con sistemas invisibles pero efectivos. Gracias a Delfos, nuestros huéspedes VIP se sienten completamente seguros."',
            authorName: 'Katerina Volkov',
            authorRole: 'CEO & Founder | Luxe Boutique Hotels',
            authorImage: 'images/client-image3.webp'
        }
    ]);

    // News Data
    newsTitle = signal<string>('Security Information');
    newsSubtitle = signal<string>('OUR LATEST NEWS');
    newsItems = signal<NewsItem[]>([
        { id: '1', imageUrl: 'images/image-news-card-1.webp', title: 'Security System Of Any Building', linkUrl: '#', description: 'This is a sample text-based news description. \n\nDelfos provides top tier security for any kind of building with high tech equipment and strict adherence to protocol. As you can see, this card does not redirect to El Tiempo, but displays our custom text instead.' },
        { id: '2', imageUrl: 'images/image-news-card-2.webp', title: 'Don’t Worry Your Data is Safe', linkUrl: '#', iframeUrl: 'https://www.eltiempo.com/tecnosfera/apps/como-proteger-sus-datos-personales-en-internet-3324089' },
        { id: '3', imageUrl: 'images/image-news-card-3.webp', title: 'Go next we are always with you', linkUrl: '#', iframeUrl: 'https://www.eltiempo.com/colombia/otras-ciudades/inseguridad-en-colombia-estas-son-las-ciudades-mas-peligrosas-del-pais-segun-encuesta-del-dane-3315628' }
    ]);

    // Pre-Footer Data
    preFooter = signal<PreFooterContent>({
        text: 'Download Our Corporate Brochure',
        pdfUrl: 'pdf/DELFOS_Dossier.pdf',
        pdfButtonText: 'DOWNLOAD.PDF'
    });

    private storageKey = 'delfos_content_data';
    private http = inject(HttpClient);
    private dataUrl = 'assets/data.json';
    private apiUrl = 'http://localhost:3000/api/save-content';

    constructor() {
        this.loadFromStorage();
    }

    private saveToStorage() {
        const data = {
            slides: this.slides(),
            aboutUsTitle: this.aboutUsTitle(),
            aboutUsItems: this.aboutUsItems(),
            servicesTitle: this.servicesTitle(),
            servicesSubtitle: this.servicesSubtitle(),
            services: this.services(),
            indicatorsTitle: this.indicatorsTitle(),
            indicators: this.indicators(),
            galleryTitle: this.galleryTitle(),
            gallerySubtitle: this.gallerySubtitle(),
            galleryItems: this.galleryItems(),
            testimonialsTitle: this.testimonialsTitle(),
            testimonialsSubtitle: this.testimonialsSubtitle(),
            testimonials: this.testimonials(),
            newsTitle: this.newsTitle(),
            newsSubtitle: this.newsSubtitle(),
            newsItems: this.newsItems(),
            preFooter: this.preFooter(),
            contactNumber: this.contactNumber(),
            utilsTitle: this.utilsTitle(),
            utilsLinks: this.utilsLinks(),
            headerLinks: this.headerLinks(),
            footerAbout: this.footerAbout(),
            footerMainLinks: this.footerMainLinks()
        };
        
        if (isDevMode()) {
            this.http.post(this.apiUrl, data).subscribe({
                next: () => console.log('✅ Content saved to local backend (data.json)'),
                error: (err) => console.error('❌ Error saving content to backend:', err)
            });
        }
    }

    private loadFromStorage() {
        const urlWithCacheBuster = `${this.dataUrl}?t=${new Date().getTime()}`;
        this.http.get<any>(urlWithCacheBuster).subscribe({
            next: (parsed) => {
                if (!parsed || Object.keys(parsed).length === 0) return;
                
                if (parsed.slides) this.slides.set(parsed.slides);
                if (parsed.aboutUsTitle) this.aboutUsTitle.set(parsed.aboutUsTitle);
                if (parsed.aboutUsItems) this.aboutUsItems.set(parsed.aboutUsItems);
                if (parsed.servicesTitle) this.servicesTitle.set(parsed.servicesTitle);
                if (parsed.servicesSubtitle) this.servicesSubtitle.set(parsed.servicesSubtitle);
                if (parsed.services) this.services.set(parsed.services);
                if (parsed.indicatorsTitle) this.indicatorsTitle.set(parsed.indicatorsTitle);
                if (parsed.indicators) this.indicators.set(parsed.indicators);
                if (parsed.galleryTitle) this.galleryTitle.set(parsed.galleryTitle);
                if (parsed.gallerySubtitle) this.gallerySubtitle.set(parsed.gallerySubtitle);
                if (parsed.galleryItems) this.galleryItems.set(parsed.galleryItems);
                if (parsed.testimonialsTitle) this.testimonialsTitle.set(parsed.testimonialsTitle);
                if (parsed.testimonialsSubtitle) this.testimonialsSubtitle.set(parsed.testimonialsSubtitle);
                if (parsed.testimonials) this.testimonials.set(parsed.testimonials);
                if (parsed.newsTitle) this.newsTitle.set(parsed.newsTitle);
                if (parsed.newsSubtitle) this.newsSubtitle.set(parsed.newsSubtitle);
                if (parsed.newsItems) this.newsItems.set(parsed.newsItems);
                if (parsed.preFooter) this.preFooter.set(parsed.preFooter);
                if (parsed.contactNumber) this.contactNumber.set(parsed.contactNumber);
                if (parsed.utilsTitle) this.utilsTitle.set(parsed.utilsTitle);
                if (parsed.utilsLinks) this.utilsLinks.set(parsed.utilsLinks);
                if (parsed.headerLinks) this.headerLinks.set(parsed.headerLinks);
                if (parsed.footerAbout) this.footerAbout.set(parsed.footerAbout);
                if (parsed.footerMainLinks) this.footerMainLinks.set(parsed.footerMainLinks);
            },
            error: (err) => console.log('No data.json found or error loading it, using hardcoded defaults', err)
        });
    }

    // --- CAROUSEL ---
    updateSlide(id: string, slide: Slide) {
        this.slides.update(slides => slides.map(s => s.id === id ? slide : s));
        this.saveToStorage();
    }

    addSlide(slide: Slide) {
        this.slides.update(slides => [...slides, slide]);
        this.saveToStorage();
    }

    deleteSlide(id: string) {
        this.slides.update(slides => slides.filter(s => s.id !== id));
        this.saveToStorage();
    }

    // --- ABOUT US ---
    updateAboutUsTitle(title: string) {
        this.aboutUsTitle.set(title);
        this.saveToStorage();
    }

    updateAboutUsItem(id: string, item: AboutUsItem) {
        this.aboutUsItems.update(items => items.map(i => i.id === id ? item : i));
        this.saveToStorage();
    }

    // --- SERVICES ---
    updateServicesTitle(title: string) {
        this.servicesTitle.set(title);
        this.saveToStorage();
    }
    updateServicesSubtitle(subtitle: string) {
        this.servicesSubtitle.set(subtitle);
        this.saveToStorage();
    }
    addService(service: ServiceItem) {
        this.services.update(s => [...s, service]);
        this.saveToStorage();
    }
    updateService(id: string, service: ServiceItem) {
        this.services.update(s => s.map(item => item.id === id ? service : item));
        this.saveToStorage();
    }
    deleteService(id: string) {
        this.services.update(s => s.filter(item => item.id !== id));
        this.saveToStorage();
    }

    // --- INDICATORS ---
    updateIndicatorsTitle(title: string) {
        this.indicatorsTitle.set(title);
        this.saveToStorage();
    }
    updateIndicator(id: string, indicator: Indicator) {
        this.indicators.update(items => items.map(i => i.id === id ? indicator : i));
        this.saveToStorage();
    }

    // --- GALLERY ---
    updateGalleryTitle(title: string) {
        this.galleryTitle.set(title);
        this.saveToStorage();
    }
    updateGallerySubtitle(subtitle: string) {
        this.gallerySubtitle.set(subtitle);
        this.saveToStorage();
    }
    addGalleryItem(item: GalleryItem) {
        this.galleryItems.update(items => [...items, item]);
        this.saveToStorage();
    }
    updateGalleryItem(id: string, item: GalleryItem) {
        this.galleryItems.update(items => items.map(i => i.id === id ? item : i));
        this.saveToStorage();
    }
    deleteGalleryItem(id: string) {
        this.galleryItems.update(items => items.filter(i => i.id !== id));
        this.saveToStorage();
    }

    // --- TESTIMONIALS ---
    updateTestimonialsTitle(title: string) {
        this.testimonialsTitle.set(title);
        this.saveToStorage();
    }
    updateTestimonialsSubtitle(subtitle: string) {
        this.testimonialsSubtitle.set(subtitle);
        this.saveToStorage();
    }
    addTestimonial(testimonial: Testimonial) {
        this.testimonials.update(items => [...items, testimonial]);
        this.saveToStorage();
    }
    updateTestimonial(id: string, testimonial: Testimonial) {
        this.testimonials.update(items => items.map(i => i.id === id ? testimonial : i));
        this.saveToStorage();
    }
    deleteTestimonial(id: string) {
        this.testimonials.update(items => items.filter(i => i.id !== id));
        this.saveToStorage();
    }

    // --- NEWS ---
    updateNewsTitle(title: string) {
        this.newsTitle.set(title);
        this.saveToStorage();
    }
    updateNewsSubtitle(subtitle: string) {
        this.newsSubtitle.set(subtitle);
        this.saveToStorage();
    }
    addNewsItem(item: NewsItem) {
        this.newsItems.update(items => [...items, item]);
        this.saveToStorage();
    }
    updateNewsItem(id: string, item: NewsItem) {
        this.newsItems.update(items => items.map(i => i.id === id ? item : i));
        this.saveToStorage();
    }
    deleteNewsItem(id: string) {
        this.newsItems.update(items => items.filter(i => i.id !== id));
        this.saveToStorage();
    }

    // --- PRE-FOOTER ---
    updatePreFooter(content: PreFooterContent) {
        this.preFooter.set(content);
        this.saveToStorage();
    }

    // --- HEADER ---
    updateContactNumber(number: string) {
        this.contactNumber.set(number);
        this.saveToStorage();
    }
    updateUtilsTitle(title: string) {
        this.utilsTitle.set(title);
        this.saveToStorage();
    }
    addUtilsLink(link: ContentLink) {
        this.utilsLinks.update(links => [...links, link]);
        this.saveToStorage();
    }
    updateUtilsLink(id: string, link: ContentLink) {
        this.utilsLinks.update(links => links.map(l => l.id === id ? link : l));
        this.saveToStorage();
    }
    deleteUtilsLink(id: string) {
        this.utilsLinks.update(links => links.filter(l => l.id !== id));
        this.saveToStorage();
    }
    addHeaderLink(link: ContentLink) {
        this.headerLinks.update(links => [...links, link]);
        this.saveToStorage();
    }
    updateHeaderLink(id: string, link: ContentLink) {
        this.headerLinks.update(links => links.map(l => l.id === id ? link : l));
        this.saveToStorage();
    }
    deleteHeaderLink(id: string) {
        this.headerLinks.update(links => links.filter(l => l.id !== id));
        this.saveToStorage();
    }

    // --- FOOTER ---
    updateFooterAbout(about: FooterAbout) {
        this.footerAbout.set(about);
        this.saveToStorage();
    }
    addFooterMainLink(link: ContentLink) {
        this.footerMainLinks.update(links => [...links, link]);
        this.saveToStorage();
    }
    updateFooterMainLink(id: string, link: ContentLink) {
        this.footerMainLinks.update(links => links.map(l => l.id === id ? link : l));
        this.saveToStorage();
    }
    deleteFooterMainLink(id: string) {
        this.footerMainLinks.update(links => links.filter(l => l.id !== id));
        this.saveToStorage();
    }
}
