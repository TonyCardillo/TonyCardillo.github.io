const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const config = {
  postsDir: './blog/posts',
  projectsDir: './projects/content',
};

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Surface panel with full corner brackets (top corners come from CSS ::before/::after,
// bottom corners are added as spans here).
function card(innerHtml, { caption, className = 'bg-card' } = {}) {
  const captionHtml = caption
    ? `<span class="panel-caption"><span class="live-dot" aria-hidden="true"></span>${escapeHtml(caption)}</span>`
    : '';
  return `<div class="${className}">${captionHtml}${innerHtml}<span class="corner-bl" aria-hidden="true"></span><span class="corner-br" aria-hidden="true"></span></div>`;
}

function navLink(href, label, currentPage, key) {
  const cls = currentPage === key ? 'is-active' : '';
  return `<li><a href="${href}" class="${cls}"${cls ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a></li>`;
}

function createPageTemplate(title, content, { isHomePage = false, activePage = '' } = {}) {
  const prefix = isHomePage ? '' : '../';
  const blogHref = isHomePage ? 'blog/index.html' : '../blog/index.html';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} - entmoot.io</title>
    <link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg">
    <link rel="stylesheet" href="${prefix}css/style.css">
    <meta name="description" content="Anthony Cardillo, MD - Informatics, AI, Digital Pathology">
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <a href="${prefix}index.html" class="logo">entmoot<span class="accent-green">.io</span></a>
                <ul>
                    ${navLink(`${prefix}index.html`, 'Home', activePage, 'home')}
                    ${navLink(`${prefix}about.html`, 'Resume', activePage, 'resume')}
                    ${navLink(`${prefix}projects.html`, 'Projects', activePage, 'projects')}
                    ${navLink(blogHref, 'Blog', activePage, 'blog')}
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
            <p>&copy; 2025 Anthony Cardillo, MD &nbsp;·&nbsp; built with care</p>
        </div>
    </footer>
</body>
</html>`;
}

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

function generateBlogIndex(posts) {
  const blogListHtml = posts
    .map((post) =>
      card(
        `
      <h3><a href="${escapeHtml(post.slug)}.html">${escapeHtml(post.frontmatter.title)}</a></h3>
      <div class="blog-meta">${new Date(post.frontmatter.date).toLocaleDateString()}</div>
      <p class="blog-excerpt">${escapeHtml(post.frontmatter.excerpt || '')}</p>
    `,
        { className: 'blog-post' }
      )
    )
    .join('');

  const content = `
    <section class="hero">
      <h1>Blog</h1>
    </section>

    <section>
      <div class="blog-list">
        ${blogListHtml}
      </div>
    </section>
  `;

  return createPageTemplate('Blog', content, { activePage: 'blog' });
}

function generateBlogPost(post) {
  const content = `
    <article>
      <h1>${escapeHtml(post.frontmatter.title)}</h1>
      <div class="blog-meta">${new Date(post.frontmatter.date).toLocaleDateString()}</div>
      <div class="blog-content">
        ${post.html}
      </div>
      <p style="margin-top: var(--space-12);"><a href="index.html">← Back to Blog</a></p>
    </article>
  `;

  return createPageTemplate(post.frontmatter.title, content, { activePage: 'blog' });
}

function getProjects() {
  const projectsDir = path.join(__dirname, config.projectsDir);

  if (!fs.existsSync(projectsDir)) {
    console.log('Projects directory does not exist, creating it...');
    fs.mkdirSync(projectsDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(projectsDir).filter((file) => file.endsWith('.md'));

  return files
    .map((file) => {
      const filePath = path.join(projectsDir, file);
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

function generateProjectPage(project) {
  const techTags = project.frontmatter.tech
    ? `<div class="project-tech">
        ${project.frontmatter.tech.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
      </div>`
    : '';

  const externalLink = project.frontmatter.link
    ? `<p><a href="${escapeHtml(project.frontmatter.link)}" target="_blank" rel="noopener noreferrer">Visit Project →</a></p>`
    : '';

  const content = `
    <article>
      <h1>${escapeHtml(project.frontmatter.title)}</h1>
      ${techTags}
      <div class="blog-content">
        ${project.html}
      </div>
      ${externalLink}
      <p style="margin-top: var(--space-12);"><a href="../projects.html">← Back to Projects</a></p>
    </article>
  `;

  return createPageTemplate(project.frontmatter.title, content, { activePage: 'projects' });
}

function generateHomePage(posts, projects) {
  const recentPostsHtml = posts
    .slice(0, 3)
    .map((post) =>
      card(
        `
      <h3><a href="blog/${escapeHtml(post.slug)}.html">${escapeHtml(post.frontmatter.title)}</a></h3>
      <div class="blog-meta">${new Date(post.frontmatter.date).toLocaleDateString()}</div>
      <p class="blog-excerpt">${escapeHtml(post.frontmatter.excerpt || '')}</p>
    `,
        { className: 'blog-post' }
      )
    )
    .join('');

  const projectsHtml = projects
    .map((project) =>
      card(`
      <h3><a href="projects/${escapeHtml(project.slug)}.html">${escapeHtml(project.frontmatter.title)}</a></h3>
      <p>${escapeHtml(project.frontmatter.excerpt || '')}</p>
      <div class="project-tech">
        ${project.frontmatter.tech ? project.frontmatter.tech.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('') : ''}
      </div>
    `)
    )
    .join('');

  const content = `
    <section class="hero">
      <h1>Anthony Cardillo<span class="accent-green">, MD</span></h1>
      <p>Physician Informaticist · Founder · Builder</p>
    </section>

    <section>
      <h2>About</h2>
      ${card(
        `<p>I'm Anthony, a physician and informaticist passionate about making medicine smarter. My work has been featured in the New England Journal of Medicine and The White House.</p>`,
        { caption: '§ 01 · About' }
      )}
    </section>

    <section>
      <h2>Projects</h2>
      <div class="projects-grid">
        ${projectsHtml}
      </div>
      <p style="margin-top: var(--space-8);"><a href="projects.html">View all projects →</a></p>
    </section>

    <section>
      <h2>Recent Posts</h2>
      <div class="blog-list">
        ${recentPostsHtml}
      </div>
      <p style="margin-top: var(--space-8);"><a href="blog/index.html">View all posts →</a></p>
    </section>
  `;

  return createPageTemplate('Home', content, { isHomePage: true, activePage: 'home' });
}

// Tiny helper for resume sections — emits a card with a list of "Bold Title — Detail (Date)" entries
function resumeSection(title, items, caption) {
  const list = items.map((item) => `<li>${item}</li>`).join('');
  return card(`<h2>${escapeHtml(title)}</h2><ul>${list}</ul>`, { caption });
}

function generateAboutPage() {
  const educationItems = [
    `<strong>Fellowship, Clinical Informatics</strong> — New York University (2022–2024)<br><span class="meta-line">Epic Physician Builder certified</span>`,
    `<strong>Residency, Clinical Pathology</strong> — University of Rochester Medical Center (2019–2022)`,
    `<strong>MD, Medicine</strong> — University of Arkansas for Medical Sciences (2019)`,
    `<strong>BS, Biology</strong> — University of Central Arkansas (2015)`,
  ];

  const clinicalItems = [
    `<strong>Assistant Attending, Hemostasis and Coagulation</strong> — Memorial Sloan Kettering Cancer Center (2024–Present)`,
    `<strong>Assistant Attending, Clinical Chemistry and Hematology</strong> — NYU Langone Health (2022–2024)`,
  ];

  const industryItems = [
    `<strong>Founder, CEO</strong> — CI Prep Pro (2025–Present)`,
    `<strong>Advisor</strong> — Biobase (2026–Present)`,
    `<strong>Physician Consultant</strong> — Medcrypt (2023–2024)`,
    `<strong>Physician Advisor</strong> — MedSchoolCoach (2023–2026)`,
    `<strong>Physician Informaticist</strong> — Invitae (2021–2022)`,
    `<strong>Research Contractor</strong> — Alpenglow Biosciences (2020–2022)`,
  ];

  const leadershipItems = [
    `<strong>Associate Director of Informatics</strong> — Memorial Sloan Kettering Cancer Center (2024–Present)`,
    `<strong>Physician Champion, AP Beaker</strong> — Memorial Sloan Kettering Cancer Center (2026–Present)`,
    `<strong>Clinical Lab Director</strong> — Memorial Sloan Kettering Cancer Center (2025–Present)`,
    `<strong>Clinical Lead, AP Beaker (Epic)</strong> — Memorial Sloan Kettering Cancer Center (2024–Present)`,
    `<strong>AI Lead</strong> — NYU Langone Health (2024)`,
    `<strong>Member, National Beaker Steering Committee</strong> — Epic Systems Corporation (2025–Present)`,
    `<strong>Member, Artificial Intelligence Committee</strong> — College of American Pathologists (2021–Present)`,
    `<strong>Member, Patient Engagement Committee</strong> — Digital Pathology Association (2025–2026)`,
    `<strong>Member, Ethics Committee</strong> — American Medical Informatics Association (2021–2024)`,
    `<strong>Vice Chair, Medical Student, Resident, and Fellow Committee</strong> — Physicians for Patient Protection (2021–2022)`,
  ];

  const certItems = [
    `<strong>Clinical Informatics</strong> (2025–2034)`,
    `<strong>Clinical Pathology</strong> (2022–Present)`,
  ];

  const honorsItems = [
    `<strong>Summit for Democracy — Red Team Winner</strong> — National Science Foundation (2023)`,
    `<strong>2021 and 2022 Power List</strong> — The Pathologist Magazine`,
    `<strong>Blue Ribbon Award for Best Test Utilization</strong> — American Society for Clinical Pathology (2020)`,
    `<strong>Best Clinical Didactic</strong> — University of Rochester Medical Center (2020)`,
    `<strong>Diamond Award</strong> — Arkansas Health Association (2017)`,
  ];

  const peerReviewed = [
    `<a href="https://doi.org/10.1055/s-0044-1791488" target="_blank" rel="noopener noreferrer"><strong>Reference Ranges for All: Implementing Reference Ranges for Transgender and Non-Binary Patients.</strong></a> Cardillo AB, Haghi N, Chen D, Jhang J, Testa P, Genes N. <em>Applied Clinical Informatics.</em> 2024.`,
    `<a href="https://doi.org/10.1371/journal.pdig.0000685" target="_blank" rel="noopener noreferrer"><strong>Evaluating Large Language Models in extracting cognitive exam dates and scores.</strong></a> Zhang H, Jethani N, Jones S, Genes N, Major VJ, Jaffe IS, Cardillo AB, et al. <em>PLOS Digital Health.</em> 2024.`,
    `<a href="https://doi.org/10.1097/MS9.0000000000000719" target="_blank" rel="noopener noreferrer"><strong>Exploration of HER2 (ERBB2) immunohistochemistry in non-small cell lung cancer: correlation with ERBB2 mutational status.</strong></a> Cardillo AB, Kovar S, Roper N, Hicks DG, Velez MJ. <em>Annals of Medicine and Surgery.</em> 2023.`,
    `<a href="https://doi.org/10.1093/jamia/ocac192" target="_blank" rel="noopener noreferrer"><strong>AMIA's Code of Professional and Ethical Conduct 2022.</strong></a> Petersen C, Berner ES, Cardillo AB, Hollis KF, Goodman KW, Koppel R, Korngiebel DM, Lehmann C, Solomonides AE, Subbian V. <em>Journal of the American Medical Informatics Association.</em> 2022.`,
    `<a href="https://doi.org/10.1128/JCM.02489-20" target="_blank" rel="noopener noreferrer"><strong>A Multiplex Microsphere IgG Assay for SARS-CoV-2 Using ACE2-Mediated Inhibition as a Surrogate for Neutralization.</strong></a> Cameron A, Porterfield C, Byron L, Jiong W, Pearson Z, Bohrhunter J, Cardillo AB, et al. <em>Journal of Clinical Microbiology.</em> 2021.`,
  ];

  const reviews = [
    `<a href="https://doi.org/10.1056/NEJMc2034764" target="_blank" rel="noopener noreferrer"><strong>Reducing the Need for HLA-Matched Platelet Transfusion.</strong></a> Cardillo AB, Heal J, Henrichs K, Masel D, Fountaine T, Liesveld J, Noronha S, Cahill C, Ngo A, Gupta G, Refaai M, Blumberg N. <em>New England Journal of Medicine.</em> 2021.`,
    `<a href="https://doi.org/10.1093/ajcp/aqab102" target="_blank" rel="noopener noreferrer"><strong>Platelet Recruitment in COVID-19.</strong></a> Cardillo AB, Refaai M. <em>American Journal of Clinical Pathology.</em> 2021.`,
    `<strong>Federated Learning — Sharing our Data without Breaking The Law.</strong> Cardillo AB. <em>Digital Pathology Association.</em> 2021.`,
  ];

  const cases = [
    `<a href="https://doi.org/10.1177/0009922820912214" target="_blank" rel="noopener noreferrer"><strong>Amoxicillin-Induced Crystalline Nephropathy Presenting as Ureteral Obstruction.</strong></a> Kleppe D, Patel A, Goodin J, Cardillo AB, Canon S, Latch R, Ilyas M, Rosenbaum E. <em>Clinical Pediatrics.</em> 2020.`,
    `<strong>Hip and Ankle Pain after a Fall — Case of the Month.</strong> Chen I, Cardillo AB. <em>University of Rochester Medical Center.</em> 2020.`,
  ];

  const other = [
    `<strong>Primum Non Nocere: A Physician's Perspective on AI in Medicine.</strong> Cardillo AB. <em>Metaculus Journal.</em> 2023.`,
    `<strong>Physicians' Charter for Responsible AI.</strong> Cardillo AB, Collins W, Cotliar D, Eckert C, Gebauer S, Hajji R, Jeffries S, Small W, Sakumoto M, Walker G. 2024.`,
  ];

  const press = [
    `<a href="https://www.wsj.com/tech/ai/hospitals-are-a-proving-ground-for-what-ai-can-do-and-what-it-cant-60e4020c" target="_blank" rel="noopener noreferrer"><strong>"Hospitals Are a Proving Ground for What AI Can Do, and What It Can't"</strong></a> — The Wall Street Journal (2026)`,
  ];

  const pubsBody = `
    <h2>Publications</h2>
    <h6>Peer-reviewed research articles</h6>
    <ul class="cite-list">${peerReviewed.map((p) => `<li>${p}</li>`).join('')}</ul>
    <h6>Reviews &amp; editorials</h6>
    <ul class="cite-list">${reviews.map((p) => `<li>${p}</li>`).join('')}</ul>
    <h6>Case reports</h6>
    <ul class="cite-list">${cases.map((p) => `<li>${p}</li>`).join('')}</ul>
    <h6>Other publications</h6>
    <ul class="cite-list">${other.map((p) => `<li>${p}</li>`).join('')}</ul>
  `;

  const content = `
    <section class="hero">
      <h1>Resume</h1>
      <p>Education · Experience · Publications</p>
    </section>

    <section>
      ${resumeSection('Education', educationItems, '§ 01 · Education')}
      ${resumeSection('Clinical Experience', clinicalItems, '§ 02 · Clinical')}
      ${resumeSection('Industry Experience', industryItems, '§ 03 · Industry')}
      ${resumeSection('Leadership & Governance', leadershipItems, '§ 04 · Leadership')}
      ${resumeSection('Specialty Board Certifications', certItems, '§ 05 · Boards')}
      ${resumeSection('Honors & Awards', honorsItems, '§ 06 · Honors')}
      ${card(pubsBody, { caption: '§ 07 · Publications' })}
      ${resumeSection('Press', press, '§ 08 · Press')}
    </section>
  `;

  return createPageTemplate('Resume', content, { isHomePage: true, activePage: 'resume' });
}

