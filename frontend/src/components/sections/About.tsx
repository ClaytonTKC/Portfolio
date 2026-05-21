import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contentService, type ContactInfo } from '../../services/content.service';

export const About: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [info, setInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const isFr = i18n.language?.startsWith('fr');

    useEffect(() => {
        contentService.getContactInfo()
            .then(data => {
                setInfo(data);
            })
            .catch(err => {
                console.error('Failed to fetch contact info for About section:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const bioText = info ? (isFr ? info.bioFr : info.bio) : '';
    const displayBio = bioText && bioText.trim() ? bioText : t('hero.subtitle');

    const titleText = info ? (isFr ? info.aboutTitleFr : info.aboutTitle) : '';
    const displayTitle = titleText && titleText.trim() ? titleText : (isFr ? 'Concevoir des solutions élégantes par le code' : 'Crafting elegant solutions through code');

    if (loading) {
        return (
            <section className="section" id="about">
                <div className="container mx-auto px-6 text-center">
                    <div className="animate-pulse text-[var(--color-text-muted)]">Loading profile...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-[var(--color-surface)]/20" id="about">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('about.title')}</h2>
                    <p className="section-subtitle">{t('about.subtitle')}</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                    {/* Left Column: Interactive Card / Stats / Decorative */}
                    <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-in-up">
                        <div className="relative group">
                            {/* Decorative glowing gradient border */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            
                            <div className="relative glass-card p-8 rounded-2xl space-y-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                                    {isFr ? 'Détails Personnels' : 'Quick Details'}
                                </h3>
                                
                                <div className="space-y-4 text-sm">
                                    {info?.location && (
                                        <div>
                                            <p className="text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">{t('contact_info.locationLabel')}</p>
                                            <p className="text-[var(--color-text)] font-semibold">{info.location}</p>
                                        </div>
                                    )}

                                    {info?.phone && (
                                        <div>
                                            <p className="text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">{isFr ? 'Téléphone' : 'Phone'}</p>
                                            <p className="text-[var(--color-text)] font-semibold">{info.phone}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">{isFr ? 'Langues' : 'Languages'}</p>
                                        <p className="text-[var(--color-text)] font-semibold">{isFr ? 'Anglais, Français' : 'English, French'}</p>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
                                    {info?.github && (
                                        <a 
                                            href={info.github} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-sm font-semibold transition-all"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                    {info?.linkedin && (
                                        <a 
                                            href={info.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--glass-border)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] text-sm font-semibold transition-all"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio / Text / Philosophy */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 animate-fade-in-up">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                            {isFr ? 'Mon Histoire' : 'My Story'}
                        </div>
                        
                        <h3 className="text-3xl font-bold text-[var(--color-text)] leading-tight">
                            {displayTitle}
                        </h3>
                        
                        <div className="text-[var(--color-text-muted)] leading-relaxed space-y-4 whitespace-pre-wrap">
                            {displayBio}
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[var(--glass-border)]">
                            <div>
                                <h4 className="text-lg font-bold text-[var(--color-text)] mb-1">DEC</h4>
                                <p className="text-sm text-[var(--color-text-muted)]">{isFr ? 'Informatique' : 'Computer Science'}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--color-text)] mb-1">Bilingual</h4>
                                <p className="text-sm text-[var(--color-text-muted)]">{isFr ? 'Français & Anglais' : 'French & English'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
