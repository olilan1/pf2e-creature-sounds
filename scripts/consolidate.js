/**
 * Consolidates pre-release (beta) changes into the Unreleased section
 * and removes the pre-release headers and reference links from the changelog.
 *
 * @param {string} content - The raw CHANGELOG.md file content.
 * @param {string} repoUrl - The fallback repository compare URL.
 * @returns {string} The consolidated changelog content.
 */
export function consolidateChangelog(
  content,
  repoUrl = 'https://github.com/olilan1/pf2e-creature-sounds/compare/'
) {
  // Split content by newline, stripping out carriage returns for cross-platform safety
  const lines = content.split(/\r?\n/);

  // 1. Find key section boundaries in the changelog
  const unreleasedIndex = lines.findIndex(line => line.trim() === '## [Unreleased]');
  if (unreleasedIndex === -1) return content;

  const headerRegex = /^##\s+\[([a-zA-Z0-9.\-+]+)\]/;
  const firstStableIndex = lines.findIndex((line, idx) => {
    if (idx <= unreleasedIndex) return false;
    const match = line.match(headerRegex);
    return match && match[1].toLowerCase() !== 'unreleased' && !match[1].includes('-');
  });

  if (firstStableIndex === -1) return content; // Return unmodified if no stable version exists

  const stableVersion = lines[firstStableIndex].match(headerRegex)[1];

  // 2. Identify the pre-release versions we want to consolidate and delete
  const prereleaseHeaders = new Set();
  for (let i = unreleasedIndex + 1; i < firstStableIndex; i++) {
    const match = lines[i].match(headerRegex);
    if (match) {
      prereleaseHeaders.add(match[1]);
    }
  }

  // 3. Extract all bullet points from the pre-release block
  const bullets = [];
  for (let i = unreleasedIndex + 1; i < firstStableIndex; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('-')) {
      bullets.push(lines[i]);
    }
  }

  // 4. Find the start of the reference links at the bottom
  const linkRegex = /^\[([a-zA-Z0-9.\-+]+)\]:\s*(.*)/;
  const firstLinkIndex = lines.findIndex(line => linkRegex.test(line.trim()));

  // 5. Separate the body lines from the link lines
  let bodyLines;
  let linkLines;
  if (firstLinkIndex !== -1) {
    bodyLines = lines.slice(0, firstLinkIndex);
    linkLines = lines.slice(firstLinkIndex);
  } else {
    bodyLines = lines;
    linkLines = [];
  }

  // 6. Construct the new consolidated Unreleased section
  const newUnreleased = [
    '## [Unreleased]',
    '',
    ...bullets,
    ''
  ];

  // 7. Reconstruct the body
  const introLines = bodyLines.slice(0, unreleasedIndex);
  const stableLines = bodyLines.slice(firstStableIndex);
  const newBodyLines = [...introLines, ...newUnreleased, ...stableLines];

  // 8. Clean up and update the reference links
  let repoCompareBase = repoUrl;
  const filteredLinks = [];

  for (const line of linkLines) {
    const match = line.trim().match(linkRegex);
    if (match) {
      const version = match[1];
      const url = match[2];

      if (prereleaseHeaders.has(version)) {
        continue; // Skip pre-release reference links
      }

      if (version.toLowerCase() === 'unreleased') {
        const compareMatch = url.match(/(https:\/\/github\.com\/[^/]+\/[^/]+\/compare\/)/);
        if (compareMatch) {
          repoCompareBase = compareMatch[1];
        }
        continue; // Skip the old Unreleased link to rewrite it
      }
    }
    filteredLinks.push(line);
  }

  const newUnreleasedLink = `[Unreleased]: ${repoCompareBase}v${stableVersion}...HEAD`;
  const finalLinkLines = [newUnreleasedLink, ...filteredLinks];

  // 9. Reconstruct the final file content, joining with standard Unix newlines
  const finalContent = [...newBodyLines, ...finalLinkLines].join('\n');

  // Clean up duplicate consecutive empty lines to ensure the output is pristine
  return finalContent.replace(/\n{3,}/g, '\n\n');
}
