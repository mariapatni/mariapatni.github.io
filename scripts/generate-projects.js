#!/usr/bin/env node
/**
 * Build a JSON feed of project tiles so the static `projects.html`
 * can render the latest blogs.
 *
 * Rerun `node scripts/generate-projects.js` whenever you add, rename, or
 * remove a `/blogs/<project>` folder so `projects-data.json` is up to date.
 */
const fs = require('fs');
const path = require('path');

const BLOGS_DIR = path.join(__dirname, '..', 'blogs');
const OUT_FILE = path.join(__dirname, '..', 'projects-data.json');

const PROJECT_METADATA = {
  'repairing-server': {
    title: 'repairing a $130,000 server for fun',
    description: 'all it took was toggling 3 settings. but how could I know which ones?',
    tags: ['Firmware', 'GPUs', 'BIOS', 'Hardware', 'Electronics', 'Troubleshooting'],
    date: '2025-11-25',
    url: '/blogs/repairing-server/',
  },
  'curious_TARFS': {
    title: 'Curious TARFS',
    description: 'Learning relationships between sight and feel for objects, soft and hard.',
    tags: ['3D Reconstruction', 'DIGIT', 'RealSense', 'NERFstudio', 'FoundationPose', 'UMI Gripper', ],
    date: '2025-09-19',
  },
  'frc_2020': {
    title: 'FRC 2020',
    description: 'Designed drivetrain, storage, & intake mechanisms. <br><br> Years later, I did a deep dive on our design, analyzing structural integrity, flaws, etc. Click the tile to see!',
    tags: ['FRC', 'CAD', 'Prototyping'],
    date: '2020-09-01',
    url: 'https://docs.google.com/presentation/d/1AouteYFL6P9DMjL1s9PPVObFGOxiIq_GG-q0FF4FC84/edit',
  },
  'frc_2019': {
    title: 'FRC 2019',
    description: 'Designed drivetrain, scoring mechanism, and platform climber.',
    tags: ['FRC', 'CAD', 'Prototyping'],
    date: '2019-09-01',
  },
  'frc_2018': {
    title: 'FRC 2018',
    description: 'Designed climber "hook" for winch-based system.',
    tags: ['FRC', 'CAD', 'Prototyping'],
    date: '2018-09-01',
  },
  'frc_misc': {
    title: 'Misc FRC Design Work',
    description: 'Custom Gearbox for dual-speed tank-style drivetrain + swerve-style drivetrain',
    tags: ['FRC', 'CAD', 'Prototyping'],
    date: '2018-08-01',
  },
  'tree-trunk-detection': {
    title: 'Tree Trunk Detection with RF-Detr',
    description: 'RF detr just got released and I decided to mess around with it on a really small dataset!',
    tags: ['RF-Detr', 'Perception'],
    date: '2025-10-10',
    url: 'https://docs.google.com/presentation/d/1CJHB8juFkBjVsIn-kvQgXJEzjINSOdCSwwqv0TcPPps/edit',
  },
};

function ensureImagesFolder(blogDir) {
  const imagesDir = path.join(blogDir, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  return imagesDir;
}

function pickCoverImage(imagesDir, slug) {
  const entries = fs.readdirSync(imagesDir).filter(name => !name.startsWith('.'));
  if (entries.length === 0) {
    console.warn(`No images found for ${slug}, leaving coverPath empty.`);
    return null;
  }
  const normalized = entries.map(name => name.toLowerCase());
  const coverIndex = normalized.findIndex(name => name.includes('cover'));
  const selected = coverIndex >= 0 ? entries[coverIndex] : entries.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))[0];
  return `/blogs/${slug}/images/${selected}`;
}

function gatherProjects() {
  if (!fs.existsSync(BLOGS_DIR)) {
    throw new Error(`Blogs directory not found at ${BLOGS_DIR}`);
  }

  return fs
    .readdirSync(BLOGS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const slug = dirent.name;
      const blogDir = path.join(BLOGS_DIR, slug);
      const imagesDir = ensureImagesFolder(blogDir);
      const coverPath = pickCoverImage(imagesDir, slug);

      const metadata = PROJECT_METADATA[slug] || {};

      return {
        slug,
        title: metadata.title || slug,
        description: metadata.description || '',
        coverPath,
        tags: metadata.tags || ['tag1', 'tag2', 'tag3'],
        url: metadata.url || null,
        date: metadata.date || null,
      };
    });
}

function writeProjectsJson(data) {
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
  console.log(`Wrote ${data.length} projects to ${OUT_FILE}`);
}

try {
  const projects = gatherProjects();
  const sortedProjects = projects.slice().sort((left, right) => {
    const ldt = left.date ? new Date(left.date).getTime() : 0;
    const rdt = right.date ? new Date(right.date).getTime() : 0;
    return rdt - ldt;
  });
  writeProjectsJson(sortedProjects);
  console.log('projects-data.json has been refreshed. Rerun this script whenever you add or remove a project folder.');
} catch (error) {
  console.error(error);
  process.exit(1);
}

