export type OpportunityType =
  | 'festival'
  | 'playlist'
  | 'sync'
  | 'press'
  | 'label'
  | 'booking'
  | 'grant';

export type Opportunity = {
  id: string;
  headline: string;
  source: string;
  sourceLogo: string;
  date: string;
  location: string;
  genres: string[];
  type: OpportunityType;
  email: string;
  website: string;
  deadline: string;
  requiredAssets: string[];
  summary: string;
  relevance: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  mood: string;
  uploadDate: string;
  notes: string;
  collaborators: string;
  status: 'demo' | 'in progress' | 'mixing' | 'mastering' | 'scheduled' | 'released';
  fileName?: string;
  previewUrl?: string;
};

export type ArtworkAsset = {
  id: string;
  title: string;
  type: 'cover art' | 'promo art' | 'social asset' | 'press image' | 'moodboard';
  uploadedDate: string;
  status: 'draft' | 'review' | 'approved';
  previewUrl?: string;
};

export type PressAssets = {
  artistBio: string;
  shortBio: string;
  longBio: string;
  oneSheet: string;
  pressRelease: string;
  contactEmail: string;
  phone: string;
  socials: string;
  photos: string[];
};

export type Release = {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'planning' | 'scheduled' | 'active campaign' | 'released';
  artworkReady: number;
  metadataComplete: number;
  campaignReady: number;
  pressSent: number;
  playlistsPitched: number;
  progress: number;
  description: string;
};

export type CareerTimelineEvent = {
  date: string;
  title: string;
  detail: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  category: 'venue' | 'promoter' | 'blog' | 'label' | 'playlist' | 'collaborator';
  status: string;
  lastTouch: string;
};

