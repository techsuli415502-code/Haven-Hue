/**
 * Demo catalog data for Haven & Hue.
 *
 * IMPORTANT: All Amazon links below are simple Amazon *search* URLs used as
 * placeholders so the demo site works end-to-end. They are NOT product
 * endorsements and contain no fabricated ASINs, prices, ratings or reviews.
 * Replace them with your real affiliate URLs from the admin dashboard.
 * If you set your Associates tracking ID in Settings, the `tag` parameter is
 * appended automatically to every link that does not already have one.
 */

export const IMG = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  sortOrder: number;
}

export const seedCategories: SeedCategory[] = [
  {
    name: "Living Room Decor",
    slug: "living-room",
    description:
      "Sofa styling, throw pillows, accent furniture and everything that makes the heart of your home feel warm and welcoming.",
    image: IMG("1586023492125-27b2c045efd7", 1200),
    imageAlt: "Bright living room with a beige sofa and layered neutral cushions",
    featured: true,
    sortOrder: 1,
  },
  {
    name: "Bedroom Decor",
    slug: "bedroom",
    description:
      "Calm, cozy bedroom ideas — soft throws, layered bedding, bedside lighting and tranquil accents for better rest.",
    image: IMG("1616594039964-ae9021a400a0", 1200),
    imageAlt: "Serene bedroom with soft neutral bedding and warm lighting",
    featured: true,
    sortOrder: 2,
  },
  {
    name: "Wall Art & Prints",
    slug: "wall-art",
    description:
      "Gallery walls, botanical prints, framed art and statement pieces that give every room a finished, personal touch.",
    image: IMG("1615873968403-89e068629265", 1200),
    imageAlt: "Styled gallery wall with framed prints above a wooden console",
    featured: true,
    sortOrder: 3,
  },
  {
    name: "Plants & Planters",
    slug: "plants-planters",
    description:
      "Artificial plants that look surprisingly real, plus woven baskets and ceramic planters to display them beautifully.",
    image: IMG("1583847268964-b28dc8f51f92", 1200),
    imageAlt: "Lush indoor plants beside a bright window in a cozy corner",
    featured: true,
    sortOrder: 4,
  },
  {
    name: "Lamps & Lighting",
    slug: "lighting",
    description:
      "Table lamps, floor lamps and pendant lights that layer warm, ambient glow into every corner of your home.",
    image: IMG("1513694203232-719a280e022f", 1200),
    imageAlt: "Cozy reading corner lit by a warm table lamp",
    featured: true,
    sortOrder: 5,
  },
  {
    name: "Rugs & Carpets",
    slug: "rugs",
    description:
      "Jute, wool and washable rugs that anchor a room, add texture and make hard floors feel instantly cozier.",
    image: IMG("1522708323590-d24dbb6b0267", 1200),
    imageAlt: "Living room with a textured area rug over wooden flooring",
    featured: true,
    sortOrder: 6,
  },
  {
    name: "Decorative Mirrors",
    slug: "mirrors",
    description:
      "Arched, round and ornate mirrors that bounce light around, open up small rooms and double as wall art.",
    image: IMG("1598928506311-c55ded91a20c", 1200),
    imageAlt: "Living room corner styled with a large decorative mirror",
    featured: false,
    sortOrder: 7,
  },
  {
    name: "Vases & Accessories",
    slug: "vases",
    description:
      "Ceramic vases, sculptural objects, candles and trays — the small styling pieces that finish a shelf or table.",
    image: IMG("1586105251261-72a756497a11", 1200),
    imageAlt: "Grouping of ceramic vases styled on a wooden table",
    featured: true,
    sortOrder: 8,
  },
  {
    name: "Storage & Organization",
    slug: "storage-organization",
    description:
      "Woven baskets, shelving and pretty storage solutions that keep clutter hidden without sacrificing style.",
    image: IMG("1616046229478-9901c5536a45", 1200),
    imageAlt: "Tidy interior with woven storage baskets on open shelving",
    featured: false,
    sortOrder: 9,
  },
  {
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    description:
      "Dinnerware, serving pieces and table styling that make everyday meals and gatherings feel a little more special.",
    image: IMG("1519710164239-da123dc03ef4", 1200),
    imageAlt: "Dining table set with ceramic dinnerware and linen napkins",
    featured: false,
    sortOrder: 10,
  },
  {
    name: "Bathroom Accents",
    slug: "bathroom",
    description:
      "Wooden bath trays, stone accessories and spa-worthy touches that turn a plain bathroom into a quiet retreat.",
    image: IMG("1552321554-5fefe8c9ef14", 1200),
    imageAlt: "Calm bathroom corner with natural textures and rolled towels",
    featured: false,
    sortOrder: 11,
  },
  {
    name: "Seasonal & Minimalist",
    slug: "seasonal-minimalist",
    description:
      "Dried botanicals, wreaths and pared-back decor for slow seasonal updates — style without the clutter.",
    image: IMG("1533090481720-856c6e3c1fdc", 1200),
    imageAlt: "Minimalist shelf styled with dried stems and simple objects",
    featured: false,
    sortOrder: 12,
  },
];