function generateProjectsPage(projects) {
  const projectsHtml = projects
    .map((project) =>
      card(`
      <h3><a href="projects/${escapeHtml(project.slug)}.html">${escapeHtml(project.frontmatter.title)}</a></h3>
      <p>${escapeHtml(project.frontmatter.excerpt || '')}</p>
      <div class="project-tech">
        ${project.frontmatter.tech ? project.frontmatter.tech.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('') : ''}
      </div>
    `)
    )
    .join('');

  const content = `
    <section class="hero">
      <h1>Projects</h1>
    </section>

    <section>
      <div class="projects-grid">
        ${projectsHtml}
      </div>
    </section>
  `;

  return createPageTemplate('Projects', content, { isHomePage: true, activePage: 'projects' });
}

function build() {
  console.log('Building site...');

  const blogDir = './blog';
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  const projectsDir = './projects';
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  const posts = getBlogPosts();
  console.log(`  ${posts.length} blog posts`);

  fs.writeFileSync('./blog/index.html', generateBlogIndex(posts));
  posts.forEach((post) => {
    fs.writeFileSync(`./blog/${post.slug}.html`, generateBlogPost(post));
  });

  const projects = getProjects();
  console.log(`  ${projects.length} projects`);

  projects.forEach((project) => {
    fs.writeFileSync(`./projects/${project.slug}.html`, generateProjectPage(project));
  });

  fs.writeFileSync('./index.html', generateHomePage(posts, projects));
  fs.writeFileSync('./about.html', generateAboutPage());
  fs.writeFileSync('./projects.html', generateProjectsPage(projects));

  console.log('Done.');
}

build();
