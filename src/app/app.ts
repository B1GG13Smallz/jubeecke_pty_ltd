import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly businessEmail = 'jubeeke.fuel@gmail.com';
  readonly phonePattern = '^[+0-9][0-9\\s()\\-]{6,}$';
  readonly maxAttachmentSizeMb = 10;

  navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  services = [
    {
      title: 'On-Site Diesel Delivery',
      text: 'Fast and reliable diesel refilling delivered directly to your site when you need it most.',
      tag: 'Delivery',
      image: '/images/service.jpeg',
    },
    {
      title: 'Diesel Bowser Rental',
      text: 'Short-term and long-term bowser rental solutions for construction, industrial and fleet operations.',
      tag: 'Rental',
      image: '/images/bowserrental.jpeg',
    },
    {
      title: 'Mobile Fuel Supply',
      text: 'Convenient mobile fuel supply for businesses that require dependable on-site refuelling.',
      tag: 'Mobile',
      image: '/images/diesel.jpeg',
    },
    {
      title: 'Industrial & Construction Fuel Solutions',
      text: 'Fuel solutions built for construction sites, mining operations, agriculture, transport and industrial businesses.',
      tag: 'Industrial',
      image: '/images/industrial.jpeg',
    },
  ];

  reasons = [
    'Fast on-site delivery',
    'Reliable diesel supply',
    'Bowser rental available',
    'Serving within 300km radius',
    'Built for commercial and industrial operations',
    'Professional and dependable service',
  ];

  gallery = [
    { src: '/images/delivery.jpeg', alt: 'JUBEECKE fuel delivery vehicle', label: 'Delivery Fleet' },
    { src: '/images/fillup.jpeg', alt: 'Diesel refilling service on site', label: 'On-Site Refilling' },
    { src: '/images/MobileFuel.jpeg', alt: 'Mobile fuel supply vehicle', label: 'Mobile Fuel Supply' },
    { src: '/images/machinery.jpeg', alt: 'Industrial machinery fuel solution', label: 'Industrial Sites' },
  ];

  formData = {
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    service: 'Diesel Refilling',
    message: '',
  };

  submitted = false;
  submitAttempted = false;
  emailDialogOpen = false;
  emailMessage = '';
  emailFiles: File[] = [];
  emailDialogError = '';

  openEmailDialog(message = ''): void {
    this.emailMessage = message || this.formData.message;
    this.emailFiles = [];
    this.emailDialogError = '';
    this.emailDialogOpen = true;
  }

  closeEmailDialog(): void {
    this.emailDialogOpen = false;
    this.emailDialogError = '';
  }

  addEmailAttachments(fileList: FileList | null): void {
    if (!fileList?.length) {
      return;
    }

    const maxBytes = this.maxAttachmentSizeMb * 1024 * 1024;
    const acceptedFiles = Array.from(fileList).filter((file) => file.size <= maxBytes);
    const rejectedCount = fileList.length - acceptedFiles.length;

    this.emailFiles = [...this.emailFiles, ...acceptedFiles];
    this.emailDialogError = rejectedCount
      ? `${rejectedCount} attachment(s) were larger than ${this.maxAttachmentSizeMb}MB and were not added.`
      : '';
  }

  handleEmailDrop(event: DragEvent): void {
    event.preventDefault();
    this.addEmailAttachments(event.dataTransfer?.files ?? null);
  }

  removeEmailAttachment(index: number): void {
    this.emailFiles = this.emailFiles.filter((_, fileIndex) => fileIndex !== index);
  }

  sendEmailFromDialog(): void {
    const message = this.emailMessage.trim();

    if (!message) {
      this.emailDialogError = 'Please write a message before sending.';
      return;
    }

    const attachmentNote = this.emailFiles.length
      ? [
          '',
          'Attachments selected:',
          ...this.emailFiles.map((file) => `- ${file.name} (${this.formatFileSize(file.size)})`),
          '',
          'Please attach these files in your email app before sending.',
        ].join('\n')
      : '';

    this.openMailClient('Website enquiry', `${message}${attachmentNote}`);
    this.closeEmailDialog();
  }

  submitEnquiry(enquiryForm: NgForm): void {
    this.submitAttempted = true;
    this.submitted = false;

    if (enquiryForm.invalid) {
      enquiryForm.control.markAllAsTouched();
      return;
    }

    this.openMailClient(`Fuel enquiry from ${this.formData.fullName.trim()}`, this.buildEnquiryBody());
    this.submitted = true;
  }

  private buildEnquiryBody(): string {
    return [
      `Full Name: ${this.formData.fullName.trim()}`,
      `Company Name: ${this.formData.companyName.trim()}`,
      `Phone Number: ${this.formData.phone.trim()}`,
      `Email Address: ${this.formData.email.trim()}`,
      `Service Needed: ${this.formData.service.trim()}`,
      '',
      'Message:',
      this.formData.message.trim(),
    ].join('\n');
  }

  private openMailClient(subjectText: string, bodyText: string): void {
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);

    window.location.href = `mailto:${this.businessEmail}?subject=${subject}&body=${body}`;
  }

  private formatFileSize(size: number): string {
    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
}
