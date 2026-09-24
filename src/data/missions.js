const focusedTools = {
  crop: true,
  draw: true,
  text: true,
  filter: false,
  resize: false,
  shapes: true,
  stickers: false,
  frame: false,
}

const printTools = {
  crop: true,
  draw: false,
  text: true,
  filter: true,
  resize: false,
  shapes: false,
  stickers: false,
  frame: true,
}

// Mission flavor adapted from ref/src/data/incidents.js; runtime stays independent of /ref.
export const MISSIONS = [
  {
    id: 'the-boat',
    number: '01',
    title: 'THE BOAT',
    codename: 'PALMETTO WITHDRAWAL',
    location: 'Downtown vault / Costa Luma',
    image: '/assets/MAINSCREEN-Jason_and_Lucia_Robbery_With_Logo_landscape.jpg',
    objective: 'Find what matters in the marina handoff.',
    briefing:
      'The stills came in first: masks up, cash moving, engines hot. Crop the noise, mark the suspicious subject, and add a street label before the signal goes cold.',
    officerQuote: 'If the whole city still fits in the JPEG, you have not found the story.',
    requiredActions: ['crop', 'draw', 'text'],
    tools: focusedTools,
    reward: 320,
    rep: 18,
    unlock: 'M. Vega - Harbor Stringer',
  },
  {
    id: 'front-page',
    number: '02',
    title: 'FRONT PAGE',
    codename: 'DOCKSIDE EXIT WOUNDS',
    location: 'Bolero Pier / South slips',
    image: '/assets/LOADING01-Jason_and_Lucia_Beach_landscape.jpg',
    objective: 'Turn the source frame into a publishable newspaper image.',
    briefing:
      'Two suspects, one bag, and a city desk that needs proof before sunrise. Tight crop, a tonal pass, text, and a frame stamp sell the story.',
    officerQuote: 'We do not chase the boat. We publish the frame.',
    requiredActions: ['crop', 'filter', 'text', 'frame'],
    tools: printTools,
    reward: 460,
    rep: 24,
    unlock: 'The Gazette Front Page',
  },
  {
    id: 'the-package',
    number: '03',
    title: 'THE PACKAGE',
    codename: 'WAIT FOR THE BOOM',
    location: 'Overpass 12724 / Downtown lookout',
    image: '/assets/LOADING01-DreQuan_Priest_landscape.jpg',
    objective: 'Inspect the frame and annotate the hidden clue.',
    briefing:
      'A runner crossed the lens with a package nobody admits exists. Zoom the detail, isolate it, and tag the clue for the newsroom archive.',
    officerQuote: 'If the skyline is still the star, you missed the person carrying the problem.',
    requiredActions: ['crop', 'draw', 'text'],
    tools: { ...focusedTools, filter: true },
    reward: 540,
    rep: 31,
    unlock: 'Unknown Caller',
  },
]
