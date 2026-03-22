const sampleListings = [
   {
      title: "Cliffside Villa Over Vagator Bay",
      description:
         "A breezy design-led villa with sunset decks, a plunge pool, and quick access to Goa's cafes, beach clubs, and laid-back shoreline walks.",
      image: {
         filename: "wanderlust/india/vagator-cliff-villa",
         url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      },
      price: 14500,
      location: "North Goa",
      country: "India",
      category: "Beach",
      maxGuests: 6,
   },
   {
      title: "Palm House Near Varkala Cliff",
      description:
         "A calm tropical stay wrapped in palms, built for slow mornings, surf sessions, and evening walks along Varkala's dramatic sea cliffs.",
      image: {
         filename: "wanderlust/india/varkala-palm-house",
         url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
      },
      price: 9800,
      location: "Varkala, Kerala",
      country: "India",
      category: "Beach",
      maxGuests: 4,
   },
   {
      title: "Sunset Surf House in Gokarna",
      description:
         "A modern coastal retreat for beach-hoppers who want peaceful coves, warm evenings, and a flexible base near Om Beach and Kudle.",
      image: {
         filename: "wanderlust/india/gokarna-surf-house",
         url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      },
      price: 7600,
      location: "Gokarna, Karnataka",
      country: "India",
      category: "Beach",
      maxGuests: 3,
   },
   {
      title: "Andaman Lagoon Escape",
      description:
         "A bright island stay close to blue water, snorkeling trails, and quiet stretches of sand for a slower tropical itinerary.",
      image: {
         filename: "wanderlust/india/andaman-lagoon-escape",
         url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
      price: 18200,
      location: "Havelock Island, Andaman",
      country: "India",
      category: "Beach",
      maxGuests: 5,
   },
   {
      title: "Snowline Chalet in Manali",
      description:
         "A pine-framed mountain chalet with valley views, a fireplace lounge, and easy access to Solang drives and old Manali cafes.",
      image: {
         filename: "wanderlust/india/manali-snowline-chalet",
         url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      },
      price: 11200,
      location: "Manali, Himachal Pradesh",
      country: "India",
      category: "Mountain",
      maxGuests: 6,
   },
   {
      title: "Stargazer Cabin in Spiti",
      description:
         "A warm high-altitude stay designed for dramatic landscapes, night skies, monastery circuits, and road-trip travelers chasing the Himalayas.",
      image: {
         filename: "wanderlust/india/spiti-stargazer-cabin",
         url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      },
      price: 8900,
      location: "Kaza, Spiti Valley",
      country: "India",
      category: "Mountain",
      maxGuests: 4,
   },
   {
      title: "Monastery View Stay in Tawang",
      description:
         "A quiet ridge-top homestay with crisp air, mountain light, and quick access to Tawang's monasteries, lakes, and winding routes.",
      image: {
         filename: "wanderlust/india/tawang-monastery-view",
         url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      },
      price: 8300,
      location: "Tawang, Arunachal Pradesh",
      country: "India",
      category: "Mountain",
      maxGuests: 4,
   },
   {
      title: "Riverstone Loft in Bengaluru",
      description:
         "A polished city loft for work-travelers and weekend explorers who want a stylish base near cafes, galleries, and startup hubs.",
      image: {
         filename: "wanderlust/india/bengaluru-riverstone-loft",
         url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      },
      price: 7200,
      location: "Bengaluru, Karnataka",
      country: "India",
      category: "City",
      maxGuests: 2,
   },
   {
      title: "Art District Apartment in Mumbai",
      description:
         "A smart apartment for travelers who want local restaurants, galleries, and a fast-paced city rhythm with good design and easy access.",
      image: {
         filename: "wanderlust/india/mumbai-art-district-apartment",
         url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      },
      price: 9900,
      location: "Mumbai, Maharashtra",
      country: "India",
      category: "City",
      maxGuests: 3,
   },
   {
      title: "Skyline Residence in New Delhi",
      description:
         "A refined central-city stay built for museums, food trails, and business travel, with a calmer interior than the streets outside.",
      image: {
         filename: "wanderlust/india/delhi-skyline-residence",
         url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      },
      price: 8600,
      location: "New Delhi",
      country: "India",
      category: "City",
      maxGuests: 4,
   },
   {
      title: "Royal Courtyard Haveli in Jaipur",
      description:
         "A restored haveli layered with arches, handcrafted details, and rooftop views, perfect for heritage walks and bazaars in the Pink City.",
      image: {
         filename: "wanderlust/india/jaipur-royal-courtyard-haveli",
         url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      },
      price: 12400,
      location: "Jaipur, Rajasthan",
      country: "India",
      category: "Heritage",
      maxGuests: 5,
   },
   {
      title: "Lakeside Palace Wing in Udaipur",
      description:
         "An elegant heritage stay with courtyards, carved balconies, and dreamy access to Udaipur's palaces, boat rides, and evening lights.",
      image: {
         filename: "wanderlust/india/udaipur-lakeside-palace-wing",
         url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      },
      price: 16800,
      location: "Udaipur, Rajasthan",
      country: "India",
      category: "Heritage",
      maxGuests: 4,
   },
   {
      title: "Stone Courtyard House in Hampi",
      description:
         "A heritage-style stay that brings you close to boulder landscapes, temple routes, and sunrise cycles through one of India's most striking historic zones.",
      image: {
         filename: "wanderlust/india/hampi-stone-courtyard-house",
         url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      },
      price: 6900,
      location: "Hampi, Karnataka",
      country: "India",
      category: "Heritage",
      maxGuests: 3,
   },
   {
      title: "Dune Camp Outside Jaisalmer",
      description:
         "A high-comfort desert camp made for camel trails, golden-hour dunes, and star-filled nights away from the city rush.",
      image: {
         filename: "wanderlust/india/jaisalmer-dune-camp",
         url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      },
      price: 8400,
      location: "Jaisalmer, Rajasthan",
      country: "India",
      category: "Desert",
      maxGuests: 4,
   },
   {
      title: "White Salt Desert Bhunga",
      description:
         "A circular craft-inspired stay near the Rann, built for cultural journeys, moonlit landscapes, and wide-open quiet.",
      image: {
         filename: "wanderlust/india/rann-bhunga-stay",
         url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
      },
      price: 7900,
      location: "Dhordo, Kutch",
      country: "India",
      category: "Desert",
      maxGuests: 4,
   },
   {
      title: "Dal Lake Cedar Houseboat",
      description:
         "A classic Kashmir houseboat stay with carved wood interiors, mountain reflections, and slow mornings on the lake.",
      image: {
         filename: "wanderlust/india/dal-lake-cedar-houseboat",
         url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      },
      price: 11800,
      location: "Srinagar, Jammu and Kashmir",
      country: "India",
      category: "Lake",
      maxGuests: 4,
   },
   {
      title: "Pine Cottage Above Nainital Lake",
      description:
         "A family-friendly hillside cottage for boat rides, crisp evening air, and panoramic views across the lake basin.",
      image: {
         filename: "wanderlust/india/nainital-pine-cottage",
         url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",
      },
      price: 9100,
      location: "Nainital, Uttarakhand",
      country: "India",
      category: "Lake",
      maxGuests: 5,
   },
   {
      title: "Premium Houseboat in Alleppey",
      description:
         "A polished backwater cruise-stay with polished wood interiors, local Kerala meals, and a slower rhythm through canals and lagoons.",
      image: {
         filename: "wanderlust/india/alleppey-premium-houseboat",
         url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      },
      price: 13200,
      location: "Alleppey, Kerala",
      country: "India",
      category: "Backwater",
      maxGuests: 4,
   },
   {
      title: "Canalfront Retreat in Kumarakom",
      description:
         "A quiet waterfront villa surrounded by coconut groves, ideal for birdwatching, canoe rides, and slower Kerala itineraries.",
      image: {
         filename: "wanderlust/india/kumarakom-canalfront-retreat",
         url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
      },
      price: 10400,
      location: "Kumarakom, Kerala",
      country: "India",
      category: "Backwater",
      maxGuests: 5,
   },
   {
      title: "Ghat View Residence in Varanasi",
      description:
         "A soulful old-city stay positioned for sunrise boat rides, temple visits, and a deeper connection to the city's layered ritual life.",
      image: {
         filename: "wanderlust/india/varanasi-ghat-view-residence",
         url: "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=1200&q=80",
      },
      price: 6800,
      location: "Varanasi, Uttar Pradesh",
      country: "India",
      category: "Spiritual",
      maxGuests: 3,
   },
   {
      title: "Yoga Garden Retreat in Rishikesh",
      description:
         "A riverside spiritual stay built for yoga residencies, café-hopping, Ganga walks, and shorter wellness resets.",
      image: {
         filename: "wanderlust/india/rishikesh-yoga-garden-retreat",
         url: "https://images.unsplash.com/photo-1500534314209-a26db0f5b2b6?auto=format&fit=crop&w=1200&q=80",
      },
      price: 7300,
      location: "Rishikesh, Uttarakhand",
      country: "India",
      category: "Spiritual",
      maxGuests: 2,
   },
   {
      title: "Safari Lodge in Ranthambore",
      description:
         "A warm safari base for wildlife drives, slow evenings, and travelers hoping to spot tigers without sacrificing comfort.",
      image: {
         filename: "wanderlust/india/ranthambore-safari-lodge",
         url: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
      },
      price: 15400,
      location: "Ranthambore, Rajasthan",
      country: "India",
      category: "Wildlife",
      maxGuests: 4,
   },
   {
      title: "Kabini Forest Edge Lodge",
      description:
         "An immersive wildlife stay with jungle textures, quiet luxury, and easy access to boat safaris and forest drives.",
      image: {
         filename: "wanderlust/india/kabini-forest-edge-lodge",
         url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      },
      price: 17600,
      location: "Kabini, Karnataka",
      country: "India",
      category: "Wildlife",
      maxGuests: 4,
   },
   {
      title: "Tea Estate Bungalow in Darjeeling",
      description:
         "A misty hill-station escape perched above tea gardens, built for long views, cool weather, and heritage mountain charm.",
      image: {
         filename: "wanderlust/india/darjeeling-tea-estate-bungalow",
         url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      },
      price: 9700,
      location: "Darjeeling, West Bengal",
      country: "India",
      category: "Hill Station",
      maxGuests: 4,
   },
   {
      title: "Colonial Hideaway in Ooty",
      description:
         "A restored bungalow with garden lawns and old-world details, ideal for slower family trips and cool-season getaways.",
      image: {
         filename: "wanderlust/india/ooty-colonial-hideaway",
         url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      },
      price: 8900,
      location: "Ooty, Tamil Nadu",
      country: "India",
      category: "Hill Station",
      maxGuests: 5,
   },
   {
      title: "Mistline Retreat in Munnar",
      description:
         "A green hill-station stay with rolling tea views, crisp air, and generous spaces designed for a calm weekend in the clouds.",
      image: {
         filename: "wanderlust/india/munnar-mistline-retreat",
         url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
      },
      price: 10100,
      location: "Munnar, Kerala",
      country: "India",
      category: "Hill Station",
      maxGuests: 4,
   },
];

module.exports = { data: sampleListings };
