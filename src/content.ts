const whatsapp = (phone: string, text: string) =>
  `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`

export const brand = {
  name: 'AppleToe',
  legalName: 'AppleToe Productions',
  motto: 'Shoot. Cut. Post.',
  headline: 'Make them look inevitable.',
  lede: 'Photography and video by Shashwat Sagar for underground rappers, indie artists, and brands. Music videos, reels, covers.',
  markSrc: '/assets/brand/reel-mark.png',
  markLineSrc: '/assets/brand/reel-line.png',
  heroStill: '/assets/appletoe-brand/still-hero-reel.png',
}

export const contacts = {
  founder: {
    name: 'Shashwat Sagar',
    role: 'Founder · Photographer · Videographer',
    phone: '+91 8799715131',
    phoneHref: 'tel:+918799715131',
    whatsappNumber: '918799715131',
    whatsappHref: whatsapp('918799715131', "Hey Shashwat! I'd love to discuss a shoot / reel."),
    email: 'shashwatsagarphoto@gmail.com',
    emailHref: 'mailto:shashwatsagarphoto@gmail.com',
    instagram: '@shashwatsagarr',
    instagramHref: 'https://instagram.com/shashwatsagarr',
  },
  studio: {
    name: 'AppleToe Productions',
    role: 'Music videos · Podcasts · Short films',
    phone: '+91 9650562234',
    phoneHref: 'tel:+919650562234',
    whatsappNumber: '919650562234',
    whatsappHref: whatsapp('919650562234', 'Hey AppleToe! I have a music video / podcast / film project.'),
    email: 'appletoeproductions@gmail.com',
    emailHref: 'mailto:appletoeproductions@gmail.com',
    instagram: '@appletoe.co',
    instagramHref: 'https://www.instagram.com/appletoe.co',
  },
}

type Desk = keyof typeof contacts

const service = (title: string, body: string, formats: string, desk: Desk) => ({
  title,
  body,
  formats,
  href: whatsapp(contacts[desk].whatsappNumber, `Hey ${desk === 'founder' ? 'Shashwat' : 'AppleToe'}! I want to book: ${title}.`),
})

export const services = [
  service(
    'Artist shoots',
    'Night portraits, cover stills, and session photos that hold up on a phone and on a flyer.',
    'Covers · Press · Sessions',
    'founder',
  ),
  service(
    'Reels & content',
    'Short-form cuts for artists who need constant drops. Raw energy, tight turnaround.',
    '9:16 · Shorts · Drops',
    'founder',
  ),
  service(
    'Music videos',
    'Story-driven videos with underground rappers and indie acts, from treatment to final grade.',
    'Treatment → Grade',
    'studio',
  ),
  service(
    'Short films',
    'Stories shot with a sharp eye for detail and narrative flow, built to stay with people after the credits.',
    'Script · Shoot · Post',
    'studio',
  ),
  service(
    'Podcasts',
    'Studio-quality conversations. Capture, cut, and package episodes that still feel live.',
    'Multi-cam · Audio · Clips',
    'studio',
  ),
]

type Work = {
  title: string
  artists: string[]
  label?: string
  youtubeId: string
  still: string
  focus?: string
}

export const works: Work[] = [
  {
    title: 'Tanashahi',
    artists: ['Insane', 'Moulik'],
    label: 'Eleven Eleven',
    youtubeId: 'Kqipd4tNiLU',
    still: '/assets/work/tanashahi.jpg',
  },
  {
    title: 'Homework',
    artists: ['Sxnchay', 'Unfuckman'],
    youtubeId: 'JP-2tUc2v2c',
    still: '/assets/work/homework.jpg',
  },
  {
    title: 'Theher Ja',
    artists: ['Divyansh Verma'],
    youtubeId: 'vWwq5s-8CgM',
    still: '/assets/work/theher-ja.jpg',
  },
  {
    title: 'Aao Na',
    artists: ['Divyansh Verma', 'Ameeshi Bhatnagar'],
    youtubeId: 'vcbz70ue1do',
    still: '/assets/work/aao-na.jpg',
  },
  {
    title: 'Aake Milo',
    artists: ['Vyaas', 'Khushi Bajotra'],
    label: 'Eleven Eleven',
    youtubeId: '90rG5SQhwYw',
    still: '/assets/work/aake-milo.jpg',
    focus: '50% 18%',
  },
  {
    title: 'Memories',
    artists: ['Floki', 'Dhadkan'],
    label: 'Eleven Eleven',
    youtubeId: 'KnZKYVYzMUU',
    still: '/assets/work/memories.jpg',
  },
  {
    title: 'Farak Padta Nahi',
    artists: ['Vyaas', 'Insane'],
    label: 'Eleven Eleven',
    youtubeId: 'uWdZzY56PZg',
    still: '/assets/work/farak-padta-nahi.jpg',
    focus: '50% 25%',
  },
]

export const credit = (w: Work) => w.artists.join(' & ')

export const artists = [...new Set(works.flatMap((w) => w.artists))]

export const reels = [
  { id: 'DZKleGQImx0', account: '@freefireindiaofficial', client: 'Free Fire India' },
  { id: 'DYABscwxKLi', account: '@taraano_ka_zikr', client: 'Taraano Ka Zikr' },
  { id: 'DZMG3HCT9lq', account: '@freefireindiaofficial', client: 'Free Fire India' },
  { id: 'DWHKH0yDzkO', account: '@rohanmagic × @flipsyde.in', client: 'Rohan Magic × Flipsyde' },
].map((r) => ({
  ...r,
  href: `https://www.instagram.com/reel/${r.id}/`,
  embed: `https://www.instagram.com/reel/${r.id}/embed/`,
}))
