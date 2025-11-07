export type HostawayReviewCategory = {
  category: string;
  rating: number;
};

export type HostawayReview = {
  id: number;
  listingId: number;
  listingName: string;
  type: 'guest-to-host' | 'host-to-guest';
  status: 'published' | 'pending' | 'draft';
  rating: number | null;
  publicReview: string | null;
  privateReview?: string | null;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  channelName: string;
  managerResponse?: string | null;
};

export const hostawayMockReviews: HostawayReview[] = [
  {
    id: 10101,
    listingId: 5501,
    listingName: 'Shoreditch Loft - 2BR with City Views',
    type: 'guest-to-host',
    status: 'published',
    rating: 4.8,
    publicReview:
      'The loft was spotless and had everything we needed. Great location and easy check-in. Would definitely return!',
    reviewCategory: [
      { category: 'cleanliness', rating: 10 },
      { category: 'communication', rating: 9 },
      { category: 'accuracy', rating: 10 },
      { category: 'location', rating: 9 },
      { category: 'value', rating: 9 },
    ],
    submittedAt: '2024-09-18 16:40:00',
    guestName: 'Amelia Grant',
    channelName: 'Airbnb',
    managerResponse:
      'Thanks for staying with us, Amelia! Thrilled to hear you enjoyed the loft and location. Come back anytime.',
  },
  {
    id: 10102,
    listingId: 5501,
    listingName: 'Shoreditch Loft - 2BR with City Views',
    type: 'guest-to-host',
    status: 'published',
    rating: 4.2,
    publicReview:
      'Stylish space and great host communication. The street can be a bit noisy on weekends but overall a great stay.',
    reviewCategory: [
      { category: 'cleanliness', rating: 9 },
      { category: 'communication', rating: 10 },
      { category: 'check_in', rating: 10 },
      { category: 'location', rating: 8 },
      { category: 'value', rating: 8 },
    ],
    submittedAt: '2024-07-22 10:05:00',
    guestName: 'Oliver James',
    channelName: 'Booking.com',
  },
  {
    id: 10103,
    listingId: 5501,
    listingName: 'Shoreditch Loft - 2BR with City Views',
    type: 'host-to-guest',
    status: 'published',
    rating: null,
    publicReview: 'Oliver left the flat in perfect condition and was a pleasure to host.',
    reviewCategory: [
      { category: 'cleanliness', rating: 10 },
      { category: 'communication', rating: 10 },
      { category: 'respect_house_rules', rating: 10 },
    ],
    submittedAt: '2024-07-25 08:15:00',
    guestName: 'Oliver James',
    channelName: 'Hostaway',
  },
  {
    id: 10201,
    listingId: 6392,
    listingName: 'Camden Canal House - 3BR with Garden',
    type: 'guest-to-host',
    status: 'published',
    rating: 3.7,
    publicReview:
      'Lovely home and perfect for families. We had an issue with hot water on the first night but it was resolved quickly.',
    privateReview: 'Might be worth leaving clearer instructions for the thermostat.',
    reviewCategory: [
      { category: 'cleanliness', rating: 8 },
      { category: 'communication', rating: 9 },
      { category: 'check_in', rating: 8 },
      { category: 'location', rating: 9 },
      { category: 'value', rating: 8 },
    ],
    submittedAt: '2024-08-14 12:20:00',
    guestName: 'Priya Patel',
    channelName: 'Airbnb',
    managerResponse:
      'Thanks for flagging the hot water issue, Priya. We have updated the thermostat guide to make it clearer.',
  },
  {
    id: 10202,
    listingId: 6392,
    listingName: 'Camden Canal House - 3BR with Garden',
    type: 'guest-to-host',
    status: 'published',
    rating: 4.9,
    publicReview:
      'Absolutely charming house with a beautiful garden. The team went above and beyond to make our stay special.',
    reviewCategory: [
      { category: 'cleanliness', rating: 10 },
      { category: 'communication', rating: 10 },
      { category: 'location', rating: 9 },
      { category: 'value', rating: 9 },
    ],
    submittedAt: '2024-10-02 18:45:00',
    guestName: 'Sofia Rossi',
    channelName: 'Direct',
  },
  {
    id: 10203,
    listingId: 6392,
    listingName: 'Camden Canal House - 3BR with Garden',
    type: 'host-to-guest',
    status: 'published',
    rating: null,
    publicReview: 'Priya and her family took great care of the house. Welcome back anytime.',
    reviewCategory: [
      { category: 'cleanliness', rating: 9 },
      { category: 'communication', rating: 10 },
      { category: 'respect_house_rules', rating: 10 },
    ],
    submittedAt: '2024-08-16 09:30:00',
    guestName: 'Priya Patel',
    channelName: 'Hostaway',
  },
  {
    id: 10301,
    listingId: 7444,
    listingName: 'Notting Hill Studio - Portobello Escape',
    type: 'guest-to-host',
    status: 'published',
    rating: 3.2,
    publicReview:
      'Cute studio in a great spot. It was smaller than expected and the Wi-Fi dropped a few times, but overall ok.',
    reviewCategory: [
      { category: 'cleanliness', rating: 7 },
      { category: 'communication', rating: 8 },
      { category: 'accuracy', rating: 6 },
      { category: 'location', rating: 9 },
      { category: 'value', rating: 7 },
    ],
    submittedAt: '2024-06-05 09:00:00',
    guestName: 'Daniel Evans',
    channelName: 'Expedia',
  },
  {
    id: 10302,
    listingId: 7444,
    listingName: 'Notting Hill Studio - Portobello Escape',
    type: 'guest-to-host',
    status: 'published',
    rating: 4.6,
    publicReview:
      'Fantastic service and perfect location. The space is compact but beautifully designed.',
    reviewCategory: [
      { category: 'cleanliness', rating: 9 },
      { category: 'communication', rating: 9 },
      { category: 'accuracy', rating: 9 },
      { category: 'location', rating: 10 },
      { category: 'value', rating: 8 },
    ],
    submittedAt: '2024-09-28 21:15:00',
    guestName: 'Lucía Hernández',
    channelName: 'Airbnb',
  },
  {
    id: 10303,
    listingId: 7444,
    listingName: 'Notting Hill Studio - Portobello Escape',
    type: 'guest-to-host',
    status: 'pending',
    rating: 2.8,
    publicReview:
      'The studio was clean but we struggled with the self check-in code and there was construction noise early morning.',
    reviewCategory: [
      { category: 'cleanliness', rating: 8 },
      { category: 'communication', rating: 6 },
      { category: 'check_in', rating: 5 },
      { category: 'location', rating: 7 },
      { category: 'value', rating: 6 },
    ],
    submittedAt: '2024-10-20 08:50:00',
    guestName: 'Mark Wu',
    channelName: 'Booking.com',
  },
  {
    id: 10401,
    listingId: 8551,
    listingName: 'Canary Wharf Penthouse - River Views',
    type: 'guest-to-host',
    status: 'published',
    rating: 5,
    publicReview:
      'Luxury stay with unbeatable views. Concierge team was phenomenal and the apartment was immaculate.',
    reviewCategory: [
      { category: 'cleanliness', rating: 10 },
      { category: 'communication', rating: 10 },
      { category: 'check_in', rating: 10 },
      { category: 'location', rating: 9 },
      { category: 'value', rating: 9 },
    ],
    submittedAt: '2024-05-18 14:25:00',
    guestName: 'Charlotte Leclerc',
    channelName: 'Direct',
  },
  {
    id: 10402,
    listingId: 8551,
    listingName: 'Canary Wharf Penthouse - River Views',
    type: 'host-to-guest',
    status: 'published',
    rating: null,
    publicReview: 'Charlotte was a dream guest—communicative, tidy, and respectful of house rules.',
    reviewCategory: [
      { category: 'cleanliness', rating: 10 },
      { category: 'communication', rating: 10 },
      { category: 'respect_house_rules', rating: 10 },
    ],
    submittedAt: '2024-05-19 09:05:00',
    guestName: 'Charlotte Leclerc',
    channelName: 'Hostaway',
  },
];

