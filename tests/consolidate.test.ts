import { describe, it, expect } from 'vitest';
import { consolidateChangelog } from '../scripts/consolidate.js';

describe('Changelog Consolidation Logic', () => {
  it('should consolidate multiple pre-release sections and clean them up', () => {
    const mockChangelog = `# Changelog

## [Unreleased]

- Some final tweak

## [0.64.0-beta.1] - 2026-05-20

- Feature B
- Fix for Feature A

## [0.64.0-beta.0] - 2026-05-18

- Feature A

## [0.63.0] - 2026-05-11

- Dancing Blade automation

[Unreleased]: https://github.com/o/p/compare/v0.64.0-beta.1...HEAD
[0.64.0-beta.1]: https://github.com/o/p/compare/v0.64.0-beta.0...v0.64.0-beta.1
[0.64.0-beta.0]: https://github.com/o/p/compare/v0.63.0...v0.64.0-beta.0
[0.63.0]: https://github.com/o/p/compare/v0.62.0...v0.63.0
`;

    const expected = `# Changelog

## [Unreleased]

- Some final tweak
- Feature B
- Fix for Feature A
- Feature A

## [0.63.0] - 2026-05-11

- Dancing Blade automation

[Unreleased]: https://github.com/o/p/compare/v0.63.0...HEAD
[0.63.0]: https://github.com/o/p/compare/v0.62.0...v0.63.0
`;

    const result = consolidateChangelog(mockChangelog);
    expect(result.trim()).toBe(expected.trim());
  });

  it('should return identical content if no pre-releases exist', () => {
    const mockChangelog = `# Changelog

## [Unreleased]

- Workaround for turn spells

## [0.63.0] - 2026-05-18

- Dancing Blade automation

[Unreleased]: https://github.com/o/p/compare/v0.63.0...HEAD
[0.63.0]: https://github.com/o/p/compare/v0.62.0...v0.63.0
`;

    const result = consolidateChangelog(mockChangelog);
    expect(result.trim()).toBe(mockChangelog.trim());
  });
});