export interface SeedProduct {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  imageAlt: string;
  categorySlug: string;
  subcategory?: string;
  amazonUrl: string;
  asin?: string;
  features: string[];
  pros: string[];
  cons: string[];
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  seoTitle?: string;
  seoDescription?: string;
}

export const seedProducts: SeedProduct[] = [
  {
    title: "Arched Rattan Wall Mirror",
    slug: "arched-rattan-wall-mirror",
    shortDescription:
      "A natural rattan-framed arch mirror that brings warmth, light and organic texture to entryways and living rooms.",
    description:
      "An arched mirror is one of the easiest ways to make a room feel taller and brighter, and the woven rattan frame adds the kind of organic texture that flat, mass-produced frames just don't have. We like it leaned against a wall above a console table, or hung in an entryway where it catches natural light from the front door.\n\nThe open weave sits beautifully against white walls and pairs naturally with linen, oak and terracotta tones. Because the frame is lightweight, it hangs easily on a single hook — no heavy-duty anchors required.",
    images: [IMG("1598928506311-c55ded91a20c"), IMG("1615529182904-14819c35db37")],
    imageAlt: "Arched rattan wall mirror styled in a bright neutral living room",
    categorySlug: "mirrors",
    subcategory: "Wall Mirrors",
    amazonUrl: "https://www.amazon.com/s?k=arched+rattan+wall+mirror",
    features: [
      "Handwoven natural rattan frame with a soft matte finish",
      "Arch silhouette that visually lengthens walls and doorways",
      "Lightweight design — hangs on a standard hook or picture hanger",
      "Real glass mirror with a clear, true-to-color reflection",
      "Works in entryways, bedrooms, bathrooms and living rooms",
    ],
    pros: [
      "Adds instant warmth and texture to plain walls",
      "Lighter than solid wood or metal framed mirrors",
      "Blends with almost every neutral palette",
    ],
    cons: [
      "Natural rattan can vary slightly in tone between pieces",
      "Keep away from very humid bathrooms to avoid fraying",
    ],
    featured: true,
    status: "PUBLISHED",
    seoTitle: "Arched Rattan Wall Mirror — Warm, Organic Wall Decor",
    seoDescription:
      "A handwoven rattan arch mirror that brightens entryways and living rooms. Styling ideas, features and honest pros and cons.",
  },
  {
    title: "Matte Brass Dome Table Lamp",
    slug: "matte-brass-dome-table-lamp",
    shortDescription:
      "A brushed brass dome lamp that casts a warm, cozy pool of light — perfect for bedside tables and console styling.",
    description:
      "Lighting is the fastest way to change how a room feels, and a warm brass lamp on a dark evening does more than any throw pillow ever will. This dome-shaped table lamp gives off a soft, downward glow that flatters everything around it — books, linen, wood grain, all of it.\n\nThe brushed brass finish reads as vintage without feeling fussy, and the compact footprint makes it a natural fit for crowded bedside tables and narrow console shelves. Style it with a stack of books and a small vase and you have an instant vignette.",
    images: [IMG("1513694203232-719a280e022f"), IMG("1493663284031-b7e3aefcae8e")],
    imageAlt: "Brass dome table lamp glowing warmly beside an armchair",
    categorySlug: "lighting",
    subcategory: "Table Lamps",
    amazonUrl: "https://www.amazon.com/s?k=brass+dome+table+lamp",
    features: [
      "Brushed matte brass finish with a classic dome shade",
      "Warm, downward-facing glow ideal for evening relaxation",
      "Compact base suited to nightstands and narrow consoles",
      "Works with standard E26 bulbs — pair with a 2700K warm white",
      "In-line switch for easy on/off access",
    ],
    pros: [
      "The brass finish looks far more expensive than it typically costs",
      "Creates a genuinely cozy evening atmosphere",
      "Small footprint suits crowded surfaces",
    ],
    cons: [
      "Bulb is usually not included — budget for a warm-white LED",
      "Brass finish varies slightly between batches",
    ],
    featured: true,
    status: "PUBLISHED",
    seoTitle: "Matte Brass Dome Table Lamp — Cozy Lighting for Bedside & Console",
    seoDescription:
      "Why we love the brass dome table lamp: warm glow, vintage feel and styling ideas for bedside tables and entryway consoles.",
  },
  {
    title: "Faux Fiddle Leaf Fig Tree (4 ft)",
    slug: "faux-fiddle-leaf-fig-tree",
    shortDescription:
      "A lifelike four-foot fiddle leaf fig that delivers the designer-plant look with zero watering, light or maintenance.",
    description:
      "The fiddle leaf fig is the unofficial mascot of interior design — and also famously dramatic to keep alive. A quality faux version gives you the same sculptural, corner-softening presence without the watering schedule, the dropped leaves, or the guilt.\n\nThe best faux figs (like this one) vary leaf sizes, angle the stems naturally, and use a matte fabric leaf that doesn't have that plasticky shine. Pop it into a woven basket to cover the starter pot, and most guests will never guess. We recommend placing it near a window where real light hits the leaves — it makes the realism 10x more convincing.",
    images: [IMG("1584589167171-541ce45f1eea"), IMG("1583847268964-b28dc8f51f92")],
    imageAlt: "Tall faux fiddle leaf fig tree in a corner beside a window",
    categorySlug: "plants-planters",
    subcategory: "Artificial Trees",
    amazonUrl: "https://www.amazon.com/s?k=faux+fiddle+leaf+fig+tree+4ft",
    features: [
      "Approximately 4 feet tall with a natural trunk and varied leaf sizes",
      "Matte fabric leaves with subtle veining — no plastic shine",
      "Comes in a weighted starter pot, ready to drop into a basket or planter",
      "No watering, pruning or specific light requirements",
      "Ships well-packed with branches that reshape in minutes",
    ],
    pros: [
      "Convincing realism when fluffed and placed near natural light",
      "Zero maintenance — ideal for low-light rooms and frequent travelers",
      "Fills awkward empty corners instantly",
    ],
    cons: [
      "Leaves need fluffing and reshaping after unboxing",
      "Dust collects on the wide leaves — wipe monthly",
    ],
    featured: true,
    status: "PUBLISHED",
    seoTitle: "Faux Fiddle Leaf Fig Tree — The Designer Plant Without the Upkeep",
    seoDescription:
      "A realistic 4ft faux fiddle leaf fig with matte fabric leaves. Styling tips, honest pros and cons, and how to make it look real.",
  },
  {
    title: "Handwoven Jute Area Rug (5×8)",
    slug: "handwoven-jute-area-rug",
    shortDescription:
      "A chunky handwoven jute rug that adds grounding texture and laid-back warmth to living rooms and dining spaces.",
    description:
      "Every room needs one element that's rougher and more natural than everything around it — that's what makes neutral spaces feel collected rather than flat. A handwoven jute rug does exactly that: chunky braided texture, a soft sandy tone, and a casual, slightly nubby feel underfoot.\n\nJute is best in living rooms, dining rooms and bedrooms rather than splash-prone kitchens or bathrooms. Layer a smaller patterned rug on top for depth, or let the weave speak for itself under a linen sofa and rattan accents.",
    images: [IMG("1522708323590-d24dbb6b0267"), IMG("1600210492486-724fe5c67fb0")],
    imageAlt: "Textured handwoven jute rug anchoring a neutral living room",
    categorySlug: "rugs",
    subcategory: "Natural Fiber Rugs",
    amazonUrl: "https://www.amazon.com/s?k=handwoven+jute+area+rug+5x8",
    features: [
      "Hand-braided natural jute fibers with a chunky, tactile weave",
      "Neutral sandy tone that works with every color palette",
      "5×8 ft size suits most living and dining rooms",
      "Reversible for even wear over time",
      "No shedding compared to wool and synthetic piles",
    ],
    pros: [
      "Exceptional texture for the price compared to wool",
      "Durable enough for living rooms and dining areas",
      "Neutral color hides everyday life surprisingly well",
    ],
    cons: [
      "Firm, nubby feel — not the coziest for sitting on the floor",
      "Not ideal for wet areas; spot-clean spills quickly",
    ],
    featured: true,
    status: "PUBLISHED",
    seoTitle: "Handwoven Jute Area Rug 5×8 — Natural Texture for Every Room",
    seoDescription:
      "A chunky hand-braided jute rug that grounds neutral rooms. Sizing, layering ideas, care notes and honest pros and cons.",
  },
  {
    title: "Terracotta Ceramic Vase Set of 3",
    slug: "terracotta-ceramic-vase-set",
    shortDescription:
      "Three warm terracotta vases in graduated heights — the easiest shelf and mantel styling shortcut we know.",
    description:
      "Styling a shelf or mantel is mostly about varying height and warmth, and a matched trio in graduated sizes solves both problems at once. This terracotta set has that sun-baked, handmade look — each vase is slightly imperfect, which is exactly the point.\n\nUse them empty as sculptural objects, or with a single stem of dried pampas or eucalyptus in the tallest. The matte finish photographs beautifully and warms up white kitchens and cool gray rooms instantly.",
    images: [IMG("1586105251261-72a756497a11"), IMG("1578500494198-246f612d3b3d")],
    imageAlt: "Set of three terracotta vases styled on a wooden shelf",
    categorySlug: "vases",
    subcategory: "Ceramic Vases",
    amazonUrl: "https://www.amazon.com/s?k=terracotta+ceramic+vase+set",
    features: [
      "Set of three vases in graduated heights for easy styling",
      "Warm matte terracotta glaze with subtle handmade variation",
      "Watertight enough for fresh stems, beautiful empty too",
      "Substantial weight — no tipping",
      "Pairs with pampas grass, eucalyptus, or single statement stems",
    ],
    pros: [
      "Instant 'designed' look on shelves, mantels and consoles",
      "Warm tone fixes flat, cool color schemes",
      "Three pieces cost less than most single designer vases",
    ],
    cons: [
      "Exact glaze tone varies between sets",
      "Ceramic can chip if knocked — hand wash",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Ribbed Stoneware Vase",
    slug: "ribbed-stoneware-vase",
    shortDescription:
      "A sculptural ribbed stoneware vase that looks like a potter's-market find and styles beautifully with one bold stem.",
    description:
      "There's a reason potters love ribbed forms: the vertical grooves catch light differently through the day, giving a vase movement even when it's empty. This stoneware piece has a soft speckled glaze and a rounded, hand-thrown silhouette that anchors coffee tables and kitchen islands.\n\nIt's the kind of object that makes everything near it look more considered. One branch, three tulips, or nothing at all — it holds its own either way.",
    images: [IMG("1615971677499-5467cbab01c0"), IMG("1485955900006-10f4d324d411")],
    imageAlt: "Ribbed stoneware vase with dried stems on a coffee table",
    categorySlug: "vases",
    subcategory: "Ceramic Vases",
    amazonUrl: "https://www.amazon.com/s?k=ribbed+stoneware+vase",
    features: [
      "Hand-glazed speckled stoneware with vertical ribbing",
      "Rounded, weighty silhouette that reads high-end",
      "Neutral tone works in warm and cool palettes",
      "Ideal for single branches, tulips or dried arrangements",
      "Approximately 8–10 inches tall depending on batch",
    ],
    pros: [
      "Genuine artisanal character — no two glazes identical",
      "Beautiful even when empty",
      "Substantial feel with a nice weight in hand",
    ],
    cons: [
      "Glaze speckling varies — expect slight differences from photos",
      "Only one size, so pair it with other vessels for a grouping",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Linen Throw Pillow Cover Set (4-Pack)",
    slug: "linen-throw-pillow-covers",
    shortDescription:
      "Soft washed-linen pillow covers in layered neutrals — the fastest, cheapest living room refresh there is.",
    description:
      "If a living room feels tired, the answer is almost always pillows. Washed linen covers in oatmeal, ivory and warm gray bring that relaxed, slightly rumpled elegance that hotels charge a lot to fake. The slubby linen texture catches light and instantly makes even an old sofa feel intentional.\n\nSwapping covers takes five minutes and costs a fraction of new pillows — and you can wash these after winter and swap in something lighter for summer. We recommend pairing two larger 20-inch covers in back with two 18-inch in front, in alternating tones.",
    images: [IMG("1586023492125-27b2c045efd7"), IMG("1507089947368-19c1da9775ae")],
    imageAlt: "Neutral linen throw pillows arranged on a beige sofa",
    categorySlug: "living-room",
    subcategory: "Textiles",
    amazonUrl: "https://www.amazon.com/s?k=washed+linen+throw+pillow+covers+set",
    features: [
      "Set of four covers in complementary neutral tones",
      "Stone-washed linen blend that softens with every wash",
      "Hidden zipper closures for a clean, tailored look",
      "Fits standard 18×18 and 20×20 inserts (inserts not included)",
      "Machine washable — cold cycle, low tumble",
    ],
    pros: [
      "Five-minute room refresh for very little money",
      "Texture reads far more expensive than the price",
      "Covers wash easily and store flat between seasons",
    ],
    cons: [
      "Inserts are usually not included — check the listing",
      "Linen wrinkles by nature; that's the charm, but know it going in",
    ],
    featured: true,
    status: "PUBLISHED",
    seoTitle: "Linen Throw Pillow Covers — The 5-Minute Living Room Refresh",
    seoDescription:
      "Washed linen pillow covers in layered neutrals. Sizing tips, styling formulas and honest pros and cons for sofas and beds.",
  },
  {
    title: "Chunky Knit Throw Blanket",
    slug: "chunky-knit-throw-blanket",
    shortDescription:
      "A thick, drapey knit throw in warm neutrals that makes any bed or armchair look — and feel — instantly cozier.",
    description:
      "A chunky knit throw is the diffuser-without-a-diffuser of home decor: it makes everything feel calm. The oversized stitches and generous drape add softness to structured furniture, and a neutral tone — cream, oat, warm gray — works on literally any bed or chair you own.\n\nLook for acrylic-wool blends that keep the hand-knit look without the dry-clean tag. Drape it diagonally over a sofa corner or fold it over the foot of the bed with the texture facing out.",
    images: [IMG("1616627561950-9f746e330187"), IMG("1567016432779-094069958ea5")],
    imageAlt: "Chunky knit throw blanket draped over a neutral bed",
    categorySlug: "bedroom",
    subcategory: "Throws & Blankets",
    amazonUrl: "https://www.amazon.com/s?k=chunky+knit+throw+blanket",
    features: [
      "Oversized chunky knit with a soft, drapey hand feel",
      "Generous 50×60 inch throw size for sofas and beds",
      "Acrylic-wool blend: cozy like wool, easier to care for",
      "Warm neutral shades that layer with any bedding",
      "Machine washable on gentle in most versions",
    ],
    pros: [
      "Instant visual and physical coziness",
      "Big enough to actually use, not just style",
      "Neutral tones work year-round",
    ],
    cons: [
      "Chunky knits can snag on jewelry and pet claws",
      "Cheaper versions shed slightly at first — wash before heavy use",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Woven Seagrass Storage Baskets (Set of 3)",
    slug: "woven-seagrass-storage-baskets",
    shortDescription:
      "Handwoven seagrass baskets that hide toys, throws and clutter while looking like decor instead of storage.",
    description:
      "The best storage is the kind guests never notice. Woven seagrass baskets tuck blankets, toys, firewood and even ugly-but-necessary electronics into something textured and warm. The set-of-three nesting sizes cover everything from under-console stashing to plant pot covers.\n\nSlide the smallest beside the sofa for remotes, let the medium hold throws, and drop your faux trees (still in their starter pots) into the large. It's the single cheapest way to make a room look tidier in about ninety seconds.",
    images: [IMG("1616046229478-9901c5536a45"), IMG("1600121848594-d8644e57abab")],
    imageAlt: "Woven seagrass storage baskets styled on open shelving",
    categorySlug: "storage-organization",
    subcategory: "Baskets",
    amazonUrl: "https://www.amazon.com/s?k=seagrass+storage+baskets+set+of+3",
    features: [
      "Set of three nesting baskets in graduated sizes",
      "Handwoven seagrass with sturdy rolled rims",
      "Sturdy enough for throws, toys, plants and magazines",
      "Works as planter covers to hide plastic nursery pots",
      "Neutral natural tone complements any room",
    ],
    pros: [
      "Storage that genuinely looks like decor",
      "Three sizes cover almost every household need",
      "Lightweight but holds its shape when full",
    ],
    cons: [
      "Natural fibers can transfer slight color to light carpets when new",
      "Not wipeable — dust with a dry cloth or vacuum brush",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Floating Wood Shelves (Set of 3)",
    slug: "floating-wood-shelves-set",
    shortDescription:
      "Solid-wood floating shelves that add storage and display space without the visual weight of bookcases.",
    description:
      "Floating shelves are the workhorse of small-space decorating: vertical storage with almost no footprint. This solid-wood set has visible grain and a warm stain that reads handmade rather than hardware-store, with concealed brackets so the wood seems to hover.\n\nThree shelves stacked 16–18 inches apart above a sofa, desk or console turns dead wall into a styled vignette. Follow the 60-30-10 rule — 60% books and practical things, 30% plants and ceramics, 10% empty space — and they'll look designed rather than crowded.",
    images: [IMG("1533090481720-856c6e3c1fdc"), IMG("1524758631624-e2822e304c36")],
    imageAlt: "Solid wood floating shelves styled with books and ceramics",
    categorySlug: "storage-organization",
    subcategory: "Wall Storage",
    amazonUrl: "https://www.amazon.com/s?k=floating+wood+shelves+set+of+3",
    features: [
      "Set of three solid wood boards with concealed mounting hardware",
      "Warm stained finish with visible natural grain",
      "Deep enough for books, plants and framed photos",
      "Includes anchors suitable for drywall installation",
      "Available in multiple lengths to fit your wall",
    ],
    pros: [
      "Adds storage without eating floor space",
      "Warm wood softens white and gray walls",
      "Concealed brackets give a clean, built-in look",
    ],
    cons: [
      "Needs careful leveling during install — take your time",
      "Weight limits mean art-heavy styling beats book-heavy styling",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Botanical Print Wall Art Set (6-Piece)",
    slug: "botanical-print-wall-art-set",
    shortDescription:
      "A framed botanical print set that builds a calm, collected gallery wall in an afternoon — no art degree required.",
    description:
      "Gallery walls intimidate people because choosing art is hard. A botanical print set removes the hard part: six coordinated vintage-style prints that already agree with each other. Framed in matching oak or black, they create that quiet, collected look that designer rooms trade on.\n\nHang them as a 2×3 grid above a sofa or console for order, or scatter them down a hallway for rhythm. The muted greens and creams sit beautifully against sage, terracotta and linen palettes.",
    images: [IMG("1615873968403-89e068629265"), IMG("1617103996702-96ff29b1c467")],
    imageAlt: "Botanical print gallery wall in thin frames above a console",
    categorySlug: "wall-art",
    subcategory: "Prints",
    amazonUrl: "https://www.amazon.com/s?k=botanical+prints+wall+art+set+of+6",
    features: [
      "Six coordinated vintage-style botanical prints",
      "Muted sage and cream palette that flatters neutral rooms",
      "Printed on heavyweight matte paper (frames sold separately in most sets)",
      "Uniform 8×10 or 11×14 sizing for easy grid layouts",
      "Ready to frame — pair with matching frames for a gallery wall",
    ],
    pros: [
      "Curated look without the curation effort",
      "Very affordable way to fill a large wall",
      "Timeless subject matter that won't date",
    ],
    cons: [
      "Most sets are prints only — budget for frames",
      "Colors can differ slightly from screen photos",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Handcrafted Wooden Serving Tray",
    slug: "handcrafted-wooden-serving-tray",
    shortDescription:
      "A warm acacia wood tray that turns coffee tables and ottomans into styled vignettes — and serves drinks on weekends.",
    description:
      "A tray is the skeleton of every good coffee-table vignette. Gather the candles, the remote, the tiny plant that otherwise wanders the table — put them on a wooden tray, and the table instantly reads styled. This acacia piece has raised edges and cutout handles, so it works just as hard serving coffee on weekends.\n\nThe warm wood grain bridges white ceramics, greenery and brass accents, which makes it one of those rare accessories that fits every season.",
    images: [IMG("1485955900006-10f4d324d411"), IMG("1616046229478-9901c5536a45")],
    imageAlt: "Wooden serving tray styled with candles and ceramics on a coffee table",
    categorySlug: "living-room",
    subcategory: "Tabletop",
    amazonUrl: "https://www.amazon.com/s?k=wooden+serving+tray+acacia",
    features: [
      "Solid acacia wood with a warm, food-safe finish",
      "Raised edges and cutout handles for easy carrying",
      "Generous rectangle suits ottomans and coffee tables",
      "Doubles as ottoman tabletop, bathroom vanity tray or bar tray",
      "Each tray has unique grain variation",
    ],
    pros: [
      "Instantly organizes clutter into a styled vignette",
      "Sturdy enough for real serving duty",
      "Warm wood suits every palette and season",
    ],
    cons: [
      "Hand wash only — no dishwasher",
      "Grain and tone vary piece to piece",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Stoneware Dinnerware Set (16-Piece)",
    slug: "stoneware-dinnerware-set",
    shortDescription:
      "A reactive-glaze stoneware set for four that makes weeknight pasta feel like dinner at a countryside bistro.",
    description:
      "Reactive glazes are the quiet luxury of the dinner table: each plate has subtle color variation around the rim, so every place setting looks slightly one-of-a-kind. This sixteen-piece service for four covers dinner plates, salad plates, and bowls in a warm speckled finish that pairs with linen napkins and simple glassware.\n\nIt's the kind of set that makes takeout look plated and makes guests ask where you bought it. Most quality stoneware of this style is dishwasher and microwave safe, but always check the specific listing.",
    images: [IMG("1519710164239-da123dc03ef4"), IMG("1485955900006-10f4d324d411")],
    imageAlt: "Speckled stoneware dinnerware set on a styled dining table",
    categorySlug: "kitchen-dining",
    subcategory: "Dinnerware",
    amazonUrl: "https://www.amazon.com/s?k=stoneware+dinnerware+set+16+piece",
    features: [
      "16-piece set: dinner plates, salad plates and bowls for four",
      "Reactive speckled glaze — every piece has subtle variation",
      "Warm neutral tone that suits everyday and holiday tables",
      "Typically dishwasher and microwave safe (verify listing)",
      "Stacks neatly for compact cabinet storage",
    ],
    pros: [
      "Restaurant-feel presentation for everyday meals",
      "Unique glaze variation looks handcrafted",
      "Neutral base lets colorful food and linens shine",
    ],
    cons: [
      "Reactive glazes can show cutlery marks over time",
      "Stoneware is heavier than porcelain — consider if you stack high",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Bamboo Bathtub Caddy Tray",
    slug: "bamboo-bathtub-caddy-tray",
    shortDescription:
      "A stretchable bamboo bath tray that turns an ordinary soak into a spa evening — book, candle and tea within reach.",
    description:
      "Self-care is mostly logistics. A bamboo bath caddy solves the logistics: it stretches across the tub, holds your book or tablet at reading angle, keeps a candle and a glass of wine safely above the waterline, and has a slot for the soap you'll actually use.\n\nThe natural bamboo warms up standard white bathrooms and folds flat for storage. Pair with eucalyptus hanging from the showerhead and you've built a spa for the price of a takeout dinner.",
    images: [IMG("1552321554-5fefe8c9ef14"), IMG("1595526114035-0d45ed16cfbf")],
    imageAlt: "Bamboo bath tray with candle and book across a bathtub",
    categorySlug: "bathroom",
    subcategory: "Bath Accessories",
    amazonUrl: "https://www.amazon.com/s?k=bamboo+bathtub+caddy+tray",
    features: [
      "Expandable bamboo frame fits most standard tubs",
      "Book/tablet rest, wine glass holder and accessory slots",
      "Water-resistant natural bamboo finish",
      "Folds flat for compact storage",
      "Also works as a bed breakfast tray",
    ],
    pros: [
      "Transforms bath time into an actual ritual",
      "Warm bamboo elevates plain white bathrooms",
      "Doubles as a lap desk or serving tray",
    ],
    cons: [
      "Measure your tub — extra-wide tubs may exceed the expansion",
      "Rinse and dry after use to keep the bamboo happy",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Dried Pampas Grass Bouquet",
    slug: "dried-pampas-grass-bouquet",
    shortDescription:
      "Fluffy dried pampas stems that bring soft height and movement to vases — no water, no wilting, no upkeep.",
    description:
      "Fresh flowers are lovely; dried pampas is practical. A bundle of these plumes fills a tall vase with soft, feathery height that lasts for years. The creamy beige tones sit perfectly against terracotta, sage and charcoal neutrals.\n\nGive the stems a gentle shake and a few minutes in sunshine when they arrive and they'll fluff right up. Style three to five stems in your tallest vase, keep them away from humidity, and enjoy genuinely zero-maintenance botanicals.",
    images: [IMG("1578500494198-246f612d3b3d"), IMG("1615800098779-1be32e60cca3")],
    imageAlt: "Dried pampas grass stems in a tall ceramic vase",
    categorySlug: "seasonal-minimalist",
    subcategory: "Dried Botanicals",
    amazonUrl: "https://www.amazon.com/s?k=dried+pampas+grass+bouquet",
    features: [
      "15–20 natural dried pampas stems in mixed heights",
      "Soft cream and beige plumes, roughly 17 inches tall",
      "Lasts years with zero water or light requirements",
      "Ships compressed — fluffs in sunlight in minutes",
      "Perfect for tall floor vases and mantel arrangements",
    ],
    pros: [
      "The lowest-effort botanical styling that exists",
      "Softens rooms with height and movement",
      "Budget-friendly way to fill large vases",
    ],
    cons: [
      "Naturally sheds a little — style away from fans and vents",
      "Keep out of humid bathrooms to avoid limp plumes",
    ],
    featured: true,
    status: "PUBLISHED",
  },
  {
    title: "Scalloped Stoneware Mug Set (4-Pack)",
    slug: "scalloped-stoneware-mug-set",
    shortDescription:
      "Hand-glazed scalloped mugs in soft muted tones that make morning coffee feel like a small ceremony.",
    description:
      "Some objects earn their shelf space twice — once as decor, once in the hand. These scalloped stoneware mugs do both: a gentle rippled rim, a soft speckled glaze in four complementary tones, and a satisfying weight that makes the first coffee of the day feel deliberate.\n\nThey photograph beautifully on open shelving between the ribbed vase and a stack of cookbooks, and they survive daily use without looking tired. A quietly perfect housewarming gift, too.",
    images: [IMG("1600494603989-9650cf6ddd3d"), IMG("1616046229478-9901c5536a45")],
    imageAlt: "Scalloped stoneware mugs in muted tones on open kitchen shelving",
    categorySlug: "kitchen-dining",
    subcategory: "Drinkware",
    amazonUrl: "https://www.amazon.com/s?k=scalloped+stoneware+mugs+set",
    features: [
      "Set of four 12–14 oz mugs in complementary muted glazes",
      "Sculptural scalloped rim with a comfortable handle",
      "Speckled reactive glaze — each mug varies slightly",
      "Generally dishwasher and microwave safe (verify listing)",
      "Stacks and displays beautifully on open shelves",
    ],
    pros: [
      "Elevates a daily habit into a small ritual",
      "Display-worthy on shelves between uses",
      "Four-toned set feels collected, not matched",
    ],
    cons: [
      "Reactive glaze tones vary between batches",
      "Hold capacity is modest — check ounces if you drink big",
    ],
    featured: false,
    status: "PUBLISHED",
  },
  {
    title: "Ceramic Table Lamp with Linen Shade (Draft Demo)",
    slug: "ceramic-table-lamp-linen-shade",
    shortDescription:
      "A demo draft product so you can see exactly how drafts behave before publishing them to the live site.",
    description:
      "This product is intentionally saved as a Draft. It does not appear on the shop, category pages, or search results for visitors — only administrators can preview it here with a visible draft banner.\n\nUse it to test the publish workflow: open the admin dashboard, edit this product, switch it to Published, and watch it appear on the public site immediately. Then unpublish or delete it whenever you like.",
    images: [IMG("1543198126-a8ad8e47fb22")],
    imageAlt: "Ceramic table lamp with a linen drum shade on a bedside table",
    categorySlug: "lighting",
    subcategory: "Table Lamps",
    amazonUrl: "https://www.amazon.com/s?k=ceramic+table+lamp+linen+shade",
    features: [
      "Demo draft entry — safe to edit, publish or delete",
      "Shows how drafts are hidden from visitors and search engines",
      "Includes admin-only preview with a clear draft banner",
    ],
    pros: ["Handy for testing the publishing workflow"],
    cons: ["This is placeholder content — replace it with real products"],
    featured: false,
    status: "DRAFT",
  },
];
