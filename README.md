# Personal Blog

A modern, high-performance personal blog built with Next.js 15, TypeScript, and Tailwind CSS. Features a clean design, optimized performance, and comprehensive content management system.

## 🚀 Features

### Core Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Markdown Support**: Full markdown support with syntax highlighting
- **SEO Optimized**: Built-in SEO with meta tags, structured data, and sitemap
- **Performance Optimized**: Code splitting, image optimization, and caching
- **Content Security Policy**: Enhanced security with CSP headers
- **Dark/Light Theme**: Theme switching with system preference detection

### Content Management

- **Markdown-based**: Write posts in markdown with frontmatter
- **Tag System**: Organize posts with tags and categories
- **Author Support**: Multi-author blog support
- **Date Formatting**: Automatic date parsing and formatting
- **Reading Time**: Automatic reading time calculation

### Developer Experience

- **TypeScript**: Full type safety throughout the application
- **ESLint & Prettier**: Code quality and formatting
- **Performance Monitoring**: Build-time performance tracking
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Size Limits**: Automated bundle size monitoring

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: Markdown with [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Syntax Highlighting**: [rehype-highlight](https://github.com/rehypejs/rehype-highlight)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Installation

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd personal-blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Adding Blog Posts

1. Create a new `.md` file in `content/posts/`
2. Add frontmatter with required fields:

   ```markdown
   ---
   title: 'Your Post Title'
   description: 'Brief description of your post'
   date: '2024-01-01'
   tags: ['tag1', 'tag2']
   author: 'Your Name'
   ---

   # Your Post Content

   Write your content here using markdown...
   ```

### Frontmatter Fields

- `title` (required): Post title
- `description` (required): Meta description for SEO
- `date` (required): Publication date (YYYY-MM-DD)
- `tags` (optional): Array of tags
- `author` (optional): Author name
- `draft` (optional): Set to `true` to hide from production

## 🚀 Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Quality Assurance

- `npm run check` - Run all checks (lint, format, build)
- `npm run lint:check` - Check linting without fixing
- `npm run format:check` - Check formatting without fixing

### Performance Analysis

- `npm run analyze` - Analyze bundle size
- `npm run bundle:size` - Generate bundle size report
- `npm run perf:build-time` - Monitor build performance
- `npm run perf:lighthouse` - Run Lighthouse performance audit
- `npm run size-limit` - Check bundle size limits

## 📁 Project Structure

```
personal-blog/
├── content/
│   └── posts/              # Blog posts in markdown
├── public/
│   ├── images/             # Static images
│   └── icons/              # Icon assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── blog/           # Blog pages
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript types
│   └── hooks/              # Custom React hooks
├── scripts/                # Build and utility scripts
└── docs/                   # Documentation files
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Analytics tracking ID
NEXT_PUBLIC_GA_ID=your-ga-id

# Optional: Site URL for absolute URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Customization

- **Styling**: Modify `tailwind.config.ts` for design system changes
- **Content**: Update `src/lib/posts.ts` for content processing logic
- **SEO**: Configure `src/app/layout.tsx` for global meta tags
- **Performance**: Adjust `next.config.js` for build optimizations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for various platforms.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs/)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Vercel](https://vercel.com/) for seamless deployment
- The open-source community for inspiration and tools

---

**Happy blogging!** 🎉
