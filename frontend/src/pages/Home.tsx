import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Skills } from '../components/sections/Skills';
import { Projects } from '../components/sections/Projects';
import { Experience } from '../components/sections/Experience';
import { Education } from '../components/sections/Education';
import { Hobbies } from '../components/sections/Hobbies';

export const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Hobbies />
        </>
    );
};
