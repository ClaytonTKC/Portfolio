import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="section min-h-[calc(100vh-4rem)] flex items-center">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="animate-fade-in-up">
                        <p className="text-[var(--color-primary)] font-medium mb-4">
                            {t('hero.greeting')}
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span className="block text-[var(--color-text)]">Clayton Cheung</span>
                            <span className="block bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                {t('hero.title')}
                            </span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-lg">
                            {t('hero.subtitle')}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="primary">
                                {t('hero.cta')}
                            </Button>
                            <Button variant="secondary">
                                {t('hero.contact')}
                            </Button>
                            <a
                                href="/CV.pdf"
                                download="Clayton_Cheung_CV.pdf"
                                className="btn-secondary flex items-center"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('hero.resume')}
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mt-12">
                            {[
                                { value: '3', label: 'Years Experience' },
                                { value: '8+', label: 'Projects Completed' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-[var(--color-primary)]">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-[var(--color-text-muted)]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Image / Avatar */}
                    <div className="relative flex justify-center lg:justify-end animate-float">
                        <div className="relative">
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] rounded-full blur-3xl opacity-30" />

                            {/* Avatar container */}
                            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-[var(--glass-border)]">
                                <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-light)] flex items-center justify-center">
                                    <span className="text-8xl">👨‍💻</span>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 glass-card flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                                <span className="text-3xl">⚛️</span>
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 glass-card flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                                <span className="text-2xl">🚀</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