export const industryFeed = [
  { id: 'stockholm-festivals', title: 'Stockholm festivals opening artist applications' },
  { id: 'nordic-playlists', title: 'Nordic pop playlists accepting independent submissions' },
  { id: 'miami-new-venue', title: 'New Miami venue looking for emerging live acts' },
  { id: 'berlin-promoters', title: 'Berlin promoters looking for support acts' },
  { id: 'london-showcases', title: 'London showcase nights accepting new submissions' },
  { id: 'sync-briefs-cinematic', title: 'Sync briefs open for cinematic electronic tracks' },
  { id: 'copenhagen-camp', title: 'Copenhagen songwriter camp accepting applications' },
  { id: 'indie-labels-nordic', title: 'Independent labels seeking export-ready Nordic acts' },
  { id: 'european-booking', title: 'European booking agents preparing spring tour routing' },
  { id: 'music-supervisors-darkpop', title: 'Music supervisors searching for dark alternative pop' },
  { id: 'grant-deadlines', title: 'Grant deadlines approaching for independent creators' },
  { id: 'latin-curators-miami', title: 'Latin pop curators active in Miami this month' },
  { id: 'southern-sweden-venues', title: 'New venue circuit opening across Southern Sweden' },
  { id: 'epk-tip', title: 'Tip: update your EPK before outreach' },
  { id: 'festival-video-clips', title: 'Festival bookers prioritizing strong live video clips' },
];

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    headline: 'Stockholm indie venue seeks synth-pop opener for summer showcase',
    source: 'Nordic Stage Magazine',
    sourceLogo: '/logos/stage-mag.svg',
    date: '2026-05-24',
    location: 'Stockholm, SE',
    genres: ['Synth Pop', 'Indie', 'Electronic'],
    type: 'booking',
    email: 'bookings@stage-mag.com',
    website: 'https://nordicstagemag.com/booking',
    deadline: '2026-05-29',
    requiredAssets: ['Live video clip', 'EPK', 'Recent single', 'Social proof'],
    summary:
      'A boutique Stockholm venue wants a polished synth-pop opener for its June showcase. They are prioritizing independent acts with strong visuals, livestream capability and regional touring interest.',
    relevance: 'High match for synth-driven artists with active Nordic momentum.',
  },
  {
    id: 'opp-2',
    headline: 'Playlist pitch: Scandinavian Chillwave collection',
    source: 'Stream Curator Network',
    sourceLogo: '/logos/stream-curator.svg',
    date: '2026-05-22',
    location: 'Remote',
    genres: ['Chillwave', 'Synth Pop', 'Ambient'],
    type: 'playlist',
    email: 'submissions@streamcurator.com',
    website: 'https://streamcurator.com/pitch',
    deadline: '2026-05-28',
    requiredAssets: ['Track preview link', 'Spotify URI', 'Bio', 'Artwork'],
    summary:
      'A curated Scandinavian chillwave playlist welcomes fresh entries from independent artists. Great for mood-driven synth tracks and low-fi pop releases seeking new exposure.',
    relevance: 'Strong fit for artists with late-night synth singles and artist storytelling.',
  },
  {
    id: 'opp-3',
    headline: 'Music supervisor wants cinematic electronic tracks for streaming drama',
    source: 'Sync Search',
    sourceLogo: '/logos/sync-search.svg',
    date: '2026-05-20',
    location: 'Remote',
    genres: ['Cinematic', 'Electronic', 'Alternative'],
    type: 'sync',
    email: 'sync@syncsearch.io',
    website: 'https://syncsearch.io/submit',
    deadline: '2026-06-02',
    requiredAssets: ['Instrumental stem', 'Mastered track', 'Cue sheet', 'License terms'],
    summary:
      'A TV drama sync opportunity is open for cinematic electronic productions with tension and atmosphere. The supervisor is especially interested in tracks with emotional build and vocal hooks.',
    relevance: 'Relevant for artists working with cinematic production and strong atmosphere.',
  },
  {
    id: 'opp-4',
    headline: 'Nordic creative grant for independent music projects',
    source: 'Seaside Arts Fund',
    sourceLogo: '/logos/seaside-fund.svg',
    date: '2026-05-18',
    location: 'Nordic region',
    genres: ['All genres'],
    type: 'grant',
    email: 'apply@seasidearts.org',
    website: 'https://seasidearts.org/grant',
    deadline: '2026-06-05',
    requiredAssets: ['Project proposal', 'Budget plan', 'Press kit', 'Previous work samples'],
    summary:
      'A grant program supporting independent artists in the Nordic region. Ideal for artists building a release campaign, funding tour development or producing a new EP.',
    relevance: 'High for artists seeking funding for a campaign or tour development project.',
  },
  {
    id: 'stockholm-festivals',
    headline: 'Stockholm festivals opening artist applications',
    source: 'Stockholm Arts Board',
    sourceLogo: '/logos/stockholm-festivals.svg',
    date: '2026-05-20',
    location: 'Stockholm, SE',
    genres: ['All genres'],
    type: 'festival',
    email: 'apply@stockholmfestivals.example',
    website: 'https://stockholmfestivals.example/apply',
    deadline: '2026-06-10',
    requiredAssets: ['Live video', 'EPK', 'Press kit'],
    summary: 'Multiple Stockholm festivals are accepting artist applications for the summer season.',
    relevance: 'High',
  },
  {
    id: 'nordic-playlists',
    headline: 'Nordic pop playlists accepting independent submissions',
    source: 'Nordic Curators',
    sourceLogo: '/logos/nordic-curators.svg',
    date: '2026-05-21',
    location: 'Remote',
    genres: ['Pop', 'Synth Pop'],
    type: 'playlist',
    email: 'submissions@nordiccurators.example',
    website: 'https://nordiccurators.example/submit',
    deadline: '2026-06-01',
    requiredAssets: ['Spotify link', 'Short bio', 'Artwork'],
    summary: 'Editorial playlists focusing on emerging Nordic pop acts are open for submissions.',
    relevance: 'Strong',
  },
  {
    id: 'miami-new-venue',
    headline: 'New Miami venue looking for emerging live acts',
    source: 'Miami Nights',
    sourceLogo: '/logos/miami-nights.svg',
    date: '2026-05-25',
    location: 'Miami, US',
    genres: ['Pop', 'Latin', 'Electronic'],
    type: 'booking',
    email: 'bookings@miaminights.example',
    website: 'https://miaminights.example/booking',
    deadline: '2026-06-05',
    requiredAssets: ['Live video', 'Rider', 'EPK'],
    summary: 'A new venue in Miami is programming emerging acts for a monthly residency.',
    relevance: 'Medium',
  },
  {
    id: 'berlin-promoters',
    headline: 'Berlin promoters looking for support acts',
    source: 'Berlin Live',
    sourceLogo: '/logos/berlin-live.svg',
    date: '2026-05-26',
    location: 'Berlin, DE',
    genres: ['Indie', 'Electronic'],
    type: 'booking',
    email: 'promoters@berlinlive.example',
    website: 'https://berlinlive.example/contact',
    deadline: '2026-06-15',
    requiredAssets: ['Live show video', 'Press kit'],
    summary: 'Promoters in Berlin seek support acts for summer club runs.',
    relevance: 'High',
  },
  {
    id: 'london-showcases',
    headline: 'London showcase nights accepting new submissions',
    source: 'London Sounds',
    sourceLogo: '/logos/london-sounds.svg',
    date: '2026-05-27',
    location: 'London, UK',
    genres: ['Indie', 'Pop'],
    type: 'booking',
    email: 'submissions@londonsounds.example',
    website: 'https://londonsounds.example/submit',
    deadline: '2026-06-12',
    requiredAssets: ['Live video', 'EPK'],
    summary: 'Showcase nights in London are open for discovery submissions.',
    relevance: 'Strong',
  },
  {
    id: 'sync-briefs-cinematic',
    headline: 'Sync briefs open for cinematic electronic tracks',
    source: 'Sync Collective',
    sourceLogo: '/logos/sync-collective.svg',
    date: '2026-05-28',
    location: 'Remote',
    genres: ['Cinematic', 'Electronic'],
    type: 'sync',
    email: 'submit@synccollective.example',
    website: 'https://synccollective.example/submit',
    deadline: '2026-06-08',
    requiredAssets: ['Instrumental stem', 'Cue sheet'],
    summary: 'New sync briefs target cinematic electronic tracks for TV and film.',
    relevance: 'High',
  },
  {
    id: 'copenhagen-camp',
    headline: 'Copenhagen songwriter camp accepting applications',
    source: 'Copenhagen Songhub',
    sourceLogo: '/logos/cph-songhub.svg',
    date: '2026-06-01',
    location: 'Copenhagen, DK',
    genres: ['Songwriting', 'Pop'],
    type: 'grant',
    email: 'apply@cphsonghub.example',
    website: 'https://cphsonghub.example/apply',
    deadline: '2026-06-20',
    requiredAssets: ['Demo tracks', 'Short bio'],
    summary: 'An intensive songwriter camp offering collaboration and mentorship in Copenhagen.',
    relevance: 'Medium',
  },
  {
    id: 'indie-labels-nordic',
    headline: 'Independent labels seeking export-ready Nordic acts',
    source: 'Indie Radar',
    sourceLogo: '/logos/indie-radar.svg',
    date: '2026-06-02',
    location: 'Nordic region',
    genres: ['All genres'],
    type: 'label',
    email: 'contact@indieradar.example',
    website: 'https://indieradar.example/submit',
    deadline: '2026-06-30',
    requiredAssets: ['EPK', 'Release plan'],
    summary: 'Several indie labels are scouting export-ready Nordic acts for international partnerships.',
    relevance: 'High',
  },
  {
    id: 'european-booking',
    headline: 'European booking agents preparing spring tour routing',
    source: 'Booking Network',
    sourceLogo: '/logos/booking-network.svg',
    date: '2026-06-03',
    location: 'Europe',
    genres: ['All'],
    type: 'booking',
    email: 'agents@bookingnetwork.example',
    website: 'https://bookingnetwork.example/contact',
    deadline: '2026-07-01',
    requiredAssets: ['Live video', 'Tour history'],
    summary: 'Booking agents are finalizing spring tour routes and open for new artist submissions.',
    relevance: 'Medium',
  },
  {
    id: 'music-supervisors-darkpop',
    headline: 'Music supervisors searching for dark alternative pop',
    source: 'Sync Search',
    sourceLogo: '/logos/sync-search.svg',
    date: '2026-06-04',
    location: 'Remote',
    genres: ['Alternative', 'Dark Pop'],
    type: 'sync',
    email: 'sync@syncsearch.example',
    website: 'https://syncsearch.example/submit',
    deadline: '2026-06-12',
    requiredAssets: ['Stem pack', 'Instrumental'],
    summary: 'Supervisors seek dark alternative pop tracks with cinematic textures.',
    relevance: 'High',
  },
  {
    id: 'grant-deadlines',
    headline: 'Grant deadlines approaching for independent creators',
    source: 'Creative Funds',
    sourceLogo: '/logos/creative-funds.svg',
    date: '2026-06-05',
    location: 'Nordic region',
    genres: ['All'],
    type: 'grant',
    email: 'info@creativefunds.example',
    website: 'https://creativefunds.example',
    deadline: '2026-06-15',
    requiredAssets: ['Project proposal', 'Budget'],
    summary: 'Multiple micro-grants are closing soon for independent creators in the region.',
    relevance: 'High',
  },
  {
    id: 'latin-curators-miami',
    headline: 'Latin pop curators active in Miami this month',
    source: 'Miami Playlist Hub',
    sourceLogo: '/logos/miami-playlists.svg',
    date: '2026-06-06',
    location: 'Miami, US',
    genres: ['Latin Pop'],
    type: 'playlist',
    email: 'curate@miamiplaylisthub.example',
    website: 'https://miamiplaylisthub.example/submit',
    deadline: '2026-06-20',
    requiredAssets: ['Track link', 'Short bio'],
    summary: 'Curators focusing on Latin pop will be active during the Miami season.',
    relevance: 'Medium',
  },
  {
    id: 'southern-sweden-venues',
    headline: 'New venue circuit opening across Southern Sweden',
    source: 'Scandi Venues',
    sourceLogo: '/logos/scandi-venues.svg',
    date: '2026-06-07',
    location: 'Southern Sweden',
    genres: ['All'],
    type: 'booking',
    email: 'contact@scandivenues.example',
    website: 'https://scandivenues.example',
    deadline: '2026-07-10',
    requiredAssets: ['Live video', 'EPK'],
    summary: 'A circuit of new venues in Southern Sweden is booking local and touring acts.',
    relevance: 'Medium',
  },
  {
    id: 'epk-tip',
    headline: 'Tip: update your EPK before outreach',
    source: 'AIM Tips',
    sourceLogo: '/logos/aim-tips.svg',
    date: '2026-06-08',
    location: 'Remote',
    genres: ['All'],
    type: 'press',
    email: 'help@aim.example',
    website: 'https://aim.example/help',
    deadline: '2026-12-31',
    requiredAssets: ['EPK', 'High-res photos'],
    summary: 'A quick reminder to refresh your EPK and links before sending outreach.',
    relevance: 'General',
  },
  {
    id: 'festival-video-clips',
    headline: 'Festival bookers prioritizing strong live video clips',
    source: 'Festival Network',
    sourceLogo: '/logos/festival-network.svg',
    date: '2026-06-09',
    location: 'Europe',
    genres: ['All'],
    type: 'booking',
    email: 'bookings@festivalnetwork.example',
    website: 'https://festivalnetwork.example',
    deadline: '2026-07-01',
    requiredAssets: ['Live video', 'EPK', 'Press kit'],
    summary: 'Festival bookers are prioritizing artists with strong live video content for upcoming lineups.',
    relevance: 'High',
  },
];

