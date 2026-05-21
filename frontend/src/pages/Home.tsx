import React from 'react';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Skills } from '../components/sections/Skills';
import { Projects } from '../components/sections/Projects';
import { Experience } from '../components/sections/Experience';
import { Education } from '../components/sections/Education';
import { Hobbies } from '../components/sections/Hobbies';

export const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Hobbies />
        </>
    );
};
