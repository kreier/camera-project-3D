/**
 * objects365.js - Objects365 Class Directory and Guidance Presets
 * Part of Camera-Project-3D (Version v0.1.1)
 */

export const OBJECTS365_CLASSES = [
  "Person", "Sneakers", "Chair", "Other Shoes", "Hat", "Car", "Lamp", "Glasses", "Bottle", "Desk",
  "Cup", "Street Lights", "Cabinet/shelf", "Handbag/Satchel", "Bracelet", "Plate", "Picture/Frame",
  "Helmet", "Book", "Gloves", "Storage box", "Boat", "Leather Shoes", "Flower", "Bench", "Potted Plant",
  "Bowl/Basin", "Flag", "Pillow", "Boots", "Vase", "Microphone", "Necklace", "Ring", "SUV", "Wine Glass",
  "Belt", "Monitor/TV", "Backpack", "Umbrella", "Traffic Light", "Speaker", "Watch", "Tie",
  "Trash bin Can", "Slippers", "Bicycle", "Stool", "Barrel/bucket", "Van", "Couch", "Sandals", "Basket",
  "Drum", "Pen/Pencil", "Bus", "Wild Bird", "High Heels", "Motorcycle", "Guitar", "Carpet", "Cell Phone",
  "Bread", "Camera", "Canned", "Truck", "Traffic cone", "Cymbal", "Lifesaver", "Towel", "Stuffed Toy",
  "Candle", "Sailboat", "Laptop", "Awning", "Bed", "Faucet", "Tent", "Horse", "Mirror", "Power outlet",
  "Sink", "Apple", "Air Conditioner", "Knife", "Hockey Stick", "Paddle", "Pickup Truck", "Fork",
  "Traffic sign", "Balloon", "Tripod", "Dog", "Spoon", "Clock", "Pot", "Cow", "Cake", "Headphone",
  "Sports Car", "Keyboard", "Skateboard", "Stairs", "French Fries", "Water Bottle", "Key", "Scarf",
  "Barret", "Steering Wheel", "Computer Mouse", "Fan", "Hanger", "Remote", "Tablet", "Microwave Oven",
  "Pencil Case", "Telephone", "Airplane", "Pillow Case", "Door", "Curtain", "Paper Towel", "Wallet",
  "Casserole", "Luggage", "Washing Machine", "Window", "Crib", "Ladder", "Electric Fan", "Bathtub",
  "Fire Extinguisher", "Toothbrush", "Soap", "Hair Dryer", "Mirror Cabinet", "Broom", "Mop", "Iron",
  "Wardrobe", "Heater", "Toaster", "Blender", "Kettle", "Rice Cooker", "Teapot", "Thermometer",
  "Coffee Machine", "Cutting Board", "Peeler", "Can Opener", "Whisk", "Grater", "Ladle", "Colander",
  "Spatula", "Tongs", "Apron", "Oven Glove", "Paper Bag", "Shopping Cart", "Suitcase", "Document",
  "Notebook", "Envelope", "Stapler", "Scissors", "Tape Measure", "Flashlight", "Lighter", "Matchbox",
  "Cigarette", "Ashtray", "Vending Machine", "ATM", "Post Box", "Hydrant", "Manhole Cover", "Barrier",
  "Bollard", "Signboard", "Billboard", "Traffic Camera", "Surveillance Camera", "Solar Panel",
  "Antenna", "Satellite Dish", "Wind Turbine", "Power Pole", "Transformer", "Street Vendor Cart",
  "Food Truck", "Forklift", "Excavator", "Bulldozer", "Crane", "Tractor", "Trailer", "Golf Cart",
  "Hoverboard", "Segway", "Roller Skates", "Scooter", "Wheelchair", "Crutches", "Walking Stick",
  "Stretcher", "First Aid Kit", "Bandage", "Syringe", "Medicine Bottle", "Thermometer Medical",
  "Stethoscope", "Blood Pressure Monitor", "Face Mask", "Safety Glasses", "Ear Protectors", "Hard Hat",
  "High Visibility Vest", "Life Jacket", "Safety Harness", "Parachute", "Tent Camping", "Sleeping Bag",
  "Campfire", "Barbecue Grill", "Cooler Box", "Thermos", "Binoculars", "Telescope", "Compass",
  "Magnifying Glass", "Globe", "Map", "Chessboard", "Playing Cards", "Dice", "Puzzle", "Board Game",
  "Toy Car", "Doll", "Action Figure", "Robot Toy", "Lego", "Yo-yo", "Frisbee Disc", "Kite Toy",
  "Water Gun", "Dartboard", "Bowling Pin", "Billiards Table", "Table Tennis Table", "Foosball Table",
  "Basketball Hoop", "Football Goal", "Tennis Net", "Volleyball Net", "Baseball Glove Pro", "Boxing Gloves",
  "Punching Bag", "Dumbbell", "Barbell", "Treadmill", "Exercise Bike", "Yoga Mat", "Jump Rope",
  "Whistle", "Stopwatch", "Scoreboard", "Trophy", "Medal", "Ribbon", "Podium", "Microphone Stand",
  "Speaker Stand", "Audio Mixer", "Amplifier", "Synthesizer", "Piano", "Violin", "Cello", "Flute",
  "Saxophone", "Trumpet", "Trombone", "Clarinet", "Harmonica", "Accordion", "Tambourine", "Xylophone",
  "Easel", "Palette", "Paintbrush", "Canvas Frame", "Sculpture", "Statue", "Fountain", "Monument",
  "Clock Tower", "Lighthouse", "Windmill", "Castle", "Bridge", "Tunnel", "Pier", "Dock", "Anchor",
  "Buoy", "Submarine", "Helicopter", "Drone", "Hot Air Balloon", "Glider", "Spacecraft", "Rocket",
  "Train Engine", "Train Carriage", "Tram", "Cable Car", "Ferry", "Cruise Ship", "Speedboat",
  "Canoe", "Kayak", "Raft", "Jet Ski", "Surfboard Pro", "Paddleboard", "Life Raft"
];

