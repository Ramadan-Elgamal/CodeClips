
import { BrainCircuit, Code, Cpu, Smartphone } from 'lucide-react';

export const categories = [
  {
    name: 'Frontend',
    description: 'Build beautiful and interactive user interfaces.',
    href: '/category/Frontend',
    icon: <Code className="w-8 h-8 text-primary" />,
    path: 'frontend',
  },
  {
    name: 'Backend',
    description: 'Power your applications with robust server-side logic.',
    href: '/category/Backend',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    path: 'backend',
  },
  {
    name: 'Full Stack',
    description: 'Master both frontend and backend development.',
    href: '/category/Full%20Stack',
    icon: <Code className="w-8 h-8 text-primary" />,
    path: 'full-stack',
  },
  {
    name: 'Mobile',
    description: 'Create amazing apps for iOS and Android.',
    href: '/category/Mobile',
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    path: 'mobile',
  },
  {
    name: 'AI/ML',
    description: 'Explore the world of Artificial Intelligence.',
    href: '/category/AI%2FML',
    icon: <Cpu className="w-8 h-8 text-primary" />,
    path: 'ai-ml',
  },
];
