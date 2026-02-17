import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { contentService } from '../services/content.service';

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement,
                options: {
                    sitekey: string;
                    theme?: 'auto' | 'light' | 'dark';
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

export const ContactPage: React.FC = () => {
    const { t } = useTranslation();
    const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() || '';
    const turnstileContainerRef = React.useRef<HTMLDivElement | null>(null);
    const turnstileWidgetIdRef = React.useRef<string | null>(null);

    const [contactInfo, setContactInfo] = useState<{ email: string; location: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        website: '',
    });
    const [formStartedAtMs, setFormStartedAtMs] = useState<number>(() => Date.now());
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [submitError, setSubmitError] = useState('');

    const validateForm = (): string | null => {
        const name = formData.name.trim();
        const email = formData.email.trim();
        const message = formData.message.trim();
        const strictEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (name.length < 2) {
            return 'Please enter your name (at least 2 characters).';
        }
        if (!strictEmailPattern.test(email)) {
            return 'Please enter a valid email address.';
        }
        if (message.length < 10) {
            return 'Message must be at least 10 characters.';
        }

        return null;
    };

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

    React.useEffect(() => {
        if (!turnstileSiteKey) {
            return;
        }

        let cancelled = false;

        const loadScript = async (): Promise<void> => {
            if (window.turnstile) {
                return;
            }

            await new Promise<void>((resolve, reject) => {
                const src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
                if (existing) {
                    existing.addEventListener('load', () => resolve(), { once: true });
                    existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile script')), { once: true });
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Turnstile script'));
                document.head.appendChild(script);
            });
        };

        const setupTurnstile = async () => {
            try {
                await loadScript();
                if (cancelled || !window.turnstile || !turnstileContainerRef.current) {
                    return;
                }

                turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
                    sitekey: turnstileSiteKey,
                    theme: 'dark',
                    callback: (token: string) => setTurnstileToken(token),
                    'expired-callback': () => setTurnstileToken(''),
                    'error-callback': () => setTurnstileToken(''),
                });
            } catch (error) {
                console.error('Failed to initialize Turnstile:', error);
            }
        };

        void setupTurnstile();

        return () => {
            cancelled = true;
            if (turnstileWidgetIdRef.current && window.turnstile) {
                window.turnstile.remove(turnstileWidgetIdRef.current);
                turnstileWidgetIdRef.current = null;
            }
        };
    }, [turnstileSiteKey]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        const validationError = validateForm();
        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        if (turnstileSiteKey && !turnstileToken) {
            setSubmitError('Please complete the captcha challenge before sending your message.');
            return;
        }

        setIsSubmitting(true);
        try {
            await contentService.createMessage({
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: 'Contact Form Submission', // Default subject or add field
                content: formData.message.trim(),
                website: formData.website,
                submittedAtMs: formStartedAtMs,
                turnstileToken: turnstileToken || undefined,
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '', website: '' });
            setFormStartedAtMs(Date.now());
            setTurnstileToken('');
            if (turnstileWidgetIdRef.current && window.turnstile) {
                window.turnstile.reset(turnstileWidgetIdRef.current);
            }
        } catch (error) {
            console.error('Failed to submit message:', error);
            if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
                setSubmitError(error.response.data.error);
            } else {
                setSubmitError('Failed to send message. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
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
                                    <p className="font-medium">{t('contact_info.emailLabel')}</p>
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
                                    <p className="font-medium">{t('contact_info.locationLabel')}</p>
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
                                    <p className="font-medium">{t('contact_info.availabilityLabel')}</p>
                                    <p className="text-[var(--color-text-muted)]">
                                        {t('contact_info.availabilityValue')}
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
                                        minLength={2}
                                        required
                                        className="form-input"
                                        placeholder={t('placeholders.name')}
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
                                        placeholder={t('placeholders.email')}
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
                                        minLength={10}
                                        required
                                        rows={5}
                                        className="form-input resize-none"
                                        placeholder={t('placeholders.message')}
                                    />
                                </div>

                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="website">Website</label>
                                    <input
                                        type="text"
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        tabIndex={-1}
                                        className="form-input"
                                    />
                                </div>

                                {turnstileSiteKey && (
                                    <div className="pt-1">
                                        <div ref={turnstileContainerRef} />
                                    </div>
                                )}

                                {submitError && (
                                    <p className="text-sm text-red-400">{submitError}</p>
                                )}

                                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                                    {t('contact.send')}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="glass-card p-8 text-center flex flex-col items-center justify-center">
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold mb-2">{t('contact.success')}</h3>
                            <p className="text-[var(--color-text-muted)] mb-6">
                                {t('contact.successDetail')}
                            </p>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormStartedAtMs(Date.now());
                                }}
                            >
                                {t('contact.sendAnother')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
