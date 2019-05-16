const uptradeAccountOptions = [
  {
    value: 'SUPPLIER',
    text: 'Supplier'
  },
  {
    value: 'BUYER',
    text: 'Buyer'
  }
]

const countriesOptions = [
  { text: 'China', value: 'China' },
  { text: 'France', value: 'France' },
  { text: 'Hong Kong', value: 'Hong Kong' },
  { text: 'Canada', value: 'Canada' }
]
const portsOptions = [
  { text: 'Guangzhou', value: 'Guangzhou' },
  { text: 'Yantian', value: 'Yantian' }
]

const yearsOptions = [
  { text: '2015', value: '2015' },
  { text: '2016', value: '2016' },
  { text: '2017', value: '2017' },
  { text: '2018', value: '2018' }
]
const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false }
]
const typesOptions = [
  { text: 'MANUFACTURER', value: 'MANUFACTURER' },
  { text: 'TRADER', value: 'TRADER' },
  { text: 'AGENCY', value: 'AGENCY' },
  { text: 'AGENT', value: 'AGENT' },
  { text: 'IMPORTER', value: 'IMPORTER' }
]
const ownershipOptions = [
  { text: 'PRIVATE', value: 'PRIVATE' },
  { text: 'JOIN_VENTURE', value: 'JOIN_VENTURE' },
  { text: 'STATE', value: 'STATE' },
  { text: 'OTHER', value: 'OTHER' }
]
const marketsOptions = [
  { text: 'China', value: 'China' },
  { text: 'France', value: 'France' },
  { text: 'Hong Kong', value: 'Hong Kong' },
  { text: 'Canada', value: 'Canada' },
  { text: 'Germany', value: 'Germany' }
]

const supplierStyles = [
  {
    value: 'SUPPLIER',
    text: 'Supplier'
  },
  {
    value: 'SUB_CONTRACTOR',
    text: 'Sub Contractor'
  },
  {
    value: 'SERVICE_PROVIDER',
    text: 'Service Provider'
  },
  {
    value: 'OTHER',
    text: 'Other'
  }
]
const department = [
  {
    value: 'Sales',
    text: 'Sales'
  },
  {
    value: 'marketing',
    text: 'Marketing'
  },
  {
    value: 'QC',
    text: 'Quality Control'
  },
  {
    value: 'Merchandising',
    text: 'Merchandising'
  }
]

const managers = [
  {
    value: 'jd',
    text: 'John Doe'
  },
  {
    value: 'lf',
    text: 'Lara Fabian'
  },
  {
    value: 'Max',
    text: 'Max'
  }
]

const statusOptions = [
  { text: 'Active', value: 'ACTIVE' },
  { text: 'Inactive', value: 'INACTIVE' }
]

const registrationOptions = [
  { text: 'Manual', value: 'SUPER_ADMIN_CREATE' },
  { text: 'Sign up', value: 'SIGNUP' }
]

const userAccountType = [
  {
    value: 'INTERN',
    text: 'INTERN'
  },
  {
    value: 'EXECUTIVE',
    text: 'EXECUTIVE'
  },
  {
    value: 'MANAGER',
    text: 'MANAGER'
  },
  {
    value: 'DIRECTOR',
    text: 'DIRECTOR'
  }
]

