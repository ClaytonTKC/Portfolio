import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';

const educationData = [
    {
        degree: 'Computer Science Degree',
        school: 'Champlain College',
        location: 'Montreal, Quebec',
        period: '2023 - 2026',
        description: 'Specialized in Distributed Systems and Machine Learning. Thesis on scalable real-time data processing.',
        icon: '🎓',
    },
];

export const Education: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="section bg-[var(--color-surface)]/30" id="education">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('education.title')}</h2>
                    <p className="section-subtitle">{t('education.subtitle')}</p>
                </div>

                {/* Education */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {educationData.map((edu, index) => (
                        <Card
                            key={index}
                            className="animate-fade-in-up"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-2xl shrink-0">
                                    {edu.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
                                    <p className="text-[var(--color-primary)] font-medium">{edu.school}</p>
                                    <p className="text-sm text-[var(--color-text-muted)] mb-2">
                                        {edu.location} • {edu.period}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {edu.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
