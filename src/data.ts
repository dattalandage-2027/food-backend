import type { MenuItem, Restaurant } from "./types";

export const restaurants: Restaurant[] = [
  {
    id: "spice-route",
    name: "The Spice Route",
    cuisine: "North Indian · Mughlai",
    rating: 4.7,
    deliveryTime: "25–30 min",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    priceForTwo: 700,
    offer: "50% OFF up to ₹120",
    address: "Indiranagar, Bengaluru",
    dineout: true
  },
  {
    id: "napoli-table",
    name: "Napoli Table",
    cuisine: "Italian · Pizza",
    rating: 4.5,
    deliveryTime: "30–35 min",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80",
    priceForTwo: 900,
    offer: "Free garlic bread",
    address: "Koramangala, Bengaluru",
    dineout: true
  },
  {
    id: "green-bowl",
    name: "Green Bowl Kitchen",
    cuisine: "Healthy · Salads",
    rating: 4.6,
    deliveryTime: "20–25 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    priceForTwo: 500,
    offer: "20% OFF",
    address: "HSR Layout, Bengaluru",
    dineout: false
  },
  {
    id: "wok-story",
    name: "Wok Story",
    cuisine: "Asian · Chinese",
    rating: 4.4,
    deliveryTime: "30–40 min",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    priceForTwo: 650,
    offer: "₹125 OFF above ₹499",
    address: "Whitefield, Bengaluru",
    dineout: true
  }
];

export const menuItems: MenuItem[] = [
  { id: "butter-chicken", restaurantId: "spice-route", name: "Butter Chicken", description: "Tandoori chicken in a rich tomato and butter gravy", price: 340, category: "Mains", vegetarian: false, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" },
  { id: "paneer-tikka", restaurantId: "spice-route", name: "Paneer Tikka", description: "Charred cottage cheese with peppers and mint chutney", price: 280, category: "Starters", vegetarian: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80" },
  { id: "garlic-naan", restaurantId: "spice-route", name: "Garlic Naan", description: "Tandoor-baked flatbread with garlic butter", price: 75, category: "Breads", vegetarian: true, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80" },
  { id: "margherita", restaurantId: "napoli-table", name: "Margherita Pizza", description: "San Marzano tomato, mozzarella, basil and olive oil", price: 390, category: "Pizza", vegetarian: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80" },
  { id: "truffle-pasta", restaurantId: "napoli-table", name: "Truffle Mushroom Pasta", description: "Creamy tagliatelle, mushrooms and truffle oil", price: 450, category: "Pasta", vegetarian: true, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80" },
  { id: "protein-bowl", restaurantId: "green-bowl", name: "Protein Power Bowl", description: "Quinoa, chickpeas, roasted vegetables and tahini", price: 320, category: "Bowls", vegetarian: true, image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80" },
  { id: "teriyaki-bowl", restaurantId: "wok-story", name: "Teriyaki Chicken Bowl", description: "Grilled chicken, sticky rice, greens and sesame", price: 350, category: "Rice Bowls", vegetarian: false, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80" },
  { id: "chilli-tofu", restaurantId: "wok-story", name: "Crispy Chilli Tofu", description: "Crispy tofu tossed with chilli, garlic and scallions", price: 285, category: "Starters", vegetarian: true, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" }
];
