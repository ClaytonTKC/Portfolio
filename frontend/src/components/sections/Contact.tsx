import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder - would integrate with backend
        console.log('Form submitted:', formData);
        alert(t('contact.success'));
        setFormData({ name: '', email: '', message: '' });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="section bg-[var(--color-surface)]/30" id="contact">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('contact.title')}</h2>
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
                                    <p className="font-medium">{t('contact_info.emailLabel')}</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        claudio@portfolio.com
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
                                    <p className="font-medium">{t('contact_info.locationLabel')}</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        {t('contact_info.locationValue')}
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
                                    <p className="font-medium">{t('contact_info.availabilityLabel')}</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        {t('contact_info.availabilityValue')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="glass-card p-8">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
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
                                    placeholder={t('placeholders.name')}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
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
                                    placeholder={t('placeholders.email')}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
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
                                    placeholder={t('placeholders.message')}
                                />
                            </div>

                            <Button type="submit" variant="primary" className="w-full">
                                {t('contact.send')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
