// ---- EVENT DATA ----------------------------------------------------------
// To add an event: copy one block, change the values, keep the commas.
// The first one is a REAL match (Saudi Pro League, Matchweek 1).
const EVENTS = [
  {
    id: 1,
    title: "Al-Ettifaq vs Al-Riyadh",
    category: "Football",
    emoji: "⚽",
    venue: "Prince Mohamed bin Fahd Stadium, Dammam",
    time: "Tonight · Aug 14",
    lat: 26.3927,
    lng: 49.9777,
    heat: 90, // 0-100 popularity — drives the glow size
    ticketUrl: "https://webook.com"
  },
  {
    id: 2,
    title: "Live Music Night",
    category: "Concert",
    emoji: "🎸",
    venue: "Al Khobar Corniche",
    time: "Tonight · 9:00 PM",
    lat: 26.2870,
    lng: 50.2130,
    heat: 70,
    ticketUrl: "https://webook.com"
  },
  {
    id: 3,
    title: "Food & Culture Festival",
    category: "Festival",
    emoji: "🍜",
    venue: "Al Rashid Mall Plaza",
    time: "All weekend",
    lat: 26.3050,
    lng: 50.1980,
    heat: 55,
    ticketUrl: "https://webook.com"
  },
  {
    id: 4,
    title: "Padel Championship",
    category: "Sports",
    emoji: "🎾",
    venue: "Khobar Sports Hub",
    time: "Tomorrow · 5:00 PM",
    lat: 26.2680,
    lng: 50.2200,
    heat: 40,
    ticketUrl: "https://webook.com"
  }
];
