import https from 'https';

// List of repositories to fetch first commit dates for
const repositories = [
  'Shockp/Pentesting-scripts',
  'Shockp/Pentesting-Cheatsheets', 
  'Shockp/CVE-Exploits',
  'Shockp/HackTheBox-Writeups',
  'Shockp/AI-ML',
  'Shockp/Python-Projects',
  'Shockp/Mini-Shell',
  'Shockp/shockp.github.io'
];

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Node.js Script'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to format date to MMM DD, YYYY format
function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

// Function to get first commit date for a repository
async function getFirstCommitDate(repo) {
  try {
    // Get all commits in reverse chronological order (oldest first)
    const url = `https://api.github.com/repos/${repo}/commits?per_page=1&page=1`;
    
    // First, get the total number of commits to calculate the last page
    const response = await makeRequest(url);
    
    if (response.length === 0) {
      console.log(`No commits found for ${repo}`);
      return null;
    }
    
    // Get the link header to find total pages
    // For now, let's try to get commits in reverse order using since parameter
    // We'll use a different approach - get commits with a very old since date
    const oldDate = '2000-01-01T00:00:00Z';
    const oldestUrl = `https://api.github.com/repos/${repo}/commits?since=${oldDate}&per_page=100`;
    
    const oldestCommits = await makeRequest(oldestUrl);
    
    if (oldestCommits.length === 0) {
      console.log(`No commits found for ${repo}`);
      return null;
    }
    
    // Get the last commit from the array (oldest)
    const firstCommit = oldestCommits[oldestCommits.length - 1];
    const commitDate = firstCommit.commit.author.date;
    
    return {
      repo: repo,
      date: commitDate,
      formatted: formatDate(commitDate)
    };
    
  } catch (error) {
    console.error(`Error fetching commits for ${repo}:`, error.message);
    return null;
  }
}

// Main function to fetch all commit dates
async function fetchAllCommitDates() {
  console.log('Fetching first commit dates for all repositories...');
  
  const results = [];
  
  for (const repo of repositories) {
    console.log(`Fetching data for ${repo}...`);
    const result = await getFirstCommitDate(repo);
    if (result) {
      results.push(result);
      console.log(`${repo}: ${result.formatted}`);
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== RESULTS ===');
  results.forEach(result => {
    console.log(`${result.repo}: ${result.formatted}`);
  });
  
  return results;
}

// Run the script
fetchAllCommitDates().catch(console.error);