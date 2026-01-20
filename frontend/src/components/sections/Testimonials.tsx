import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const testimonialsData = [
    {
        name: 'Sarah Johnson',
        role: 'CTO, Tech Startup',
        avatar: '👩‍💼',
        content: 'Working with Clayton was an absolute pleasure. His technical expertise and problem-solving skills are outstanding. He delivered our project ahead of schedule and exceeded all expectations.',
        rating: 5,
    },
];

export const Testimonials: React.FC = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="section" id="testimonials">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('testimonials.title')}</h2>
                    <p className="section-subtitle">{t('testimonials.subtitle')}</p>
                </div>

                {/* Featured Testimonial */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                        {/* Quote icon */}
                        <div className="absolute top-4 right-4 text-6xl text-[var(--color-primary)] opacity-20">
                            "
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-4xl shrink-0">
                                {testimonialsData[activeIndex].avatar}
                            </div>

                            {/* Content */}
                            <div className="text-center md:text-left">
                                <p className="text-lg md:text-xl text-[var(--color-text)] mb-6 italic">
                                    "{testimonialsData[activeIndex].content}"
                                </p>
                                <div>
                                    <p className="font-semibold text-[var(--color-text)]">
                                        {testimonialsData[activeIndex].name}
                                    </p>
                                    <p className="text-[var(--color-text-muted)]">
                                        {testimonialsData[activeIndex].role}
                                    </p>
                                </div>
                                {/* Rating */}
                                <div className="flex items-center justify-center md:justify-start gap-1 mt-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${i < testimonialsData[activeIndex].rating
                                                ? 'text-yellow-400'
                                                : 'text-[var(--color-surface-light)]'
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Indicators */}
                <div className="flex justify-center gap-4">
                    {testimonialsData.map((testimonial, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${activeIndex === index
                                ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] scale-110'
                                : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-light)]'
                                }`}
                            aria-label={`View testimonial from ${testimonial.name}`}
                        >
                            {testimonial.avatar}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