export const studioSongs: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight Echo',
    artist: 'Aurora Lane',
    bpm: 112,
    key: 'D#m',
    genre: 'Synth Pop',
    mood: 'Dreamy',
    uploadDate: '2026-05-09',
    notes: 'Feels ready for early release, needs a stronger hook at 1:15.',
    collaborators: 'Jo, K.',
    status: 'demo',
  },
  {
    id: 'song-2',
    title: 'Neon Afterglow',
    artist: 'Aurora Lane',
    bpm: 118,
    key: 'F#m',
    genre: 'Electronic',
    mood: 'Melancholic',
    uploadDate: '2026-04-20',
    notes: 'Add vocal layers and tighten the bridge transition.',
    collaborators: 'Lina',
    status: 'in progress',
  },
  {
    id: 'song-3',
    title: 'Skyline Drive',
    artist: 'Aurora Lane',
    bpm: 104,
    key: 'C#m',
    genre: 'Indie Pop',
    mood: 'Reflective',
    uploadDate: '2026-03-17',
    notes: 'Mix is strong; finalize mastering and artwork.',
    collaborators: 'Mika',
    status: 'mastering',
  },
];

export const studioArtwork: ArtworkAsset[] = [
  {
    id: 'art-1',
    title: 'Midnight Echo cover',
    type: 'cover art',
    uploadedDate: '2026-05-10',
    status: 'review',
  },
  {
    id: 'art-2',
    title: 'Neon Afterglow promo',
    type: 'promo art',
    uploadedDate: '2026-04-22',
    status: 'draft',
  },
  {
    id: 'art-3',
    title: 'Tour moodboard',
    type: 'moodboard',
    uploadedDate: '2026-04-12',
    status: 'approved',
  },
];

