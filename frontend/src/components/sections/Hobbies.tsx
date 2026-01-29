import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { contentService, type Hobby } from '../../services/content.service';

export const Hobbies: React.FC = () => {
    const { t } = useTranslation();
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHobbies = async () => {
            try {
                const data = await contentService.getHobbies();
                setHobbies(data);
            } catch (error) {
                console.error('Failed to fetch hobbies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHobbies();
    }, []);

    if (loading) {
        return (
            <section className="section" id="hobbies">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[var(--color-text-muted)]">Loading hobbies...</p>
                </div>
            </section>
        );
    }

    if (hobbies.length === 0) {
        return null;
    }

    return (
        <section className="section" id="hobbies">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('hobbies.title')}</h2>
                    <p className="section-subtitle">{t('hobbies.subtitle')}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {hobbies.map((hobby, index) => (
                        <Card
                            key={hobby.id || index}
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
