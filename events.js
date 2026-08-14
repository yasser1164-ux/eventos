// ---- EVENT DATA ----------------------------------------------------------
// To add an event: copy one block, change the values, keep the commas.
// The first one is a REAL match (Saudi Pro League, Matchweek 1).
// type: "event" (something happening) or "place" (somewhere to visit).
// image: poster artwork (img/*.svg) shown on the map pin and in the popup.
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
    type: "event",
    image: "img/al-ettifaq-vs-al-riyadh.svg",
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
    type: "event",
    image: "img/live-music-night.svg",
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
    type: "event",
    image: "img/food-culture-festival.svg",
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
    type: "event",
    image: "img/padel-championship.svg",
    ticketUrl: "https://webook.com"
  },
  {
    id: 5,
    title: "Ithra — King Abdulaziz Center for World Culture",
    category: "Culture",
    emoji: "🏛️",
    venue: "Gharb Al Dhahran, Dhahran",
    time: "Open daily",
    lat: 26.3269,
    lng: 50.1287,
    heat: 65,
    type: "place",
    image: "img/ithra.svg",
    ticketUrl: "https://www.ithra.com/en"
  }
];
