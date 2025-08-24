#!/usr/bin/env node

/**
 * Build Performance Monitor
 * Tracks build times, bundle sizes, and performance metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildMonitor {
  constructor() {
    this.metricsFile = path.join(process.cwd(), 'build-metrics.json');
    this.reportFile = path.join(process.cwd(), 'build-report.html');
  }

  // Load existing metrics
  loadMetrics() {
    try {
      if (fs.existsSync(this.metricsFile)) {
        return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load existing metrics:', error.message);
    }
    return { builds: [] };
  }

  // Save metrics to file
  saveMetrics(metrics) {
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.error('Could not save metrics:', error.message);
    }
  }

  // Measure build time
  measureBuildTime() {
    console.log('📊 Measuring build performance...');
    const startTime = Date.now();

    try {
      execSync('npx next build', {
        stdio: 'inherit',
        env: { ...process.env, BUILD_MONITOR: 'true' },
      });
      const buildTime = Date.now() - startTime;
      console.log(`✅ Build completed in ${buildTime}ms`);
      return buildTime;
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }
  }

  // Analyze bundle sizes
  analyzeBundleSizes() {
    console.log('📦 Analyzing bundle sizes...');
    const nextDir = path.join(process.cwd(), '.next');

    if (!fs.existsSync(nextDir)) {
      console.warn('⚠️  .next directory not found');
      return {};
    }

    const sizes = {};

    try {
      // Get static chunk sizes
      const staticDir = path.join(nextDir, 'static', 'chunks');
      if (fs.existsSync(staticDir)) {
        const chunks = fs.readdirSync(staticDir);
        let totalChunkSize = 0;

        chunks.forEach(chunk => {
          const chunkPath = path.join(staticDir, chunk);
          const stats = fs.statSync(chunkPath);
          totalChunkSize += stats.size;
        });

        sizes.totalChunks = totalChunkSize;
        sizes.chunkCount = chunks.length;
      }

      // Get CSS sizes
      const cssDir = path.join(nextDir, 'static', 'css');
      if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir);
        let totalCssSize = 0;

        cssFiles.forEach(file => {
          const filePath = path.join(cssDir, file);
          const stats = fs.statSync(filePath);
          totalCssSize += stats.size;
        });

        sizes.totalCss = totalCssSize;
        sizes.cssFileCount = cssFiles.length;
      }

      console.log('📊 Bundle analysis complete');
      return sizes;
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      return {};
    }
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate HTML report
  generateReport(metrics) {
    const builds = metrics.builds.slice(-10); // Last 10 builds

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build Performance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric p { margin: 5px 0; color: #666; }
        .chart { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        .trend-up { color: #dc3545; }
        .trend-down { color: #28a745; }
        .trend-stable { color: #6c757d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Build Performance Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
    
    ${
      builds.length > 0
        ? `
    <div class="metric">
        <h3>📊 Latest Build Metrics</h3>
        <p><strong>Build Time:</strong> ${builds[builds.length - 1].buildTime}ms</p>
        <p><strong>Total Chunks:</strong> ${this.formatBytes(builds[builds.length - 1].bundleSizes.totalChunks || 0)}</p>
        <p><strong>Total CSS:</strong> ${this.formatBytes(builds[builds.length - 1].bundleSizes.totalCss || 0)}</p>
        <p><strong>Chunk Count:</strong> ${builds[builds.length - 1].bundleSizes.chunkCount || 0}</p>
    </div>
    
    <div class="metric">
        <h3>📈 Build History</h3>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Build Time</th>
                    <th>Total Chunks</th>
                    <th>Total CSS</th>
                    <th>Chunk Count</th>
                </tr>
            </thead>
            <tbody>
                ${builds
                  .map(
                    build => `
                <tr>
                    <td>${new Date(build.timestamp).toLocaleString()}</td>
                    <td>${build.buildTime}ms</td>
                    <td>${this.formatBytes(build.bundleSizes.totalChunks || 0)}</td>
                    <td>${this.formatBytes(build.bundleSizes.totalCss || 0)}</td>
                    <td>${build.bundleSizes.chunkCount || 0}</td>
                </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    </div>
    `
        : '<p>No build data available yet. Run a build to see metrics.</p>'
    }
    
    <div class="metric">
        <h3>💡 Performance Tips</h3>
        <ul>
            <li>Keep individual chunks under 200KB for optimal loading</li>
            <li>Monitor build time trends - increases may indicate dependency bloat</li>
            <li>Use code splitting for large components</li>
            <li>Optimize images and use next/image for better performance</li>
            <li>Run <code>npm run analyze</code> for detailed bundle analysis</li>
        </ul>
    </div>
</body>
</html>
    `;

    try {
      fs.writeFileSync(this.reportFile, html);
      console.log(`📄 Report generated: ${this.reportFile}`);
    } catch (error) {
      console.error('❌ Could not generate report:', error.message);
    }
  }

  // Run full monitoring
  async run() {
    console.log('🚀 Starting build performance monitoring...');

    const metrics = this.loadMetrics();
    const buildTime = this.measureBuildTime();
    const bundleSizes = this.analyzeBundleSizes();

    const buildMetric = {
      timestamp: Date.now(),
      buildTime,
      bundleSizes,
      nodeVersion: process.version,
      platform: process.platform,
    };

    metrics.builds.push(buildMetric);

    // Keep only last 50 builds
    if (metrics.builds.length > 50) {
      metrics.builds = metrics.builds.slice(-50);
    }

    this.saveMetrics(metrics);
    this.generateReport(metrics);

    console.log('✅ Build monitoring complete!');
    console.log(`📊 Build time: ${buildTime}ms`);
    console.log(
      `📦 Total chunks: ${this.formatBytes(bundleSizes.totalChunks || 0)}`
    );
    console.log(`🎨 Total CSS: ${this.formatBytes(bundleSizes.totalCss || 0)}`);
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new BuildMonitor();
  monitor.run().catch(error => {
    console.error('❌ Build monitoring failed:', error);
    process.exit(1);
  });
}

module.exports = BuildMonitor;
