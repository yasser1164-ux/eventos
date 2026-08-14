// ---- EVENT DATA ----------------------------------------------------------
// To add an event: copy one block, change the values, keep the commas.
// The first one is a REAL match (Saudi Pro League, Matchweek 1).
// type: "event" (something happening) or "place" (somewhere to visit).
// image: poster/venue photo URL shown on the map pin and in the popup.
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mohammed%20Bin%20Fahd%20Stadium%2C%20Dammam%2C%20Saudi%20Arabia.jpg?width=600",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Al%20Khobar%20Corniche.JPG?width=600",
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
    image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='600'%20height='400'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%23f39c12'/%3E%3Cstop%20offset='1'%20stop-color='%23e74c3c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='600'%20height='400'%20fill='url(%23g)'/%3E%3Ctext%20x='300'%20y='255'%20font-size='160'%20text-anchor='middle'%3E%F0%9F%8D%9C%3C/text%3E%3C/svg%3E",
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
    image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='600'%20height='400'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%2300b894'/%3E%3Cstop%20offset='1'%20stop-color='%230984e3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='600'%20height='400'%20fill='url(%23g)'/%3E%3Ctext%20x='300'%20y='255'%20font-size='160'%20text-anchor='middle'%3E%F0%9F%8E%BE%3C/text%3E%3C/svg%3E",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ithra%20Library.jpg?width=600",
    ticketUrl: "https://www.ithra.com/en"
  }
];