const adminAccountType = [
  {
    value: 'ADMIN',
    text: 'ADMIN'
  }
]
const categoryData = [
  {
    category: 'Agriculture',
    subCategory: [
      'Agricultural Growing Media',
      'Agricultural Waste',
      'Animal Products',
      'Beans',
      'Cocoa Beans',
      'Coffee Beans',
      'Farm Machinery & Equipment',
      'Feed',
      'Fresh Seafood',
      'Fruit',
      'Grain',
      'Herbal Cigars & Cigarettes',
      'Mushrooms & Truffles',
      'Nuts & Kernels',
      'Organic Produce',
      'Ornamental Plants',
      'Other Agriculture Products',
      'Plant & Animal Oil',
      'Plant Seeds & Bulbs',
      'Timber Raw Materials',
      'Vanilla Beans',
      'Vegetables'
    ]
  },
  {
    category: 'Apparel',
    subCategory: [
      `Apparel Design Services`,
      `Apparel Processing Services`,
      `Apparel Stock`,
      `Boy's Clothing`,
      `Children's Clothing`,
      `Coats`,
      `Costumes`,
      `Dresses`,
      `Ethnic Clothing`,
      `Garment Accessories`,
      `Girls' Clothing`,
      `Hoodies & Sweatshirts`,
      `Hosiery`,
      `Infant & Toddlers Clothing`,
      `Jackets`,
      `Jeans`,
      `Ladies' Blouses & Tops`,
      `Mannequins`,
      `Maternity Clothing`,
      `Men's Clothing`,
      `Men's Shirts`,
      `Organic Cotton Clothing`,
      `Other Apparel`,
      `Pants & Trousers`,
      `Plus Size Clothing`,
      `Sewing Supplies`,
      `Shorts`,
      `Skirts`,
      `Sleepwear`,
      `Sportswear`,
      `Stage & Dance Wear`,
      `Suits & Tuxedo`,
      `Sweaters`,
      `T-Shirts`,
      `Tag Guns`,
      `Tank Tops`,
      `Underwear`,
      `Uniforms`,
      `Used Clothes`,
      `Vests & Waistcoats`,
      `Wedding Apparel & Accessories`,
      `Women's Clothing`,
      `Workwear`
    ]
  },
  {
    category: `Automobiles & Motorcycles`,
    subCategory: [
      'Auto Steering System',
      'Crank Mechanism',
      'Auto Chassis Parts',
      'Motorcycles',
      'Cooling System',
      'Axles',
      'Suspension System',
      'Air Intakes',
      'Auto Engine',
      'Tricycles',
      'Auto Clutch',
      'Car Care & Cleaning',
      'Fuel System',
      'Transmission',
      'ATV Parts',
      'ATV',
      'Valve Train',
      'Auto Ignition System',
      'Universal Parts',
      'Vehicle Equipment',
      'Auto Electrical System',
      'Lubrication System',
      'Other Auto Parts',
      'Motorcycle Accessories',
      'Vehicle Tools',
      'Automobiles',
      'UTV',
      'Motorcycle Parts',
      'Interior Accessories',
      'Exhaust System',
      'Body Parts',
      'Auto Electronics',
      'Exterior Accessories',
      'Brake System',
      '50cc Dirt Bikes'
    ]
  },
  {
    category: 'Beauty & Personal Care',
    subCategory: [
      'Baby Care',
      'Bath Supplies',
      'Beauty Equipment',
      'Body Art',
      'Breast Care',
      'Feminine Hygiene',
      'Fragrance & Deodorant',
      'Hair Care',
      'Hair Extensions & Wigs',
      'Hair Salon Equipment',
      'Makeup',
      'Makeup Tools',
      'Men Care',
      'Nail Supplies',
      'Oral Hygiene',
      'Other Beauty & Personal Care Products',
      'Sanitary Paper',
      'Shaving & Hair Removal',
      'Skin Care',
      'Skin Care Tool',
      'Spa Supplies',
      'Weight Loss'
    ]
  },
  {
    category: 'Business Services',
    subCategory: [
      'Advertising',
      'Agency Services',
      'Assurance Services',
      'Auction',
      'Brokerage, Intermediary Service',
      'Business Travel Services',
      'Certification, Inspection & Credit Management',
      'Computer & Information Technology Services',
      'Construction Services',
      'Consulting',
      'Corporate Register & Transfer',
      'Design Services',
      'Education & Training',
      'Internet Service',
      'Labour & Employment',
      'Law Services',
      'Leasing Services',
      'Logistics Services',
      'Other Business Services',
      'Passport & Visa',
      'Processing Services',
      'Project Cooperation',
      'Public Relations Services',
      'Repairs & Maintenance',
      'Research & Development Services',
      'Royalties & License Services',
      'Supply Chain Management',
      'Telecommunication Services',
      'Trade Show Services',
      'Translation Services'
    ]
  },
  {
    category: 'Chemicals',
    subCategory: [
      'Adhesives & Sealants',
      'Admixture&Additives',
      'Agrochemicals',
      'Basic Organic Chemicals',
      'Biological Chemical Products',
      'Catalysts & Chemical Auxiliary Agents',
      'Chemical Reagent Products',
      'Chemical Waste',
      'Custom Chemical Services',
      'Daily Chemical Raw Materials',
      'Flavour & Fragrance',
      'Inorganic Chemicals',
      'Non-Explosive Demolition Agents',
      'Organic Intermediates',
      'Other Chemicals',
      'Paints & Coatings',
      'Pharmaceuticals',
      'Pigment & Dyestuff',
      'Polymer',
      'Surface Treatment Chemicals'
    ]
  },
  {
    category: 'Computer Hardware & Software',
    subCategory: [
      'All-In-One PC',
      'Barebone System',
      'Blank Media',
      'Computer Cables & Connectors',
      'Computer Cases & Towers',
      'Computer Cleaners',
      'Desktops',
      'Fans & Cooling',
      'Firewall & VPN',
      'Floppy Drives',
      'Graphics Cards',
      'HDD Enclosure',
      'Hard Drives',
      'Industrial Computer & Accessories',
      'KVM Switches',
      'Keyboard Covers',
      'Laptop Accessories',
      'Laptop Cooling Pads',
      'Laptops',
      'Memory',
      'Modems',
      'Monitors',
      'Motherboards',
      'Mouse & Keyboards',
      'Mouse Pads',
      'Netbooks & UMPC',
      'Network Cabinets',
      'Network Cards',
      'Network Hubs',
      'Network Switches',
      'Networking Storage',
      'Optical Drives',
      'Other Computer Accessories',
      'Other Computer Parts',
      'Other Computer Products',
      'Other Drive & Storage Devices',
      'Other Networking Devices',
      'PC Stations',
      'PDAs',
      'Power Supply Units',
      'Printers',
      'Processors',
      'Routers',
      'Scanners',
      'Servers',
      'Software',
      'Sound Cards',
      'Tablet PC',
      'Tablet PC Stands',
      'Tablet Stylus Pen',
      'USB Flash Drives',
      'USB Gadgets',
      'USB Hubs',
      'Used Computers & Accessories',
      'Webcams',
      'Wireless Networking',
      'Workstations'
    ]
  },
  {
    category: 'Construction & Real Estate',
    subCategory: [
      'Aluminum Composite Panels',
      'Balustrades & Handrails',
      'Bathroom',
      'Boards',
      'Building Glass',
      'Ceilings',
      'Corner Guards',
      'Countertops,Vanity Tops & Table Tops',
      'Curtain Walls & Accessories',
      'Decorative Films',
      'Door & Window Accessories',
      'Doors & Windows',
      'Earthwork Products',
      'Elevators & Elevator Parts',
      'Escalators & Escalator Parts',
      'Faucets, Mixers & Taps',
      'Fiberglass Wall Meshes',
      'Fireplaces,Stoves',
      'Fireproofing Materials',
      'Floor Heating Systems & Parts',
      'Flooring & Accessories',
      'Formwork',
      'Gates',
      'HVAC Systems & Parts',
      'Heat Insulation Materials',
      'Kitchen',
      'Ladders & Scaffoldings',
      'Landscaping Stone',
      'Masonry Materials',
      'Metal Building Materials',
      'Mosaics',
      'Mouldings',
      'Multifunctional Materials',
      'Other Construction & Real Estate',
      'Plastic Building Materials',
      'Quarry Stone & Slabs',
      'Real Estate',
      'Soundproofing Materials',
      'Stairs & Stair Parts',
      'Stone Carvings and Sculptures',
      'Sunrooms & Glass Houses',
      'Tiles & Accessories',
      'Timber',
      'Tombstones and Monuments',
      'Wallpapers/Wall Coating',
      'Waterproofing Materials'
    ]
  },
  {
    category: 'Consumer Electronics',
    subCategory: [
      'Mobile Phone & Accessories',
      'Blockchain Miners',
      'Accessories & Parts',
      'Electronic Cigarettes',
      'Camera, Photo & Accessories',
      'Electronic Publications',
      'Smart Electronics',
      'Home Audio, Video & Accessories',
      'Other Consumer Electronics',
      'Portable Audio, Video & Accessories',
      'Video Game & Accessories',
      'Wearable Gadgets'
    ]
  },
  {
    category: 'Electrical Equipment & Supplies',
    subCategory: [
      'Electrical Equipment & Supplies',
      'SearchÂ ProductsÂ in ourÂ Electrical Equipment & SuppliesÂ category',
      'Batteries',
      'Circuit Breakers',
      'Connectors & Terminals',
      'Contactors',
      'Electrical Plugs & Sockets',
      'Electronic & Instrument Enclosures',
      'Fuse Components',
      'Fuses',
      'Generators',
      'Other Electrical Equipment',
      'Power Accessories',
      'Power Distribution Equipment',
      'Power Supplies',
      'Professional Audio, Video & Lighting',
      'Relays',
      'Switches',
      'Transformers',
      'Wires, Cables & Cable Assemblies',
      'Wiring Accessories'
    ]
  },
  {
    category: 'Electronic Components & Supplies',
    subCategory: [
      'Active Components',
      'EL Products',
      'Electronic Accessories & Supplies',
      'Electronic Data Systems',
      'Electronic Signs',
      'Electronics Production Machinery',
      'Electronics Stocks',
      'Optoelectronic Displays',
      'Other Electronic Components',
      'Passive Components'
    ]
  },
  {
    category: 'Fashion Accessories',
    subCategory: [
      'Belt Accessories',
      'Belts',
      'Fashion Accessories Design Services',
      'Fashion Accessories Processing Services',
      'Fashion Accessories Stock',
      'Gloves & Mittens',
      'Headwear',
      'Neckwear',
      'Scarf, Hat & Glove Sets'
    ]
  },
  {
    category: 'Food & Beverage',
    subCategory: [
      'Alcoholic Beverage',
      'Baby Food',
      'Baked Goods',
      'Bean Products',
      'Canned Food',
      'Coffee',
      'Confectionery',
      'Dairy',
      'Drinking Water',
      'Egg & Egg Products',
      'Food Ingredients',
      'Fruit Products',
      'Grain Products',
      'Honey Products',
      'Instant Food',
      'Meat & Poultry',
      'Other Food & Beverage',
      'Seafood',
      'Seasonings & Condiments',
      'Slimming Food',
      'Snack Food',
      'Soft Drinks',
      'Tea',
      'Vegetable Products'
    ]
  },
  {
    category: 'Furniture',
    subCategory: [
      'Antique Furniture',
      'Baby Furniture',
      'Bamboo Furniture',
      'Children Furniture',
      'Commercial Furniture',
      'Folding Furniture',
      'Furniture Accessories',
      'Furniture Hardware',
      'Furniture Parts',
      'Glass Furniture',
      'Home Furniture',
      'Inflatable Furniture',
      'Metal Furniture',
      'Other Furniture',
      'Outdoor Furniture',
      'Plastic Furniture',
      'Rattan / Wicker Furniture',
      'Wood Furniture'
    ]
  },
  {
    category: 'Gifts & Crafts',
    subCategory: [
      'Antique Imitation Crafts',
      'Art & Collectible',
      'Artificial Crafts',
      'Arts & Crafts Stocks',
      'Bamboo Crafts',
      'Brocade Crafts',
      'Carving Crafts',
      'Clay Crafts',
      'Cross Stitch',
      'Crystal Crafts',
      'Embroidery Crafts',
      'Feng Shui Crafts',
      'Festive & Party Supplies',
      'Flags, Banners & Accessories',
      'Folk Crafts',
      'Gift Sets',
      'Glass Crafts',
      'Holiday Gifts',
      'Home Decoration',
      'Key Chains',
      'Knitting & Crocheting',
      'Lacquerware',
      'Lanyard',
      'Leather Crafts',
      'Metal Crafts',
      'Money Boxes',
      'Music Boxes',
      'Natural Crafts',
      'Nautical Crafts',
      'Other Gifts & Crafts',
      'Paper Crafts',
      'Plastic Crafts',
      'Pottery & Enamel',
      'Religious Crafts',
      'Resin Crafts',
      'Sculptures',
      'Semi-Precious Stone Crafts',
      'Souvenirs',
      'Stickers',
      'Stone Crafts',
      'Textile & Fabric Crafts',
      'Wedding Decorations & Gifts',
      'Wicker Crafts',
      'Wood Crafts'
    ]
  },
  {
    category: 'Hardware',
    subCategory: [
      'Fasteners',
      'Hooks',
      'Abrasive Tools',
      'Chains',
      'Springs',
      'Clamps',
      'Shackle',
      'Swivels',
      'Retaining ring',
      'Snaps',
      'Brackets',
      'Turnbuckle',
      'Thimble',
      'Hardware Stock',
      'Mould Design & Processing Services',
      'Abrasives',
      'Other Hardware',
      'Used Hardware'
    ]
  },
  {
    category: 'Health & Medical',
    subCategory: [
      'Animal & Veterinary',
      'Extract',
      'Health Care Products',
      'Herbal Medicines',
      'Medical Devices',
      'Medicines'
    ]
  },
  {
    category: 'Home & Garden',
    subCategory: [
      'Bakeware',
      'Barware',
      'Bathroom Products',
      'Cooking Tools',
      'Cookware',
      'Garden Supplies',
      'Home Decor',
      'Home Storage & Organization',
      'Household Chemicals',
      'Household Cleaning Tools & Accessories',
      'Household Sundries',
      'Kitchen Knives & Accessories',
      'Laundry Products',
      'Pet Products',
      'Tableware'
    ]
  },
  {
    category: 'Home Appliances',
    subCategory: [
      'Air Conditioning Appliances',
      'Cleaning Appliances',
      'Hand Dryers',
      'Home Appliance Parts',
      'Home Appliances Stocks',
      'Home Heaters',
      'Kitchen Appliances',
      'Laundry Appliances',
      'Other Home Appliances',
      'Refrigerators & Freezers',
      'Water Heaters',
      'Water Treatment Appliances',
      'Wet Towel Dispensers'
    ]
  },
  {
    category: 'Lights & Lighting',
    subCategory: [
      'Emergency Lighting',
      'Holiday Lighting',
      'Indoor Lighting',
      'LED Lighting',
      'Lighting Accessories',
      'Lighting Bulbs & Tubes',
      'Other Lights & Lighting Products',
      'Outdoor Lighting',
      'Professional Lighting'
    ]
  },
  {
    category: 'Luggage, Bags & Cases',
    subCategory: [
      'Bag & Luggage Making Materials',
      'Bag Parts & Accessories',
      'Business Bags & Cases',
      'Digital Gear & Camera Bags',
      'Handbags & Messenger Bags',
      'Luggage & Travel Bags',
      'Luggage Cart',
      'Other Luggage, Bags & Cases',
      'Special Purpose Bags & Cases',
      'Sports & Leisure Bags',
      'Wallets & Holders'
    ]
  },
  {
    category: 'Machinery',
    subCategory: [
      'Agriculture Machinery & Equipment',
      'Apparel & Textile Machinery',
      'Building Material Machinery',
      'Chemical Machinery & Equipment',
      'Electronic Products Machinery',
      'Energy & Mineral Equipment',
      'Engineering & Construction Machinery',
      'Food & Beverage Machinery',
      'General Industrial Equipment',
      'Home Product Making Machinery',
      'Industry Laser Equipment',
      'Machine Tool Equipment',
      'Metal & Metallurgy Machinery',
      'Other Machinery & Industry Equipment',
      'Packaging Machine',
      'Paper Production Machinery',
      'Pharmaceutical Machinery',
      'Plastic & Rubber Machinery',
      'Printing Machine',
      'Refrigeration & Heat Exchange Equipment',
      'Used Machinery & Equipment',
      'Woodworking Machinery'
    ]
  },
  {
    category: 'Measurement & Analysis Instruments',
    subCategory: [
      'Analyzers',
      'Counters',
      'Electrical Instruments',
      'Electronic Measuring Instruments',
      'Flow Measuring Instruments',
      'Instrument Parts & Accessories',
      'Lab Supplies',
      'Level Measuring Instruments',
      'Measuring & Analysing Instrument Design Services',
      'Measuring & Analysing Instrument Processing Services',
      'Measuring & Analysing Instrument Stocks',
      'Measuring & Gauging Tools',
      'Optical Instruments',
      'Other Measuring & Analysing Instruments',
      'Physical Measuring Instruments',
      'Pressure Measuring Instruments',
      'Temperature Instruments',
      'Testing Equipment',
      'Timers',
      'Used Measuring & Analysing Instruments',
      'Weighing Scales'
    ]
  },
  {
    category: 'Mechanical Parts & Fabrication Services',
    subCategory: [
      'Ball Valves',
      'Bearing Accessory',
      'Bearings',
      'Brass Valves',
      'Butterfly Valves',
      'Ceramic Valves',
      'Check Valves',
      'Custom Fabrication Services',
      'Diaphragm Valves',
      'Filter Supplies',
      'Flanges',
      'Gaskets',
      'Gate Valves',
      'General Mechanical Components Design Services',
      'General Mechanical Components Stock',
      'Industrial Blades & Knives',
      'Industrial Brake',
      'Linear Motion',
      'Machine Tools Accessory',
      'Manual Valves',
      'Motor Parts',
      'Motors',
      'Moulds',
      'Needle Valves',
      'Other General Mechanical Components',
      'Other Mechanical Parts',
      'Pipe Fittings',
      'Pneumatic & Hydraulic',
      'Power Transmission',
      'Pumps & Parts',
      'Seals',
      'Shafts',
      'Solenoid Valves',
      'Used General Mechanical Components',
      'Vacuum Valves',
      'Valve Parts',
      'Valves',
      'Welding & Soldering Supplies'
    ]
  },
  {
    category: 'Office & School Supplies',
    subCategory: [
      'Art Supplies',
      'Badge Holder & Accessories',
      'Board',
      'Board Eraser',
      'Book Cover',
      'Books',
      'Calculator',
      'Calendar',
      'Clipboard',
      'Correction Supplies',
      'Desk Organizer',
      'Drafting Supplies',
      'Easels',
      'Educational Supplies',
      'Filing Products',
      'Letter Pad / Paper',
      'Magazines',
      'Map',
      'Notebooks & Writing Pads',
      'Office Adhesives & Tapes',
      'Office Binding Supplies',
      'Office Cutting Supplies',
      'Office Equipment',
      'Office Paper',
      'Other Office & School Supplies',
      'Paper Envelopes',
      'Pencil Cases & Bags',
      'Pencil Sharpeners',
      'Printer Supplies',
      'Stamps',
      'Stationery Set',
      'Stencils',
      'Writing Accessories',
      'Writing Instruments',
      'Yellow Pages'
    ]
  },
  {
    category: 'Packaging & Printing',
    subCategory: [
      'Adhesive Tape',
      'Agricultural Packaging',
      'Aluminum Foil',
      'Apparel Packaging',
      'Blister Cards',
      'Bottles',
      'Cans',
      'Chemical Packaging',
      'Composite Packaging Materials',
      'Cosmetics Packaging',
      'Electronics Packaging',
      'Food Packaging',
      'Gift Packaging',
      'Handles',
      'Hot Stamping Foil',
      'Jars',
      'Lids, Bottle Caps, Closures',
      'Media Packaging',
      'Metallized Film',
      'Other Packaging Applications',
      'Other Packaging Materials',
      'Packaging Auxiliary Materials',
      'Packaging Bags',
      'Packaging Boxes',
      'Packaging Labels',
      'Packaging Product Stocks',
      'Packaging Rope',
      'Packaging Trays',
      'Packaging Tubes',
      'Paper & Paperboard',
      'Paper Packaging',
      'Pharmaceutical Packaging',
      'Plastic Film',
      'Plastic Packaging',
      'Printing Materials',
      'Printing Services',
      'Protective Packaging',
      'Pulp',
      'Shrink Film',
      'Strapping',
      'Stretch Film',
      'Tobacco Packaging',
      'Transport Packaging'
    ]
  },
  {
    category: 'Security & Protection',
    subCategory: [
      'Access Control Systems & Products',
      'Alarm',
      'CCTV Products',
      'Firefighting Supplies',
      'Key',
      'Lock Parts',
      'Locks',
      'Locksmith Supplies',
      'Other Security & Protection Products',
      'Police & Military Supplies',
      'Roadway Safety',
      'Safes',
      'Security Services',
      'Self Defense Supplies',
      'Water Safety Products',
      'Workplace Safety Supplies'
    ]
  },
  {
    category: 'Service Equipment',
    subCategory: [
      'Advertising Equipment',
      'Cargo & Storage Equipment',
      'Commercial Laundry Equipment',
      'Financial Equipment',
      'Funeral Supplies',
      'Other Service Equipment',
      'Restaurant & Hotel Supplies',
      'Store & Supermarket Supplies',
      'Trade Show Equipment',
      'Vending Machines',
      'Wedding Supplies'
    ]
  },
  {
    category: 'Shoes & Accessories',
    subCategory: [
      `Baby Shoes`,
      `Boots`,
      `Casual Shoes`,
      `Children's Shoes`,
      `Clogs`,
      `Dance Shoes`,
      `Dress Shoes`,
      `Genuine Leather Shoes`,
      `Men's Shoes`,
      `Other Shoes`,
      `Sandals`,
      `Shoe Materials`,
      `Shoe Parts & Accessories`,
      `Shoe Repairing Equipment`,
      `Shoes Design Services`,
      `Shoes Processing Services`,
      `Shoes Stock`,
      `Slippers`,
      `Special Purpose Shoes`,
      `Sports Shoes`,
      `Used Shoes`,
      `Women's Shoes`
    ]
  },
  {
    category: 'Sports & Entertainment',
    subCategory: [
      'Amusement Park',
      'Artificial Grass & Sports Flooring',
      'Fitness & Body Building',
      'Gambling',
      'Golf',
      'Indoor Sports',
      'Musical Instruments',
      'Other Sports & Entertainment Products',
      'Outdoor Sports',
      'Sports Gloves',
      'Sports Safety',
      'Sports Souvenirs',
      'Team Sports',
      'Tennis',
      'Water Sports',
      'Winter Sports'
    ]
  },
  {
    category: 'Telecommunications',
    subCategory: [
      'Antennas for Communications',
      'Communication Equipment',
      'Telephones & Accessories'
    ]
  },
  {
    category: 'Textiles & Leather Products',
    subCategory: [
      'Down & Feather',
      'Fabric',
      'Fiber',
      'Fur',
      'Grey Fabric',
      'Home Textile',
      'Leather',
      'Leather Product',
      'Other Textiles & Leather Products',
      'Textile Accessories',
      'Textile Processing',
      'Textile Stock',
      'Thread',
      'Yarn'
    ]
  },
  {
    category: 'Timepieces, Jewelry, Eyewear',
    subCategory: [
      'Eyewear',
      'Jewelry',
      'Watches'
    ]
  },
  {
    category: 'Tools',
    subCategory: [
      'Construction Tools',
      'Garden Tools',
      'Hand Tools',
      'Lifting Tools',
      'Material Handling Tools',
      'Other Tools',
      'Power Tool Accessories',
      'Power Tools',
      'Thread Tools',
      'Tool Design Services',
      'Tool Parts',
      'Tool Processing Services',
      'Tool Sets',
      'Tool Stock',
      'Tools Packaging',
      'Used Tools'
    ]
  },
  {
    category: 'Toys & Hobbies',
    subCategory: [
      'Action Figure',
      'Baby Toys',
      'Balloons',
      'Candy Toys',
      'Classic Toys',
      'Dolls',
      'Educational Toys',
      'Electronic Toys',
      'Glass Marbles',
      'Inflatable Toys',
      'Light-Up Toys',
      'Noise Maker',
      'Other Toys & Hobbies',
      'Outdoor Toys & Structures',
      'Plastic Toys',
      'Pretend Play & Preschool',
      'Solar Toys',
      'Toy Accessories',
      'Toy Animal',
      'Toy Guns',
      'Toy Parts',
      'Toy Robots',
      'Toy Vehicle',
      'Wind Up Toys',
      'Wooden Toys'
    ]
  },
  {
    category: 'Transportation',
    subCategory: [
      'Aircraft',
      'Aviation Accessories',
      'Aviation Parts',
      'Bicycle',
      'Bicycle Accessories',
      'Bicycle Parts',
      'Boats & Ships',
      'Bus',
      'Bus Accessories',
      'Bus Parts',
      'Container',
      'Container Accessories',
      'Electric Bicycle',
      'Electric Bicycle Part',
      'Emergency Vehicles',
      'Golf Carts',
      'Locomotive',
      'Marine Supplies',
      'Personal Watercraft',
      'Railway Supplies',
      'Snowmobile',
      'Special Transportation',
      'Trailers',
      'Train Carriage',
      'Train Parts',
      'Truck',
      'Truck Accessories',
      'Truck Parts'
    ]
  }
]

const customerStylesOptions = [
  { text: 'Existing', value: 'EXISTING' },
  { text: 'Prospect', value: 'PROSPECT' },
  { text: 'Inactive', value: 'INACTIVE' }
]
const productionsTypesOptions = [
  { text: 'Ownership', value: 'OWNERSHIP' },
  { text: 'Joint Venture', value: 'JOINT_VENTURE' },
  { text: 'Sub Contractor', value: 'SUB_CONTRACTOR' }
]
export {
  uptradeAccountOptions, countriesOptions, portsOptions, yearsOptions, yesNoOptions, typesOptions, ownershipOptions, marketsOptions, productionsTypesOptions,
  supplierStyles, department, managers, statusOptions, registrationOptions, userAccountType, adminAccountType, categoryData, customerStylesOptions
}
