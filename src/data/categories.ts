export interface Category {
  name: string
  slug: string
  description: string
  icon: string
  sort_order: number
}

export const macOSCategories: Category[] = [
  {
    name: 'Business',
    slug: 'business',
    description: 'Productivity, finance, and project management apps',
    icon: '💼',
    sort_order: 1
  },
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'IDEs, debugging, version control, and development utilities',
    icon: '⚒️',
    sort_order: 2
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Learning apps, reference materials, and educational tools',
    icon: '🎓',
    sort_order: 3
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Media players, streaming apps, and entertainment software',
    icon: '🎬',
    sort_order: 4
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Banking, budgeting, investment, and financial management tools',
    icon: '💰',
    sort_order: 5
  },
  {
    name: 'Games',
    slug: 'games',
    description: 'All game genres and gaming utilities',
    icon: '🎮',
    sort_order: 6
  },
  {
    name: 'Graphics & Design',
    slug: 'graphics-design',
    description: 'Image editing, design tools, CAD, and creative software',
    icon: '🎨',
    sort_order: 7
  },
  {
    name: 'Health & Fitness',
    slug: 'health-fitness',
    description: 'Workout apps, health tracking, and wellness tools',
    icon: '💪',
    sort_order: 8
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Home, food, travel, and lifestyle applications',
    icon: '🏠',
    sort_order: 9
  },
  {
    name: 'Medical',
    slug: 'medical',
    description: 'Healthcare professional tools and medical software',
    icon: '⚕️',
    sort_order: 10
  },
  {
    name: 'Music',
    slug: 'music',
    description: 'Audio production, music players, and sound editing tools',
    icon: '🎵',
    sort_order: 11
  },
  {
    name: 'News',
    slug: 'news',
    description: 'News readers, journalism tools, and information apps',
    icon: '📰',
    sort_order: 12
  },
  {
    name: 'Photography',
    slug: 'photography',
    description: 'Photo editing, camera apps, and photography tools',
    icon: '📸',
    sort_order: 13
  },
  {
    name: 'Productivity',
    slug: 'productivity',
    description: 'Task management, note-taking, and productivity utilities',
    icon: '📝',
    sort_order: 14
  },
  {
    name: 'Reference',
    slug: 'reference',
    description: 'Dictionaries, encyclopedias, guides, and reference materials',
    icon: '📚',
    sort_order: 15
  },
  {
    name: 'Social Networking',
    slug: 'social-networking',
    description: 'Social media, communication, and networking apps',
    icon: '👥',
    sort_order: 16
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports tracking, team management, and athletic apps',
    icon: '⚽',
    sort_order: 17
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Maps, booking, travel planning, and navigation apps',
    icon: '✈️',
    sort_order: 18
  },
  {
    name: 'Utilities',
    slug: 'utilities',
    description: 'System tools, file management, and utility applications',
    icon: '🔧',
    sort_order: 19
  },
  {
    name: 'Video',
    slug: 'video',
    description: 'Video editing, streaming, and production software',
    icon: '🎥',
    sort_order: 20
  },
  {
    name: 'Weather',
    slug: 'weather',
    description: 'Weather apps, forecasting, and meteorological tools',
    icon: '🌤️',
    sort_order: 21
  }
]
