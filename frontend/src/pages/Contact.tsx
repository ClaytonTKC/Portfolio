import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { contentService } from '../services/content.service';

export const ContactPage: React.FC = () => {
    const { t } = useTranslation();
    const [contactInfo, setContactInfo] = useState<{ email: string; location: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    React.useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { contentService } = await import('../services/content.service');
                const data = await contentService.getContactInfo();
                setContactInfo(data);
            } catch (error) {
                console.error('Failed to fetch contact info', error);
            }
        };
        fetchInfo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await contentService.createMessage({
                name: formData.name,
                email: formData.email,
                subject: 'Contact Form Submission', // Default subject or add field
                content: formData.message
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Failed to submit message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="section min-h-screen flex items-center">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="section-title">{t('contact.title')}</h1>
                    <p className="section-subtitle">{t('contact.subtitle')}</p>
                </div>

                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                    <span className="text-xl">📧</span>
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        {contactInfo?.email || 'Loading...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                    <span className="text-xl">📍</span>
                                </div>
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        {contactInfo?.location || 'Loading...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                    <span className="text-xl">⏰</span>
                                </div>
                                <div>
                                    <p className="font-medium">Availability</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        Mon - Fri, 9:00 AM - 6:00 PM PST
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="glass-card p-8">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        {t('contact.name')}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Clay Smith"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        {t('contact.email')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="clay@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        {t('contact.message')}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="form-input resize-none"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                <Button type="submit" variant="primary" className="w-full">
                                    {t('contact.send')}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="glass-card p-8 text-center flex flex-col items-center justify-center">
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold mb-2">{t('contact.success')}</h3>
                            <p className="text-[var(--color-text-muted)] mb-6">
                                I'll get back to you as soon as possible.
                            </p>
                            <Button
                                variant="secondary"
                                onClick={() => setSubmitted(false)}
                            >
                                Send Another Message
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
