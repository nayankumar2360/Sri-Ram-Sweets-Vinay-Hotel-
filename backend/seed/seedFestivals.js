require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Festival = require('../models/Festival');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const verifiedFestivals = [
  // ================= 2026 FESTIVALS =================
  {
    name: 'Makar Sankranti 2026',
    slug: 'makar-sankranti-2026',
    description: 'Celebrate Makar Sankranti with traditional Tilkut, Tilwa, Lai, Chura, and fresh Gur delicacies made with pure ingredients.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-01-14T00:00:00+05:30'),
    endDate: new Date('2026-01-14T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Makar Sankranti (Dahi Chura & Tilkut)',
        date: new Date('2026-01-14T00:00:00+05:30'),
        description: 'Holy bathing, savouring authentic Tilkut, Dahi Chura, and Khichdi.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      headline: 'Authentic Tilkut & Sankranti Specials',
      subtitle: 'Crispy Gaya-style Tilkut, Tilwa, Badam Patti, and pure Desi Gur sweets for your family celebration.',
      ctaText: 'Explore Sankranti Specials',
      ctaLink: '/pre-order',
      overlayOpacity: 0.5,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 150,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Saraswati Puja 2026',
    slug: 'saraswati-puja-2026',
    description: 'Vasant Panchami celebration honouring Maa Saraswati with pure saffron Boondi, Kesariya Laddu, and festive offerings.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-01-23T00:00:00+05:30'),
    endDate: new Date('2026-01-23T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Saraswati Vandana & Pujan',
        date: new Date('2026-01-23T00:00:00+05:30'),
        description: 'Vasant Panchami pushpanjali and offering of yellow sweets (Kesariya Boondi & Motichoor).'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1609137144827-0c7b6d17e651?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1609137144827-0c7b6d17e651?auto=format&fit=crop&w=800&q=80',
      headline: 'Maa Saraswati Puja Bhog & Sweets',
      subtitle: 'Pure Ghee Kesariya Motichoor Laddu, Boondi, and traditional bhog prasad prepared with reverence.',
      ctaText: 'Pre-Order Puja Bhog',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 200,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Maha Shivratri 2026',
    slug: 'maha-shivratri-2026',
    description: 'Auspicious Shivratri fasting specials: pure Dry Fruit Rabdi, Kaju Katli, Pedha, and fasting delicacies.',
    region: 'Pan-India',
    year: 2026,
    startDate: new Date('2026-02-15T00:00:00+05:30'),
    endDate: new Date('2026-02-15T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Maha Shivratri Vrat & Jalabhishek',
        date: new Date('2026-02-15T00:00:00+05:30'),
        description: 'Day-long prayer, Shiva worship, and pure satvik vrat bhog.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
      headline: 'Sacred Shivratri Vrat & Phalahari Bhog',
      subtitle: 'Fresh Malai Pedha, Kheer Kadam, and pure dry fruit sweets for fasting devotees.',
      ctaText: 'View Shivratri Specials',
      ctaLink: '/pre-order',
      overlayOpacity: 0.5,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 150,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Holi 2026',
    slug: 'holi-2026',
    description: 'Festival of colours with authentic pure Khoya Gujiya, Kesar Thandai, Malpua, and savoury snacks.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-03-03T00:00:00+05:30'),
    endDate: new Date('2026-03-04T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Holika Dahan',
        date: new Date('2026-03-03T00:00:00+05:30'),
        description: 'Bonfire rituals celebrating the victory of devotion and goodness.'
      },
      {
        title: 'Rangotsav (Dhulandi)',
        date: new Date('2026-03-04T00:00:00+05:30'),
        description: 'Celebration of colours with Mawa Gujiya, Bihari Malpua, and festive cheer.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=800&q=80',
      headline: 'Rang Barse with Sri Ram Sweets!',
      subtitle: 'Rich Desi Ghee Mawa Gujiya, Bihari Pua, Kesar Thandai, and premium festive gift hampers.',
      ctaText: 'Pre-Order Holi Gujiya',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 300,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Chaiti Chhath Puja 2026',
    slug: 'chaiti-chhath-puja-2026',
    description: 'Chaitra month Chhath Mahaparv observed with strict devotion, featuring pure ghee Thekua, Kasar, and Arghya offerings.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-03-23T00:00:00+05:30'),
    endDate: new Date('2026-03-26T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Nahay Khay',
        date: new Date('2026-03-23T00:00:00+05:30'),
        description: 'Sacred bath and intake of pure bottle-gourd satvik prasad.'
      },
      {
        title: 'Kharna',
        date: new Date('2026-03-24T00:00:00+05:30'),
        description: 'Day-long waterless fast concluding with Rasiya (jaggery kheer) and Roti prasad.'
      },
      {
        title: 'Sandhya Arghya',
        date: new Date('2026-03-25T00:00:00+05:30'),
        description: 'Evening offerings to the setting Sun God with Thekua soop.'
      },
      {
        title: 'Usha Arghya & Paran',
        date: new Date('2026-03-26T00:00:00+05:30'),
        description: 'Morning offerings to the rising Sun God followed by fasting conclusion.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=800&q=80',
      headline: 'Chaiti Chhath Mahaparv Prasad & Thekua',
      subtitle: 'Pure Desi Ghee Thekua, Kasar Laddu, and traditional puja soop offerings prepared with devotion.',
      ctaText: 'Pre-Order Chhath Prasad',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 250,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Ram Navami 2026',
    slug: 'ram-navami-2026',
    description: 'Birth celebration of Bhagwan Shri Ram with traditional Panjiri, Motichoor Laddu, and sweet offerings.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-03-27T00:00:00+05:30'),
    endDate: new Date('2026-03-27T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Shri Ram Janmotsav',
        date: new Date('2026-03-27T00:00:00+05:30'),
        description: 'Midday divine birth rituals, flag hoisting, and distribution of special prasad.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      headline: 'Jai Shri Ram: Divine Janmotsav Prasad',
      subtitle: 'Pure Ghee Besan Laddu, Motichoor, and Special Bhog prepared for Ram Navami celebrations.',
      ctaText: 'Order Ram Navami Bhog',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 200,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Raksha Bandhan 2026',
    slug: 'raksha-bandhan-2026',
    description: 'Celebrating the sacred bond of brothers and sisters with luxury sweet boxes, Kaju Katli, Ghewar, and Rasmalai.',
    region: 'Pan-India',
    year: 2026,
    startDate: new Date('2026-08-28T00:00:00+05:30'),
    endDate: new Date('2026-08-28T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Rakhi Celebrations',
        date: new Date('2026-08-28T00:00:00+05:30'),
        description: 'Tying of the protective thread and exchanging blessings and mithai.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
      headline: 'Celebrate the Sweet Bond of Rakhi',
      subtitle: 'Exclusive Raksha Bandhan gift boxes, Malai Ghewar, Kaju Katli, and Gulab Jamun.',
      ctaText: 'Pre-Order Rakhi Hampers',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 250,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Krishna Janmashtami 2026',
    slug: 'krishna-janmashtami-2026',
    description: 'Lord Krishna birth celebration with pure Makhan Mishri, Dhaniya Panjiri, Mohanbhog, and Peda.',
    region: 'Pan-India',
    year: 2026,
    startDate: new Date('2026-09-04T00:00:00+05:30'),
    endDate: new Date('2026-09-04T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Shri Krishna Janmotsav',
        date: new Date('2026-09-04T00:00:00+05:30'),
        description: 'Midnight celebration with 56 Bhog and sweet offerings for Bal Gopal.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1609137144827-0c7b6d17e651?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1609137144827-0c7b6d17e651?auto=format&fit=crop&w=800&q=80',
      headline: 'Divine Janmashtami Bhog & Makhan Sweets',
      subtitle: 'Mathura-style Peda, Malai Peda, Panjiri, and pure dairy sweets for Laddu Gopal.',
      ctaText: 'Pre-Order Janmashtami Bhog',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 200,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Hartalika Teej 2026',
    slug: 'hartalika-teej-2026',
    description: 'Sacred festival celebrated across Bihar and Eastern UP with traditional Thekua, Pirukiya (Gujiya), and Balushahi.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-09-14T00:00:00+05:30'),
    endDate: new Date('2026-09-14T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Hartalika Vrat & Shiva-Parvati Pujan',
        date: new Date('2026-09-14T00:00:00+05:30'),
        description: 'Women observe nirjala fast and prepare handmade Pirukiya and Thekua.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=800&q=80',
      headline: 'Authentic Bihari Teej Specials & Pirukiya',
      subtitle: 'Handmade pure Suji & Khoya Pirukiya, Crispy Balushahi, and festive gift packs for your family.',
      ctaText: 'Explore Teej Specials',
      ctaLink: '/pre-order',
      overlayOpacity: 0.5,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 200,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Sharad Navratri & Dussehra 2026',
    slug: 'dussehra-navratri-2026',
    description: 'Grand Navratri festivities and Vijayadashami celebration with pure Jalebi, Cham Cham, and Durga Puja bhog.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-10-11T00:00:00+05:30'),
    endDate: new Date('2026-10-20T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Ghatasthapana (Navratri Day 1)',
        date: new Date('2026-10-11T00:00:00+05:30'),
        description: 'Commencement of Sharad Navratri with sacred Kalash sthapana.'
      },
      {
        title: 'Maha Saptami & Bel Baran',
        date: new Date('2026-10-17T00:00:00+05:30'),
        description: 'Opening of the divine Durga Puja pandals across Bihar.'
      },
      {
        title: 'Maha Ashtami (Kanya Pujan)',
        date: new Date('2026-10-18T00:00:00+05:30'),
        description: 'Sacred worship of the nine forms and Kanya feeding with Halwa Puri and Chana.'
      },
      {
        title: 'Maha Navami',
        date: new Date('2026-10-19T00:00:00+05:30'),
        description: 'Havan, Aarti, and Mahaprasad offerings to Maa Durga.'
      },
      {
        title: 'Vijayadashami / Dussehra',
        date: new Date('2026-10-20T00:00:00+05:30'),
        description: 'Victory of good over evil, celebrated with traditional crispy Jalebi and sweets.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      headline: 'Celebrate the Joy of Dussehra & Durga Puja',
      subtitle: 'Make every celebration sweeter with authentic Bihari mithai, hot Desi Ghee Jalebi, and festive gift boxes.',
      ctaText: 'Explore Dussehra Specials',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 400,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Dhanteras & Diwali 2026',
    slug: 'diwali-dhanteras-2026',
    description: 'Grand Deepawali celebration with premium Kaju Katli, Motichoor Laddu, Dry Fruit Sweets, and bespoke corporate gift hampers.',
    region: 'Pan-India',
    year: 2026,
    startDate: new Date('2026-11-06T00:00:00+05:30'),
    endDate: new Date('2026-11-10T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Dhanteras',
        date: new Date('2026-11-06T00:00:00+05:30'),
        description: 'Auspicious day for prosperity, new beginnings, and purchasing pure sweets.'
      },
      {
        title: 'Choti Diwali (Roop Chaudas)',
        date: new Date('2026-11-07T00:00:00+05:30'),
        description: 'Lighting of diyas and festive house gatherings.'
      },
      {
        title: 'Lakshmi Puja / Diwali Day',
        date: new Date('2026-11-08T00:00:00+05:30'),
        description: 'Grand festival of lights, evening Lakshmi-Ganesh puja, and gifting.'
      },
      {
        title: 'Govardhan Puja',
        date: new Date('2026-11-09T00:00:00+05:30'),
        description: 'Annakut offerings and honoring mother nature.'
      },
      {
        title: 'Bhai Dooj (Bhaiya Dooj)',
        date: new Date('2026-11-10T00:00:00+05:30'),
        description: 'Sisterly prayers and festive brother-sister sweet gifts.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      headline: 'Make Your Diwali Sweeter!',
      subtitle: 'Celebrate the festival of lights with delicious pure ghee sweets, thoughtful gift boxes, and moments of joy.',
      ctaText: 'Explore Diwali Specials',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 7,
      maxTotalOrders: 600,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Chhath Puja 2026 (Kartik Mahaparv)',
    slug: 'chhath-puja-2026',
    description: 'The supreme festival of Bihar dedicated to the Sun God and Chhathi Maiya, celebrated with utmost purity, Thekua, Kasar, and sacred offerings.',
    region: 'Bihar',
    year: 2026,
    startDate: new Date('2026-11-13T00:00:00+05:30'),
    endDate: new Date('2026-11-16T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Nahay Khay (Day 1)',
        date: new Date('2026-11-13T00:00:00+05:30'),
        description: 'Sacred bath, purification, and satvik meal of Kaddu-Bhaat and Chana dal.'
      },
      {
        title: 'Kharna (Day 2)',
        date: new Date('2026-11-14T00:00:00+05:30'),
        description: 'Full-day nirjala fast followed by evening prasad of Rasiya (jaggery kheer) and Roti.'
      },
      {
        title: 'Sandhya Arghya / Sanjhka Aragh (Day 3)',
        date: new Date('2026-11-15T00:00:00+05:30'),
        description: 'Evening prayers at the river ghats offering Arghya to the setting Sun God with bamboo soop loaded with Thekua and fruits.'
      },
      {
        title: 'Usha Arghya / Bhorwa Aragh (Day 4)',
        date: new Date('2026-11-16T00:00:00+05:30'),
        description: 'Morning prayers to the rising Sun God, breaking the 36-hour fast (Paran) and distributing divine prasad.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=800&q=80',
      headline: 'Celebrate Chhath with Devotion and Tradition',
      subtitle: 'Bring home traditional pure Desi Ghee Thekua, Kasar, and holy offerings crafted with sacred purity for Chhathi Maiya.',
      ctaText: 'Explore Chhath Specials',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 7,
      maxTotalOrders: 800,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },

  // ================= 2027 FESTIVALS =================
  {
    name: 'Makar Sankranti 2027',
    slug: 'makar-sankranti-2027',
    description: 'Traditional Makar Sankranti feast in Bihar with pure sesame Tilkut, Gur Tilwa, Badam Gajak, and Dahi Chura.',
    region: 'Bihar',
    year: 2027,
    startDate: new Date('2027-01-14T00:00:00+05:30'),
    endDate: new Date('2027-01-14T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Makar Sankranti Snan & Dahi Chura',
        date: new Date('2027-01-14T00:00:00+05:30'),
        description: 'Traditional Tilkut sharing and family celebrations.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      headline: 'Sankranti Sweets & Gaya Tilkut',
      subtitle: 'Authentic winter sweet treats crafted with pure sesame and jaggery.',
      ctaText: 'Pre-Order Tilkut',
      ctaLink: '/pre-order',
      overlayOpacity: 0.5,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 200,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Saraswati Puja 2027',
    slug: 'saraswati-puja-2027',
    description: 'Vasant Panchami festivities with pure Kesariya Laddu, Boondi bhog, and offerings for knowledge and wisdom.',
    region: 'Bihar',
    year: 2027,
    startDate: new Date('2027-02-11T00:00:00+05:30'),
    endDate: new Date('2027-02-11T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Vasant Panchami Puja',
        date: new Date('2027-02-11T00:00:00+05:30'),
        description: 'Pushpanjali and cultural gatherings honoring Maa Saraswati.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1609137144827-0c7b6d17e651?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1609137144827-0c7b6d17e651?auto=format&fit=crop&w=800&q=80',
      headline: 'Maa Saraswati Puja Special Prasad',
      subtitle: 'Yellow Boondi, Kesariya Laddu, and pure festive bhog.',
      ctaText: 'Pre-Order Puja Bhog',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 250,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Holi 2027',
    slug: 'holi-2027',
    description: 'Vibrant festival of colours with Mawa Gujiya, Kesar Thandai, and traditional Bihari Malpua.',
    region: 'Bihar',
    year: 2027,
    startDate: new Date('2027-03-22T00:00:00+05:30'),
    endDate: new Date('2027-03-23T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Holika Dahan',
        date: new Date('2027-03-22T00:00:00+05:30'),
        description: 'Sacred fire rituals marking victory of faith.'
      },
      {
        title: 'Rangotsav (Holi Dhuleti)',
        date: new Date('2027-03-23T00:00:00+05:30'),
        description: 'Play of colours and sharing of delicious festive delicacies.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=800&q=80',
      headline: 'Holi Ke Rang, Mithai Ke Sang!',
      subtitle: 'Pure Ghee Mawa Gujiya, Thandai, and premium sweet boxes.',
      ctaText: 'Order Holi Treats',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 5,
      maxTotalOrders: 350,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Chhath Puja 2027 (Kartik Mahaparv)',
    slug: 'chhath-puja-2027',
    description: 'Chhath Puja Mahaparv celebrated with sacred Thekua, Kasar, and divine soop prasad.',
    region: 'Bihar',
    year: 2027,
    startDate: new Date('2027-11-03T00:00:00+05:30'),
    endDate: new Date('2027-11-06T23:59:59+05:30'),
    importantDays: [
      {
        title: 'Nahay Khay',
        date: new Date('2027-11-03T00:00:00+05:30'),
        description: 'Day 1 purification and holy bath.'
      },
      {
        title: 'Kharna',
        date: new Date('2027-11-04T00:00:00+05:30'),
        description: 'Day 2 evening Rasiya prasad.'
      },
      {
        title: 'Sandhya Arghya',
        date: new Date('2027-11-05T00:00:00+05:30'),
        description: 'Day 3 sunset offerings at river banks.'
      },
      {
        title: 'Usha Arghya & Paran',
        date: new Date('2027-11-06T00:00:00+05:30'),
        description: 'Day 4 sunrise Arghya and fast completion.'
      }
    ],
    banner: {
      desktopImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=1920&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=800&q=80',
      headline: 'Holy Chhath Mahaparv Pure Prasad',
      subtitle: 'Pure Ghee Thekua, Khajoor, Kasar, and puja offerings crafted with absolute reverence.',
      ctaText: 'Pre-Order Chhath Prasad',
      ctaLink: '/pre-order',
      overlayOpacity: 0.45,
      focalPoint: 'center',
      enabled: true
    },
    preorderSettings: {
      enabled: true,
      leadTimeDays: 7,
      maxTotalOrders: 850,
      currentTotalOrders: 0
    },
    manualOverride: { status: 'auto' },
    isFeatured: false,
    isActive: true
  }
];

const seedFestivals = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas for Festival Seeding...');

    // Fetch existing preorder-enabled products to associate with festivals where relevant
    const products = await Product.find({ preorderEnabled: true });
    const productIds = products.map(p => p._id);

    let createdCount = 0;
    let updatedCount = 0;

    for (const festData of verifiedFestivals) {
      // If products exist in database, associate them if not explicitly set
      if (!festData.products || festData.products.length === 0) {
        festData.products = productIds;
      }

      const existing = await Festival.findOne({ slug: festData.slug });
      if (existing) {
        // Update existing document without overwriting order counts or manual overrides already made by owner
        await Festival.updateOne(
          { slug: festData.slug },
          { 
            $set: {
              name: festData.name,
              description: festData.description,
              region: festData.region,
              year: festData.year,
              startDate: festData.startDate,
              endDate: festData.endDate,
              importantDays: festData.importantDays,
              banner: {
                ...festData.banner,
                desktopImage: existing.banner?.desktopImage || festData.banner.desktopImage,
                mobileImage: existing.banner?.mobileImage || festData.banner.mobileImage,
                headline: existing.banner?.headline || festData.banner.headline,
                subtitle: existing.banner?.subtitle || festData.banner.subtitle,
                ctaText: existing.banner?.ctaText || festData.banner.ctaText
              },
              'preorderSettings.enabled': existing.preorderSettings?.enabled ?? festData.preorderSettings.enabled,
              'preorderSettings.leadTimeDays': existing.preorderSettings?.leadTimeDays ?? festData.preorderSettings.leadTimeDays,
              'preorderSettings.maxTotalOrders': existing.preorderSettings?.maxTotalOrders ?? festData.preorderSettings.maxTotalOrders,
              isActive: existing.isActive ?? festData.isActive,
              products: existing.products?.length ? existing.products : festData.products
            }
          }
        );
        updatedCount++;
      } else {
        await Festival.create(festData);
        createdCount++;
      }
    }

    console.log(`Festival Seed Complete! Created: ${createdCount}, Updated: ${updatedCount}, Total Processed: ${verifiedFestivals.length}`);
    return { createdCount, updatedCount, total: verifiedFestivals.length };
  } catch (error) {
    console.error('Error seeding festivals:', error);
    throw error;
  }
};

// Allow running standalone from CLI
if (require.main === module) {
  seedFestivals()
    .then(() => {
      console.log('Seeding script finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding script failed:', err);
      process.exit(1);
    });
}

module.exports = seedFestivals;
