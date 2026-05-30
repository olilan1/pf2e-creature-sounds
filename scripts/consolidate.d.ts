/**
 * Consolidates pre-release (beta) changes into the Unreleased section
 * and removes the pre-release headers and reference links from the changelog.
 *
 * @param content - The raw CHANGELOG.md file content.
 * @param repoUrl - The fallback repository compare URL.
 * @returns The consolidated changelog content.
 */
export function consolidateChangelog(content: string, repoUrl?: string): string;