export const pressAssets: PressAssets = {
  artistBio:
    'Aurora Lane is an independent Nordic artist blending synth-pop atmospheres with cinematic storytelling. Her work explores late-night cityscapes, emotional clarity and strong melodic hooks.',
  shortBio:
    'Independent Nordic synth-pop artist Aurora Lane crafts cinematic songs for late-night playlists and festival stages.',
  longBio:
    'Aurora Lane is a Stockholm-based artist known for lush synth arrangements, emotive vocal delivery and a modern Nordic sound. She has released multiple EPs that have gained traction on independent playlists across Europe and is building a unique live set that bridges electronic precision with singer-songwriter storytelling.',
  oneSheet:
    `Aurora Lane is an emerging synth-pop artist from Stockholm. Combining cinematic production with heartfelt lyrics, Aurora creates music for listeners who crave mood-driven pop with emotional depth. Recent singles include "Midnight Echo" and "Neon Afterglow". Available for interviews, bookings and sync conversations.`,
  pressRelease: `Aurora Lane announces her new single "Midnight Echo" — a nocturnal synth-pop exploration that blends cinematic textures with intimate lyricism. The single will be accompanied by a limited run of live performances across Scandinavia and an intimate one-off listening event in Stockholm. Press assets, stems and one-sheets are available on request.`,
  contactEmail: 'press@auroralane.example',
  phone: '+46 70 123 4567',
  socials: 'instagram.com/auroralane · spotify.com/artist/auroralane',
  photos: ['/images/aurora-hero.jpg', '/images/aurora-portrait.jpg'],
};

