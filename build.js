const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const config = {
  postsDir: './blog/posts',
};

// Helper function to escape HTML in frontmatter
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// HTML template function
function createPageTemplate(title, content, isHomePage = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} - entmoot.io</title>
    <link rel="icon" type="image/svg+xml" href="${isHomePage ? '' : '../'}favicon.svg">
    <link rel="stylesheet" href="${isHomePage ? '' : '../'}css/style.css">
    <meta name="description" content="Anthony Cardillo, MD - Informatics // AI // Digital Pathology">
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">entmoot.io</div>
                <ul>
                    <li><a href="${isHomePage ? '' : '../'}index.html">Home</a></li>
                    <li><a href="${isHomePage ? '' : '../'}about.html">About Me</a></li>
                    <li><a href="${isHomePage ? '' : '../'}projects.html">Projects</a></li>
                    <li><a href="${isHomePage ? 'blog/' : ''}index.html">Blog</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main>
        <div class="container">
            ${content}
        </div>
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; 2025 Anthony Cardillo</p>
        </div>
    </footer>
</body>
</html>`;
}

// Read and parse markdown files
function getBlogPosts() {
  const postsDir = path.join(__dirname, config.postsDir);

  if (!fs.existsSync(postsDir)) {
    console.log('Posts directory does not exist, creating it...');
    fs.mkdirSync(postsDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));

  return files
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      return {
        slug: path.basename(file, '.md'),
        frontmatter: data,
        content: content,
        html: marked(content),
      };
    })
    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
}

// Generate blog listing page
function generateBlogIndex(posts) {
  const blogListHtml = posts
    .map(
      (post) => `
    <article class="blog-post">
      <h3><a href="${escapeHtml(post.slug)}.html">${escapeHtml(post.frontmatter.title)}</a></h3>
      <div class="blog-meta">${new Date(post.frontmatter.date).toLocaleDateString()}</div>
      <p class="blog-excerpt">${escapeHtml(post.frontmatter.excerpt || '')}</p>
    </article>
  `
    )
    .join('');

  const content = `
    <section>
      <h1>Blog</h1>
      <div class="blog-list">
        ${blogListHtml}
      </div>
    </section>
  `;

  return createPageTemplate('Blog', content);
}

// Generate individual blog post pages
function generateBlogPost(post) {
  const content = `
    <article>
      <h1>${escapeHtml(post.frontmatter.title)}</h1>
      <div class="blog-meta">${new Date(post.frontmatter.date).toLocaleDateString()}</div>
      <div class="blog-content">
        ${post.html}
      </div>
      <p><a href="index.html">← Back to Blog</a></p>
    </article>
  `;

  return createPageTemplate(post.frontmatter.title, content);
}

// Generate static pages
function generateHomePage() {
  const content = `
    <section class="hero">
      <h1>Tony Cardillo</h1>
      <p>Welcome to my personal website</p>
      <p>Technology • Medicine • Innovation</p>
    </section>
    
    <section>
      <h2>Recent Posts</h2>
      <p>Check out my latest thoughts on <a href="blog/index.html">the blog</a>.</p>
    </section>
  `;

  return createPageTemplate('Home', content, true);
}

function generateAboutPage() {
  const content = `
    <section>
      <h1>About Me</h1>

      <div class="bg-card">
        <h2>Background</h2>
        <p>I'm Tony Cardillo, a physician and technology enthusiast passionate about the intersection of medicine and innovation. My work explores how emerging technologies can enhance healthcare delivery while preserving the essential human elements of medical practice.</p>
      </div>

      <div class="bg-card">
        <h2>Interests</h2>
        <ul style="color: var(--gray-200); line-height: 1.8;">
          <li><strong style="color: var(--xbox-green);">Medicine & Healthcare:</strong> Evidence-based practice, diagnostic innovation, and patient-centered care</li>
          <li><strong style="color: var(--xbox-green);">Technology:</strong> Web development, design systems, and performance optimization</li>
          <li><strong style="color: var(--xbox-green);">AI & Machine Learning:</strong> Applications in healthcare, ethical considerations, and human-AI collaboration</li>
          <li><strong style="color: var(--xbox-green);">Design:</strong> User experience, visual aesthetics, and accessibility</li>
        </ul>
      </div>

      <div class="bg-card">
        <h2>Philosophy</h2>
        <blockquote>
          "Technology should augment human expertise, not replace it. The best solutions combine computational power with human insight, empathy, and judgment."
        </blockquote>
        <p>I believe in building tools that empower people rather than constrain them. Whether designing interfaces or developing medical technologies, the focus should always be on enhancing human capabilities.</p>
      </div>

      <div class="bg-card">
        <h2>Get in Touch</h2>
        <p>I'm always interested in connecting with fellow innovators, healthcare professionals, and technology enthusiasts. Feel free to reach out to discuss ideas, collaborations, or just to say hello.</p>
      </div>
    </section>
  `;

  return createPageTemplate('About', content, true);
}

function generateProjectsPage() {
  const projects = [
    {
      title: 'Xbox Liquid Glass Design System',
      description:
        "A modern design language combining Xbox's iconic green aesthetic with Apple's glassmorphic translucency. Features include backdrop blur effects, smooth animations, and accessibility-first components.",
      tech: ['CSS3', 'Design Systems', 'Glassmorphism'],
    },
    {
      title: 'Medical AI Diagnostic Tool',
      description:
        'Machine learning platform for analyzing medical imaging data. Assists physicians in early detection of pathologies while maintaining the critical human element in diagnosis.',
      tech: ['Python', 'TensorFlow', 'Healthcare'],
    },
    {
      title: 'Static Site Generator',
      description:
        'Lightweight Node.js-based static site generator with Markdown support, frontmatter parsing, and automated deployment. Powers this very website.',
      tech: ['Node.js', 'Markdown', 'GitHub Pages'],
    },
    {
      title: 'Performance Monitoring Dashboard',
      description:
        'Real-time web vitals tracking dashboard for monitoring Core Web Vitals across multiple properties. Integrates with Google Analytics and provides actionable insights.',
      tech: ['JavaScript', 'Web Vitals', 'Analytics'],
    },
  ];

  const projectsHtml = projects
    .map(
      (project) => `
    <div class="bg-card">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tech">
        ${project.tech.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
    </div>
  `
    )
    .join('');

  const content = `
    <section>
      <h1>Projects</h1>
      <p style="color: var(--gray-200); margin-bottom: var(--space-8);">
        A collection of personal and professional projects spanning design, medicine, and technology.
      </p>
      <div class="projects-grid">
        ${projectsHtml}
      </div>
    </section>
  `;

  return createPageTemplate('Projects', content, true);
}

// Main build function
function build() {
  console.log('🏗️  Building site...');

  // Create blog directory if it doesn't exist
  const blogDir = './blog';
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  // Get blog posts
  const posts = getBlogPosts();
  console.log(`📝 Found ${posts.length} blog posts`);

  // Generate blog index
  const blogIndexHtml = generateBlogIndex(posts);
  fs.writeFileSync('./blog/index.html', blogIndexHtml);
  console.log('✅ Generated blog index');

  // Generate individual blog posts
  posts.forEach((post) => {
    const postHtml = generateBlogPost(post);
    fs.writeFileSync(`./blog/${post.slug}.html`, postHtml);
    console.log(`✅ Generated blog post: ${post.frontmatter.title}`);
  });

  // Generate static pages
  fs.writeFileSync('./index.html', generateHomePage());
  fs.writeFileSync('./about.html', generateAboutPage());
  fs.writeFileSync('./projects.html', generateProjectsPage());

  console.log('✅ Generated static pages');
  console.log('🎉 Build complete!');
}

// Run build
build();
