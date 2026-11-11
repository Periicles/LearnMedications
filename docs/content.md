# Content

## Sources and limits

Vidal has no free API: its data is licensed. The dataset is therefore **curated by hand** and
cross-checked against the official open database, the
[Base de Données Publique des Médicaments (BDPM)](https://base-donnees-publique.medicaments.gouv.fr/).

- Brand names were kept only when they exist in the BDPM as marketed specialities containing
  the expected substance.
- Families, indications, tiers and service tags come from general pharmacology knowledge. The
  first draft was produced with AI assistance and **must be reviewed by a healthcare
  professional** before the app is presented as a reference.

Run the cross-check at any time:

```bash
npm run content:check-bdpm
```

It downloads the BDPM files and lists brands or substances it cannot match. Findings are hints
for a reviewer, not failures: naming differs between sources (for example the BDPM lists
“argipressine” where clinicians say “vasopressine”).

## File format

One file per therapeutic area in `content/areas/<area-slug>.json`:

```json
{
  "area": { "slug": "pain", "name": "Douleur et inflammation", "icon": "💊" },
  "classes": [
    {
      "slug": "nsaids",
      "name": "Anti-inflammatoires non stéroïdiens (AINS)",
      "atc": "M01A",
      "summary": "One short sentence about the family."
    }
  ],
  "substances": [
    {
      "slug": "ibuprofen",
      "name": "Ibuprofène",
      "brands": ["Advil", "Nurofen"],
      "classSlug": "nsaids",
      "hint": "Douleurs, fièvre, inflammation",
      "tier": 1,
      "services": ["emergency", "community-pharmacy"]
    }
  ]
}
```

| Field      | Meaning                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| `slug`     | Stable identifier, lower-case ASCII kebab-case, unique across all files     |
| `name`     | French INN (DCI) with accents                                               |
| `brands`   | Up to three brand names marketed in France; empty when only the INN is used |
| `tier`     | 1 essential, 2 common, 3 specialised                                        |
| `services` | Hospital services where the molecule is a daily staple                      |

User progress is keyed by substance slug: **never rename a slug** once the app is live.

## Collections and lessons

Collections are derived from the dataset (`src/features/content/lib/collections.ts`):

- **Les essentiels** — every tier 1 molecule
- **One collection per service** — molecules tagged with that service
- **One collection per therapeutic area** — every molecule of the area

Lessons are generated per collection (`lessons.ts`): molecules are grouped by family, ordered
by tier and split into lessons of at most five. Families with fewer than three molecules in a
collection are merged into mixed lessons. A lesson is identified by its first substance slug.

## Adding content

1. Edit or add a file in `content/areas/`. A new file must be imported in
   `src/features/content/lib/area-files.ts`; a new service must be added to
   `src/features/content/constants.ts` and `src/types/content.ts`.
2. Run `npm run test`: the dataset is validated (schema, references, duplicates) and exercises
   are generated for every lesson.
3. Run `npm run content:check-bdpm` and review the findings.

## Covering the whole BDPM

The BDPM lists about 15,000 specialities, mostly dosage and generic variants of the same
molecules, and it has no therapeutic classification. A full import would need the ATC
classification from another source to be split into meaningful decks. The curated approach was
chosen for the first version; the BDPM download code in `scripts/bdpm/` is the starting point
for an import.
