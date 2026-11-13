import { Component, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../../../../core/services/content.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Modal } from '../../../../../shared/components/modal/modal';
import { Reveal } from '../../../../../shared/directives/reveal';

interface PqrsForm {
  type: string;
  personType: string;
  name: string;
  docType: string;
  docNumber: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

type TextField = Exclude<keyof PqrsForm, 'consent'>;

const EMPTY: PqrsForm = {
  type: 'Petición', personType: 'Natural', name: '', docType: 'Cédula de ciudadanía', docNumber: '',
  email: '', phone: '', subject: '', message: '', consent: false,
};

/**
 * Canal de PQRS (peticiones, quejas, reclamos, sugerencias y denuncias).
 * No requiere servidor: arma el correo y lo abre con el cliente de correo del visitante
 * (aplicación del equipo, Gmail u Outlook/Hotmail).
 */
@Component({
  selector: 'app-pqrs',
  imports: [Icon, Modal, Reveal],
  templateUrl: './pqrs.html',
  styleUrls: ['../pre-footer/pre-footer.scss', './pqrs.scss'],
})
export class Pqrs {
  private contentService = inject(ContentService);
  content = this.contentService.pqrs;

  types = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Denuncia', 'Felicitación'];
  docTypes = ['Cédula de ciudadanía', 'Cédula de extranjería', 'NIT', 'Pasaporte', 'Tarjeta de identidad', 'PPT'];

  isOpen = signal(false);
  ready = signal(false);
  showErrors = signal(false);
  sent = signal(false);
  copied = signal(false);
  radicado = signal('');
  private version = signal(0); // fuerza recálculo de los computed al editar el formulario

  form: PqrsForm = { ...EMPTY };

  open() {
    this.form = { ...EMPTY };
    this.ready.set(false);
    this.showErrors.set(false);
    this.sent.set(false);
    this.isOpen.set(true);
  }

  close() { this.isOpen.set(false); }

  set(field: TextField, event: Event) {
    this.form[field] = (event.target as HTMLInputElement).value;
    this.version.update(v => v + 1);
  }

  setCheck(event: Event) {
    this.form.consent = (event.target as HTMLInputElement).checked;
    this.version.update(v => v + 1);
  }

  private errors = computed(() => {
    this.version();
    const f = this.form;
    const e = new Set<string>();
    if (f.name.trim().length < 3) e.add('name');
    if (!/^[0-9A-Za-z.\-]{4,20}$/.test(f.docNumber.trim())) e.add('docNumber');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.add('email');
    if (f.subject.trim().length < 4) e.add('subject');
    if (f.message.trim().length < 10) e.add('message');
    if (!f.consent) e.add('consent');
    return e;
  });

  valid = computed(() => this.errors().size === 0);
  err(field: string) { return this.showErrors() && this.errors().has(field); }

  submit(event: Event) {
    event.preventDefault();
    this.showErrors.set(true);
    if (!this.valid()) return;
    this.radicado.set(this.buildRadicado());
    this.ready.set(true);
  }

  private buildRadicado() {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `PQRS-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}-${rnd}`;
  }

  mailSubject = computed(() => {
    this.version();
    return `PQRS WEB DELFOS - ${this.form.subject.trim()}`;
  });

  mailBody = computed(() => {
    this.version();
    const f = this.form;
    const fecha = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });
    return [
      `Radicado: ${this.radicado()}`,
      `Fecha: ${fecha}`,
      `Tipo de solicitud: ${f.type}`,
      '',
      'DATOS DEL SOLICITANTE',
      `Tipo de persona: ${f.personType}`,
      `${f.personType === 'Jurídica' ? 'Razón social' : 'Nombre'}: ${f.name.trim()}`,
      `Documento: ${f.docType} ${f.docNumber.trim()}`,
      `Correo: ${f.email.trim()}`,
      `Teléfono: ${f.phone.trim() || 'No indicado'}`,
      '',
      `ASUNTO: ${f.subject.trim()}`,
      '',
      'DESCRIPCIÓN',
      f.message.trim(),
      '',
      '---',
      'El solicitante autorizó el tratamiento de sus datos personales para gestionar esta solicitud (Ley 1581 de 2012).',
      'Enviado desde el formulario PQRS de seguridaddelfos.com',
    ].join('\n');
  });

  private enc(v: string) { return encodeURIComponent(v); }

  mailtoUrl = computed(() => `mailto:${this.content().email}?subject=${this.enc(this.mailSubject())}&body=${this.enc(this.mailBody())}`);
  gmailUrl = computed(() => `https://mail.google.com/mail/?view=cm&fs=1&to=${this.enc(this.content().email)}&su=${this.enc(this.mailSubject())}&body=${this.enc(this.mailBody())}`);
  outlookUrl = computed(() => `https://outlook.live.com/mail/0/deeplink/compose?to=${this.enc(this.content().email)}&subject=${this.enc(this.mailSubject())}&body=${this.enc(this.mailBody())}`);

  copy() {
    const text = `Para: ${this.content().email}\nAsunto: ${this.mailSubject()}\n\n${this.mailBody()}`;
    navigator.clipboard?.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }
}
