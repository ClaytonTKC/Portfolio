import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { contentService, type Education as EducationType } from '../../services/content.service';

export const Education: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [education, setEducation] = useState<EducationType[]>([]);
    const [loading, setLoading] = useState(true);
    const isFrench = i18n.language === 'fr';

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const data = await contentService.getEducation();
                setEducation(data);
            } catch (error) {
                console.error('Failed to fetch education data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEducation();
    }, []);

    if (loading) {
        return (
            <section className="section bg-[var(--color-surface)]/30" id="education">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[var(--color-text-muted)]">Loading education...</p>
                </div>
            </section>
        );
    }

    if (education.length === 0) {
        return null;
    }

    return (
        <section className="section bg-[var(--color-surface)]/30" id="education">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('education.title')}</h2>
                    <p className="section-subtitle">{t('education.subtitle')}</p>
                </div>

                {/* Education */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {education.map((edu, index) => (
                        <Card
                            key={edu.id || index}
                            className="animate-fade-in-up"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-2xl shrink-0">
                                    🎓
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        {(isFrench && edu.degreeFr) ? edu.degreeFr : edu.degree}
                                    </h3>
                                    <p className="text-[var(--color-primary)] font-medium">
                                        {(isFrench && edu.schoolFr) ? edu.schoolFr : edu.school}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)] mb-2">
                                        {(isFrench && edu.locationFr) ? edu.locationFr : edu.location} • {new Date(edu.startDate).getFullYear()} -
                                        {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {(isFrench && edu.descriptionFr) ? edu.descriptionFr : edu.description}
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
