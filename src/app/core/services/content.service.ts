import { Injectable, signal, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
    Slide, AboutUsItem, ServiceItem, Indicator, GalleryItem, Testimonial, NewsItem,
    PreFooterContent, ContentLink, FooterAbout, SiteContent, SocialLinks, PqrsContent
} from '../models/content.interface';
// El contenido se incluye en el bundle: la página se pinta desde el primer instante
// con los textos definitivos (en español) y no hay "parpadeo" de contenido por defecto.
import initialData from '../../../assets/data.json';

export type ToastKind = 'success' | 'error' | 'info';
export interface Toast { id: number; text: string; kind: ToastKind; }

/**
 * Dónde se guardan los cambios del panel:
 *  - local:  `npm run dev` → server.js escribe src/assets/data.json y public/
 *  - cloud:  sitio publicado en Cloudflare Pages → Pages Functions + KV (carpeta /functions)
 *  - none:   no hay almacenamiento disponible (los cambios solo duran la sesión)
 */
export type StorageMode = 'checking' | 'local' | 'cloud' | 'none';

/**
 * En producción, la Pages Function (functions/_middleware.ts) inyecta en el HTML el contenido
 * guardado desde el panel. Así la página se pinta directamente con la versión más reciente,
 * sin parpadeos y sin peticiones adicionales.
 */
function readInjectedContent(): Partial<SiteContent> {
    try {
        const el = typeof document !== 'undefined' ? document.getElementById('delfos-content') : null;
        return el?.textContent ? JSON.parse(el.textContent) : {};
    } catch {
        return {};
    }
}

