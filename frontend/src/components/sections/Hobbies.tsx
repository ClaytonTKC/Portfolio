import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';

const hobbiesData = [
    {
        name: 'Photography',
        icon: '📷',
        description: 'Capturing moments and landscapes through the lens',
    },
    {
        name: 'Gaming',
        icon: '🎮',
        description: 'Competitive and casual gaming across various platforms',
    },
    {
        name: 'Reading',
        icon: '📚',
        description: 'Exploring fiction, technology, and self-improvement books',
    },
    {
        name: 'Hiking',
        icon: '🥾',
        description: 'Exploring trails and enjoying nature on weekends',
    },
    {
        name: 'Cooking',
        icon: '👨‍🍳',
        description: 'Experimenting with international cuisines and recipes',
    },
    {
        name: 'Music',
        icon: '🎸',
        description: 'Playing guitar and discovering new artists',
    },
];

export const Hobbies: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="section" id="hobbies">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('hobbies.title')}</h2>
                    <p className="section-subtitle">{t('hobbies.subtitle')}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {hobbiesData.map((hobby) => (
                        <Card
                            key={hobby.name}
                            className="text-center animate-fade-in-up"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center text-3xl">
                                {hobby.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{hobby.name}</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {hobby.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