export const OBJECTS365_PRESETS = {
  focus15: {
    id: 'focus15',
    name: '🌟 Daily Focus 15',
    description: 'Person, Cell Phone, Laptop, Chair, Glasses, Book, Sneakers, Desk, Cabinet, Cup, Bottle, Door, Stairs, Handbag, Key',
    classes: [
      'Person', 'Cell Phone', 'Laptop', 'Chair', 'Glasses', 'Book', 'Sneakers', 'Desk',
      'Cabinet/shelf', 'Cup', 'Bottle', 'Door', 'Stairs', 'Handbag/Satchel', 'Key'
    ]
  },
  assistiveO365: {
    id: 'assistiveO365',
    name: '🚶 Assistive Navigation & Hazards',
    description: 'Stairs, Walking Stick, Street Lights, Traffic sign, Traffic cone, Door, Slippers, Chair, Bench, Car, Bus, Dog, Trash bin Can, Barrier',
    classes: [
      'Person', 'Stairs', 'Walking Stick', 'Door', 'Traffic sign', 'Traffic cone', 'Barrier',
      'Street Lights', 'Chair', 'Bench', 'Car', 'Bus', 'Dog', 'Trash bin Can', 'Wheelchair', 'Bollard'
    ]
  },
  household: {
    id: 'household',
    name: '🏠 Indoor & Personal Belongings',
    description: 'Keys, Glasses, Smartphone, Remote, Cup, Bottle, Mirror, Power outlet, Faucet, Air Conditioner, Slippers, Clock',
    classes: [
      'Cell Phone', 'Key', 'Glasses', 'Book', 'Cup', 'Plate', 'Bottle', 'Storage box',
      'Pillow', 'Mirror', 'Power outlet', 'Sink', 'Faucet', 'Air Conditioner', 'Remote', 'Clock', 'Slippers'
    ]
  },
  all: {
    id: 'all',
    name: '🌐 All 365 Classes',
    description: 'Full vocabulary covering 365 daily object categories',
    classes: [...OBJECTS365_CLASSES]
  }
};