const DATA: SiteContent = { ...(initialData as unknown as SiteContent), ...readInjectedContent() };

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    storageMode = signal<StorageMode>(isDevMode() ? 'local' : 'checking');

    // Header
    contactNumber = signal<string>(DATA.contactNumber);
    utilsTitle = signal<string>(DATA.utilsTitle);
    utilsLinks = signal<ContentLink[]>(DATA.utilsLinks);
    headerLinks = signal<ContentLink[]>(DATA.headerLinks);

    // Footer
    footerAbout = signal<FooterAbout>(DATA.footerAbout);
    footerMainLinks = signal<ContentLink[]>(DATA.footerMainLinks);

    // Secciones
    slides = signal<Slide[]>(DATA.slides);
    aboutUsTitle = signal<string>(DATA.aboutUsTitle);
    aboutUsItems = signal<AboutUsItem[]>(DATA.aboutUsItems);
    servicesTitle = signal<string>(DATA.servicesTitle);
    servicesSubtitle = signal<string>(DATA.servicesSubtitle);
    services = signal<ServiceItem[]>(DATA.services);
    indicatorsTitle = signal<string>(DATA.indicatorsTitle);
    indicators = signal<Indicator[]>(DATA.indicators);
    galleryTitle = signal<string>(DATA.galleryTitle);
    gallerySubtitle = signal<string>(DATA.gallerySubtitle);
    galleryItems = signal<GalleryItem[]>(DATA.galleryItems);
    testimonialsTitle = signal<string>(DATA.testimonialsTitle);
    testimonialsSubtitle = signal<string>(DATA.testimonialsSubtitle);
    testimonials = signal<Testimonial[]>(DATA.testimonials);
    newsTitle = signal<string>(DATA.newsTitle);
    newsSubtitle = signal<string>(DATA.newsSubtitle);
    newsItems = signal<NewsItem[]>(DATA.newsItems);
    preFooter = signal<PreFooterContent>(DATA.preFooter);
    socialLinks = signal<SocialLinks>(DATA.socialLinks);
    pqrs = signal<PqrsContent>(DATA.pqrs);

    // Notificaciones del panel administrador
    toasts = signal<Toast[]>([]);

    private http = inject(HttpClient);
    private dataUrl = 'assets/data.json';
    private localApi = 'http://localhost:3000/api';
    private cloudApi = '/admin/api';

    constructor() {
        // Solo en desarrollo: refresca desde data.json por si el archivo cambió sin recompilar.
        if (isDevMode()) {
            this.loadFromFile();
            this.restorePendingToast();
        }
    }

    /**
     * En modo local, guardar data.json hace que `ng serve` recargue la página.
     * El aviso se guarda un momento en sessionStorage para mostrarlo después de la recarga.
     */
    private rememberToast(text: string) {
        try { sessionStorage.setItem('delfos_toast', JSON.stringify({ text, at: Date.now() })); } catch { /* sin almacenamiento */ }
    }

    private restorePendingToast() {
        try {
            const raw = sessionStorage.getItem('delfos_toast');
            sessionStorage.removeItem('delfos_toast');
            const t = raw ? JSON.parse(raw) : null;
            if (t && Date.now() - t.at < 15000) setTimeout(() => this.notify(t.text), 300);
        } catch { /* sin almacenamiento */ }
    }

    /** Consulta (desde el panel) si el sitio publicado tiene almacenamiento configurado. */
    detectStorage() {
        if (isDevMode() || this.storageMode() !== 'checking') return;
        this.http.get<{ ok: boolean; storage: boolean }>(`${this.cloudApi}/status`).subscribe({
            next: r => this.storageMode.set(r?.ok && r.storage ? 'cloud' : 'none'),
            error: () => this.storageMode.set('none')
        });
    }

    notify(text: string, kind: ToastKind = 'success') {
        const id = Date.now() + Math.random();
        this.toasts.update(t => [...t, { id, text, kind }]);
        setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 4000);
    }

    snapshot(): SiteContent {
        return {
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
            footerMainLinks: this.footerMainLinks(),
            socialLinks: this.socialLinks(),
            pqrs: this.pqrs()
        };
    }

    private saveToStorage() {
        const mode = this.storageMode();
        if (mode === 'local') {
            this.http.post(`${this.localApi}/save-content`, this.snapshot()).subscribe({
                next: () => {
                    this.rememberToast('Cambios guardados en data.json');
                    this.notify('Cambios guardados en data.json');
                },
                error: () => this.notify('No se pudo guardar. ¿Está corriendo el servidor local (node server.js)?', 'error')
            });
        } else if (mode === 'cloud') {
            this.http.put(`${this.cloudApi}/content`, this.snapshot()).subscribe({
                next: () => this.notify('Cambios publicados. Ya están visibles en el sitio.'),
                error: (e) => this.notify(this.cloudError(e, 'No se pudieron publicar los cambios'), 'error')
            });
        } else {
            this.notify('Cambio aplicado solo en esta sesión: el almacenamiento del sitio no está configurado.', 'info');
        }
    }

    private cloudError(e: { status?: number; error?: { message?: string } }, fallback: string) {
        if (e?.status === 0 || e?.status === 401 || e?.status === 403) return 'Tu sesión de Cloudflare Access expiró. Recarga la página e ingresa de nuevo.';
        return e?.error?.message || fallback;
    }

    /**
     * Sube un archivo (PDF o imagen) al backend local. Devuelve la ruta pública
     * relativa (ej. "pdf/brochure.pdf" o "images/foto.webp").
     */
    uploadFile(file: File, folder: 'pdf' | 'images'): Observable<string> {
        const base = this.storageMode() === 'cloud' ? this.cloudApi : this.localApi;
        const url = `${base}/upload?folder=${folder}&name=${encodeURIComponent(file.name)}`;
        return this.http.post<{ success: boolean; path: string }>(url, file, {
            headers: { 'Content-Type': file.type || 'application/octet-stream' }
        }).pipe(map(r => r.path));
    }

    /** Descarga el contenido actual como data.json (para respaldarlo o llevarlo al código fuente). */
    exportJson() {
        const blob = new Blob([JSON.stringify(this.snapshot(), null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'data.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    /** Borra el contenido publicado desde el panel y vuelve al data.json incluido en el código. */
    resetCloudContent() {
        return this.http.delete(`${this.cloudApi}/content`);
    }

    /** true si el panel puede subir archivos de forma permanente */
    canUpload() { return this.storageMode() === 'local' || this.storageMode() === 'cloud'; }

    private loadFromFile() {
        this.http.get<Partial<SiteContent>>(`${this.dataUrl}?t=${Date.now()}`).subscribe({
            next: (parsed) => {
                if (!parsed || Object.keys(parsed).length === 0) return;
                const self = this as unknown as Record<string, { set?: (v: unknown) => void } | undefined>;
                for (const [key, value] of Object.entries(parsed)) {
                    const target = self[key];
                    if (value !== undefined && value !== null && typeof target?.set === 'function') target.set(value);
                }
            },
            error: () => { /* se usan los datos incluidos en el bundle */ }
        });
    }

    // --- CAROUSEL ---
    updateSlide(id: string, slide: Slide) { this.slides.update(s => s.map(x => x.id === id ? slide : x)); this.saveToStorage(); }
    addSlide(slide: Slide) { this.slides.update(s => [...s, slide]); this.saveToStorage(); }
    deleteSlide(id: string) { this.slides.update(s => s.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- ABOUT US ---
    updateAboutUsTitle(title: string) { this.aboutUsTitle.set(title); this.saveToStorage(); }
    updateAboutUsItem(id: string, item: AboutUsItem) { this.aboutUsItems.update(i => i.map(x => x.id === id ? item : x)); this.saveToStorage(); }
    addAboutUsItem(item: AboutUsItem) { this.aboutUsItems.update(i => [...i, item]); this.saveToStorage(); }
    deleteAboutUsItem(id: string) { this.aboutUsItems.update(i => i.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- SERVICES ---
    updateServicesTitle(title: string) { this.servicesTitle.set(title); this.saveToStorage(); }
    updateServicesSubtitle(subtitle: string) { this.servicesSubtitle.set(subtitle); this.saveToStorage(); }
    addService(service: ServiceItem) { this.services.update(s => [...s, service]); this.saveToStorage(); }
    updateService(id: string, service: ServiceItem) { this.services.update(s => s.map(x => x.id === id ? service : x)); this.saveToStorage(); }
    deleteService(id: string) { this.services.update(s => s.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- INDICATORS ---
    updateIndicatorsTitle(title: string) { this.indicatorsTitle.set(title); this.saveToStorage(); }
    updateIndicator(id: string, indicator: Indicator) { this.indicators.update(i => i.map(x => x.id === id ? indicator : x)); this.saveToStorage(); }
    addIndicator(indicator: Indicator) { this.indicators.update(i => [...i, indicator]); this.saveToStorage(); }
    deleteIndicator(id: string) { this.indicators.update(i => i.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- GALLERY ---
    updateGalleryTitle(title: string) { this.galleryTitle.set(title); this.saveToStorage(); }
    updateGallerySubtitle(subtitle: string) { this.gallerySubtitle.set(subtitle); this.saveToStorage(); }
    addGalleryItem(item: GalleryItem) { this.galleryItems.update(i => [...i, item]); this.saveToStorage(); }
    updateGalleryItem(id: string, item: GalleryItem) { this.galleryItems.update(i => i.map(x => x.id === id ? item : x)); this.saveToStorage(); }
    deleteGalleryItem(id: string) { this.galleryItems.update(i => i.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- TESTIMONIALS ---
    updateTestimonialsTitle(title: string) { this.testimonialsTitle.set(title); this.saveToStorage(); }
    updateTestimonialsSubtitle(subtitle: string) { this.testimonialsSubtitle.set(subtitle); this.saveToStorage(); }
    addTestimonial(t: Testimonial) { this.testimonials.update(i => [...i, t]); this.saveToStorage(); }
    updateTestimonial(id: string, t: Testimonial) { this.testimonials.update(i => i.map(x => x.id === id ? t : x)); this.saveToStorage(); }
    deleteTestimonial(id: string) { this.testimonials.update(i => i.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- NEWS ---
    updateNewsTitle(title: string) { this.newsTitle.set(title); this.saveToStorage(); }
    updateNewsSubtitle(subtitle: string) { this.newsSubtitle.set(subtitle); this.saveToStorage(); }
    addNewsItem(item: NewsItem) { this.newsItems.update(i => [...i, item]); this.saveToStorage(); }
    updateNewsItem(id: string, item: NewsItem) { this.newsItems.update(i => i.map(x => x.id === id ? item : x)); this.saveToStorage(); }
    deleteNewsItem(id: string) { this.newsItems.update(i => i.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- PRE-FOOTER ---
    updatePreFooter(content: PreFooterContent) { this.preFooter.set(content); this.saveToStorage(); }

    // --- HEADER ---
    updateContactNumber(n: string) { this.contactNumber.set(n); this.saveToStorage(); }
    updateUtilsTitle(title: string) { this.utilsTitle.set(title); this.saveToStorage(); }
    addUtilsLink(link: ContentLink) { this.utilsLinks.update(l => [...l, link]); this.saveToStorage(); }
    updateUtilsLink(id: string, link: ContentLink) { this.utilsLinks.update(l => l.map(x => x.id === id ? link : x)); this.saveToStorage(); }
    deleteUtilsLink(id: string) { this.utilsLinks.update(l => l.filter(x => x.id !== id)); this.saveToStorage(); }
    addHeaderLink(link: ContentLink) { this.headerLinks.update(l => [...l, link]); this.saveToStorage(); }
    updateHeaderLink(id: string, link: ContentLink) { this.headerLinks.update(l => l.map(x => x.id === id ? link : x)); this.saveToStorage(); }
    deleteHeaderLink(id: string) { this.headerLinks.update(l => l.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- FOOTER ---
    updateFooterAbout(about: FooterAbout) { this.footerAbout.set(about); this.saveToStorage(); }
    addFooterMainLink(link: ContentLink) { this.footerMainLinks.update(l => [...l, link]); this.saveToStorage(); }
    updateFooterMainLink(id: string, link: ContentLink) { this.footerMainLinks.update(l => l.map(x => x.id === id ? link : x)); this.saveToStorage(); }
    deleteFooterMainLink(id: string) { this.footerMainLinks.update(l => l.filter(x => x.id !== id)); this.saveToStorage(); }

    // --- REDES SOCIALES y PQRS ---
    updateSocialLinks(links: SocialLinks) { this.socialLinks.set(links); this.saveToStorage(); }
    updatePqrs(content: PqrsContent) { this.pqrs.set(content); this.saveToStorage(); }
}
