# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run build` - Builds the static site by running build.js
- `npm run lint` - Lints JavaScript files with ESLint (auto-fix)
- `npm run format` - Formats code with Prettier
- `npm run lint:css` - Lints CSS files with Stylelint (auto-fix)
- `npm run security` - Runs Gitleaks to detect secrets/credentials
- `npm run validate` - Runs all checks (lint, format, security, build)
- `./deploy.sh` - Deploys to GitHub Pages with pre-deployment validation

## Architecture

This is a personal website built with a custom Node.js static site generator. The architecture is:

**Static Site Generator (build.js):**

- Reads Markdown files from `blog/posts/` with frontmatter (title, date, excerpt)
- Uses `marked` for Markdown parsing and `gray-matter` for frontmatter extraction
- Generates HTML files using template functions with consistent navigation and layout
- Outputs blog posts to `blog/` directory and static pages to root directory

**Content Structure:**

- Blog posts: Markdown files in `blog/posts/` with frontmatter metadata
- Static pages: Generated from template functions in build.js (home, about, projects)
- CSS: Single stylesheet at `css/style.css` using Everforest theme
- Templates: HTML structure defined in build.js template functions, not separate files

**Build Process:**

- All HTML files are generated and overwritten on each build
- Blog index page lists all posts sorted by date (newest first)
- Individual blog post pages include navigation back to blog index
- Static pages (index.html, about.html, projects.html) are regenerated each build

**Deployment:**
GitHub Pages serves the generated HTML files directly from the repository root and blog/ directory.

**Safety & Quality:**

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
