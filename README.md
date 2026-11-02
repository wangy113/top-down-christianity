# The Counselor of Aksum

A learning game for Chapter 9 of *World History: Cultures, States, and Societies to 1500* (section 9.6, Aksum and Ethiopia). Students hold an imagined office, Counselor of the Throne, and advise four rulers about Christianity in Aksum and Ethiopia, from about 330 CE to the 1620s.

## How it works

Each of the four audiences has five steps:

1. **The summons.** The ruler asks something only the chapter answers. A wrong answer never blocks. After two misses the game points to the right paragraph.
2. **Your counsel.** Three options, each with a cost. The student backs the choice with an evidence card quoted from 9.6.
3. **Forecast.** What did the throne actually do?
4. **The record.** What the chapter and other sources say, each claim tagged by where it comes from.
5. **Place it.** Did the push come from the throne, the people, or outside?

Two Scribe's Challenges ask students to check the chapter against other sources (the 303 CE date for Frumentius, and whether nine priests "founded" the church).

Seals reward reading and evidence: 13 are possible. Any advice can earn full seals. The Chronicle at the end shows every choice and stays inside the game. There is no export. Writing and grading happen in Canvas.

## The four audiences

| # | Moment | Historian's placement |
|---|---|---|
| 1 | About 330 CE: Christian merchants ask for prayer houses | Throne and outside |
| 2 | The 340s: what goes on Ezana's coin | Throne |
| 3 | Late 400s: nine refugee priests and Ge'ez | People and outside |
| 4 | The 1620s: Susenyos turns Catholic | Throne and people |

## Editing

All student-facing text is in `content.js`. After editing, run `npm run check`. It checks structure and the writing rules (no em dashes, no semicolons, no middle dots), and it fails if an evidence card gives away a record or a scene gives away a key.

## Checks

    npm install
    npm run check     # content and writing rules
    npm run test:ui   # plays the game in Chrome, axe accessibility, phone widths

## Hosting

GitHub Pages through `.github/workflows/pages.yml`. In the repository settings, set Pages > Source to "GitHub Actions". The site is plain static files with relative paths, so it works under `/counselor-of-aksum/` and inside a Canvas iframe. Progress is kept in the browser only. There are no accounts, analytics or third-party requests.

## Sources and credits

See the About page in the game. Card quotes come from Chapter 9 by Charlotte Miller (CC BY-SA 4.0). Coin photos are by Ismoon via Wikimedia Commons (CC BY-SA 4.0, British Museum objects). Fonts are Righteous and DM Sans (SIL OFL). Game text is shared under CC BY-SA 4.0.

## Review status

This is a draft for instructor and specialist review. It has not been tried with students.