export const managerModes = [
  { id: 'mode-supportive', label: 'Supportive', description: 'Gentle reminders and encouragement; ideal for steady creative flow.' },
  { id: 'mode-proactive', label: 'Proactive', description: 'Regular nudges, outreach and campaign prompts to keep momentum.' },
  { id: 'mode-highperf', label: 'High-performance', description: 'Aggressive cadence aimed at rapid growth and milestone completion.' },
];

export const careerTimeline: CareerTimelineEvent[] = [
  { date: '2026-02-03', title: 'Previous release', detail: 'Single reached curated indie playlists across Europe.' },
  { date: '2026-04-10', title: 'Small venue tour', detail: 'Three-city run with strong local support and sold-out headline.' },
  { date: '2026-05-09', title: 'New single recorded', detail: 'Studio session completed for "Midnight Echo".' },
];

export const contacts: Contact[] = [
  { id: 'c-1', name: 'Nordic Stage', role: 'Venue programmer', category: 'venue', status: 'open', lastTouch: '2026-05-10' },
  { id: 'c-2', name: 'Stream Curator', role: 'Playlist editor', category: 'playlist', status: 'pending', lastTouch: '2026-05-12' },
  { id: 'c-3', name: 'Seaside Arts Fund', role: 'Grant officer', category: 'promoter', status: 'applied', lastTouch: '2026-05-15' },
];