
import { BrainCircuit, Code, Video } from 'lucide-react';

export const categories = [
  {
    name: 'Frontend',
    description: 'Build beautiful and interactive user interfaces.',
    href: '/category/Frontend',
    icon: <Code className="w-8 h-8 text-primary" />,
  },
  {
    name: 'Backend',
    description: 'Power your applications with robust server-side logic.',
    href: '/category/Backend',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
  },
  {
    name: 'Full Stack',
    description: 'Master both frontend and backend development.',
    href: '/category/Full%20Stack',
    icon: <Code className="w-8 h-8 text-primary" />,
  },
  {
    name: 'Mobile',
    description: 'Create amazing apps for iOS and Android.',
    href: '/category/Mobile',
    icon: <Video className="w-8 h-8 text-primary" />,
  },
];
