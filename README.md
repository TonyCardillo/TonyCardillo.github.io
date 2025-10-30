# entmoot.io

My personal website built with a simple Node.js static site generator and the Everforest theme.

## Writing Blog Posts

1. Create a new Markdown file in `blog/posts/`:

   ```markdown
   ---
   title: 'Your Post Title'
   date: '2025-01-27'
   excerpt: 'Brief description of your post'
   ---

   # Your Post Title

   Your content here...
   ```

2. Run the build command:

   ```bash
   npm run build
   ```

3. Commit and push to deploy via GitHub Pages.

## Structure

- `blog/posts/` - Markdown blog posts
- `css/style.css` - Everforest theme styles
- `build.js` - Static site generator
- Generated HTML files are created in the root and `blog/` directories
