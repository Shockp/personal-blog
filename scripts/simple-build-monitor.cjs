const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimpleBuildMonitor {
  constructor() {
    this.metricsFile = path.join(process.cwd(), 'build-metrics.json');
    this.reportFile = path.join(process.cwd(), 'build-report.html');
  }

  measureBuildTime() {
    console.log('🚀 Starting build performance monitoring...');
    const startTime = Date.now();
    
    try {
      // Run build with minimal output
      execSync('npm run build', { 
        stdio: 'pipe',
        env: { ...process.env, BUILD_MONITOR: 'true' }
      });
      const buildTime = Date.now() - startTime;
      console.log(`✅ Build completed in ${buildTime}ms`);
      return buildTime;
    } catch (error) {
      console.log('❌ Build failed, but continuing with analysis...');
      return Date.now() - startTime;
    }
  }

  analyzeBundleSize() {
    console.log('📊 Analyzing bundle sizes...');
    const buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
      console.log('⚠️  Build directory not found, skipping bundle analysis');
      return { totalSize: 0, chunks: [], css: [] };
    }

    const staticDir = path.join(buildDir, 'static');
    let totalSize = 0;
    const chunks = [];
    const css = [];

    if (fs.existsSync(staticDir)) {
      // Analyze JS chunks
      const chunksDir = path.join(staticDir, 'chunks');
      if (fs.existsSync(chunksDir)) {
        const chunkFiles = fs.readdirSync(chunksDir, { recursive: true });
        chunkFiles.forEach(file => {
          if (typeof file === 'string' && file.endsWith('.js')) {
            const filePath = path.join(chunksDir, file);
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);
              const size = stats.size;
              totalSize += size;
              chunks.push({ name: file, size });
            }
          }
        });
      }

      // Analyze CSS files
      const cssDir = path.join(staticDir, 'css');
      if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir);
        cssFiles.forEach(file => {
          if (file.endsWith('.css')) {
            const filePath = path.join(cssDir, file);
            const stats = fs.statSync(filePath);
            const size = stats.size;
            totalSize += size;
            css.push({ name: file, size });
          }
        });
      }
    }

    return { totalSize, chunks, css };
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  saveMetrics(buildTime, bundleAnalysis) {
    const metrics = {
      timestamp: new Date().toISOString(),
      buildTime,
      bundleSize: bundleAnalysis.totalSize,
      chunks: bundleAnalysis.chunks.length,
      cssFiles: bundleAnalysis.css.length,
      formattedSize: this.formatSize(bundleAnalysis.totalSize)
    };

    let history = [];
    if (fs.existsSync(this.metricsFile)) {
      try {
        history = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
      } catch (error) {
        console.log('⚠️  Could not read existing metrics, starting fresh');
      }
    }

    history.push(metrics);
    // Keep only last 10 builds
    if (history.length > 10) {
      history = history.slice(-10);
    }

    fs.writeFileSync(this.metricsFile, JSON.stringify(history, null, 2));
    console.log(`💾 Metrics saved to ${this.metricsFile}`);
    return metrics;
  }

  generateReport(metrics, bundleAnalysis) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Build Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .good { border-left: 4px solid #4CAF50; }
        .warning { border-left: 4px solid #FF9800; }
        .error { border-left: 4px solid #F44336; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Build Performance Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    <div class="metric ${metrics.buildTime < 30000 ? 'good' : metrics.buildTime < 60000 ? 'warning' : 'error'}">
        <h3>Build Time</h3>
        <p><strong>${(metrics.buildTime / 1000).toFixed(2)}s</strong></p>
        <p>${metrics.buildTime < 30000 ? '✅ Excellent' : metrics.buildTime < 60000 ? '⚠️ Could be improved' : '❌ Needs optimization'}</p>
    </div>
    
    <div class="metric ${metrics.bundleSize < 1024 * 1024 ? 'good' : metrics.bundleSize < 5 * 1024 * 1024 ? 'warning' : 'error'}">
        <h3>Bundle Size</h3>
        <p><strong>${metrics.formattedSize}</strong></p>
        <p>${metrics.bundleSize < 1024 * 1024 ? '✅ Great size' : metrics.bundleSize < 5 * 1024 * 1024 ? '⚠️ Consider optimization' : '❌ Too large'}</p>
    </div>
    
    <h2>Bundle Analysis</h2>
    <h3>JavaScript Chunks (${bundleAnalysis.chunks.length})</h3>
    <table>
        <tr><th>File</th><th>Size</th></tr>
        ${bundleAnalysis.chunks.map(chunk => 
          `<tr><td>${chunk.name}</td><td>${this.formatSize(chunk.size)}</td></tr>`
        ).join('')}
    </table>
    
    <h3>CSS Files (${bundleAnalysis.css.length})</h3>
    <table>
        <tr><th>File</th><th>Size</th></tr>
        ${bundleAnalysis.css.map(css => 
          `<tr><td>${css.name}</td><td>${this.formatSize(css.size)}</td></tr>`
        ).join('')}
    </table>
    
    <h2>Performance Tips</h2>
    <ul>
        <li>Use dynamic imports for code splitting</li>
        <li>Optimize images with next/image</li>
        <li>Remove unused dependencies</li>
        <li>Enable compression in production</li>
        <li>Use bundle analyzer to identify large dependencies</li>
    </ul>
</body>
</html>`;

    fs.writeFileSync(this.reportFile, html);
    console.log(`📄 Report generated: ${this.reportFile}`);
  }

  run() {
    try {
      const buildTime = this.measureBuildTime();
      const bundleAnalysis = this.analyzeBundleSize();
      const metrics = this.saveMetrics(buildTime, bundleAnalysis);
      this.generateReport(metrics, bundleAnalysis);
      
      console.log('\n📈 Build Performance Summary:');
      console.log(`⏱️  Build Time: ${(buildTime / 1000).toFixed(2)}s`);
      console.log(`📦 Bundle Size: ${this.formatSize(bundleAnalysis.totalSize)}`);
      console.log(`🧩 JS Chunks: ${bundleAnalysis.chunks.length}`);
      console.log(`🎨 CSS Files: ${bundleAnalysis.css.length}`);
      console.log(`\n✅ Monitoring complete! Check ${this.reportFile} for detailed report.`);
    } catch (error) {
      console.error('❌ Build monitoring failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the monitor
const monitor = new SimpleBuildMonitor();
monitor.run();