# entmoot.io

My personal website built with a simple Node.js static site generator and the Everforest theme.

## Commands

- `./deploy.sh` - Deploys to GitHub Pages with pre-deployment validation

## Architecture

- Custom Node.js static site generator. The architecture is:
- CSS: Single stylesheet at `css/style.css` using custom theme
- HTML structure defined in `build.js` template functions
- Static pages from said template functions

**Static Site Generator (build.js):**

- Reads Markdown files from `blog/posts/` with frontmatter (title, date, excerpt)
- Outputs HTML blog posts to `blog/` directory and static pages to root directory

**Build Process:**

- All HTML files are generated and overwritten on each build
- Blog index page lists all posts sorted by date (newest first)
- Individual blog post pages include navigation back to blog index
- Static pages (index.html, about.html, projects.html) are regenerated each build

**Quality:**

- Husky pre-commit hooks automatically run `npm run validate` before each commit
- ESLint/Prettier ensure code quality and formatting
- Stylelint maintains CSS standards
- Gitleaks prevents credential leaks
- Deploy script validates everything before pushing to GitHub

## Blog Post Format

New blog posts require this frontmatter structure:

```markdown
---
title: 'Post Title'
date: 'YYYY-MM-DD'
excerpt: 'Brief description'
---

# Post Title

Content here...
```
