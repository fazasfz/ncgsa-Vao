/**
 * Static data store defining the project's team members and contributors.
 */
import mohibImg from '../../../assets/images/team/mohib.jpg';
import quratulainImg from '../../../assets/images/team/quratulain.jpg';
import radhiyaImg from '../../../assets/images/team/radhiya.jpg';
import yawarImg from '../../../assets/images/team/yawar.jpg';
import junaidImg from '../../../assets/images/team/junaid.jpg';
import simraImg from '../../../assets/images/team/simra.jpg';
import fatimaImg from '../../../assets/images/team/fatima.jpg';
import amnaImg from '../../../assets/images/team/amna.jpg';
import tehreemImg from '../../../assets/images/team/tehreem.jpg';
import saaniImg from '../../../assets/images/team/saani.jpg';

export const contributors = [
  {
    name: 'Yawar Abbas',
    role: 'Supervisor',
    title: 'Scientific Supervisor',
    institution: 'NCGSA,IST',
    description: 'Bridged the gap between the project\'s technical objectives and real-world astronomical practices, providing hands-on expertise in observational astronomy to keep development grounded in active space science.',
    image: yawarImg
  },
  {
    name: 'Muhammad Junaid',
    role: 'Supervisor',
    title: 'Research Supervisor',
    institution: 'NCGSA,IST',
    description: 'Delivered critical scientific insights throughout the project\'s development, leveraging astrophysics expertise to anchor data and ensure the core research met rigorous academic standards.',
    image: junaidImg
  },
  {
    name: 'Syeda Fatima Zahra',
    role: 'Intern',
    title: 'Engineering Intern',
    institution: 'Institute of Space Technology',
    description: 'Led the project\'s core architecture and environment setup. Designed the frontend layouts and developed the Zenith, Lunar Observatory, and Astro-Copilot modules end-to-end.',
    image: fatimaImg
  },
  {
    name: 'Simra Tanveer',
    role: 'Intern',
    title: 'Engineering Intern',
    institution: 'Institute of Space Technology',
    description: 'Developed the core architecture for the Solar Observatory and Astronomical Probe Tracker, turning raw concepts into fully functional modules.',
    image: simraImg
  },
  {
    name: 'Qurat ul Ain',
    role: 'Intern',
    title: 'Research Intern',
    institution: 'Institute of Space Technology',
    description: 'Led the foundational research for the Solar Observatory and Astronomical Probe Tracker, ensuring the modules were backed by accurate, comprehensive data.',
    image: quratulainImg
  },
  {
    name: 'Tehreem Azhar',
    role: 'Intern',
    title: 'Research Intern',
    institution: 'Institute of Space Technology',
    description: 'Sourced and synthesized critical astronomical data, laying the factual groundwork for the Solar Observatory and Probe Tracker.',
    image: tehreemImg,
    imagePosition: 'center 30%',
    noZoom: true
  },
  {
    name: 'Syeda Amna Mehdi Zaidi',
    role: 'Intern',
    title: 'Research & Development Intern',
    institution: 'Institute of Space Technology',
    description: 'Developed the backend infrastructure for Exora and took the Deep Sky Explorer from initial research all the way through development.',
    image: amnaImg
  },
  {
    name: 'Syeda Radhiya Aamir',
    role: 'Intern',
    title: 'Research & Development Intern',
    institution: 'Institute of Space Technology',
    description: 'Pitched the idea for Exora and managed the end-to-end research and development cycle to build and launch Exora.',
    image: radhiyaImg
  },
  {
    name: 'Muhammad Mohib',
    role: 'Intern',
    title: 'Research & Development Intern',
    institution: 'Beaconhouse Margalla Islamabad',
    description: 'Built the Solar System Orbital Simulator from the ground up, handling both the underlying research and the interactive development.',
    image: mohibImg,
    noZoom: true
  },
  {
    name: 'Saani E Zahra',
    role: 'Intern',
    title: 'Research & Development Intern',
    institution: 'Institute of Space Technology',
    description: 'Researched and built the Earth View module, while also driving key foundational research for Exora.',
    image: saaniImg
  }
];
