import { IMG } from "./seed-data";

export interface SeedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
  featuredImage: string;
  imageAlt: string;
  category: string;
  tags: string[];
  author: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle?: string;
  seoDescription?: string;
}

export const seedPosts: SeedPost[] = [
  {
    title: "12 Cozy Living Room Ideas on a Budget",
    slug: "cozy-living-room-ideas-on-a-budget",
    excerpt:
      "You don't need new furniture to make your living room feel warm and inviting. These twelve low-cost updates — from pillow formulas to lighting layers — deliver the biggest coziness per dollar.",
    featuredImage: IMG("1555041469-a586c61ea9bc", 1400),
    imageAlt: "Cozy neutral living room with layered pillows and warm lighting",
    category: "Room Ideas",
    tags: ["living room", "budget decor", "cozy home", "textiles"],
    author: "Editorial Team",
    status: "PUBLISHED",
    seoTitle: "12 Cozy Living Room Ideas on a Budget — Haven & Hue",
    seoDescription:
      "Twelve affordable ways to make your living room cozier: lighting layers, pillow formulas, texture mixing and more low-cost styling ideas.",
    content: `A cozy living room isn't bought in one trip to the furniture store. It's layered — a throw here, a lamp there, a rug that pulls it all together. The good news: those layers are the cheapest parts of the room. Here are twelve updates that punch far above their price tag.

## 1. Start with lighting, not furniture

Overhead lighting is the enemy of cozy. Turn off the ceiling light and add two or three warm lamps at different heights instead — one table lamp, one floor lamp, maybe a small candle. Aim for bulbs around 2700K (warm white) so everything glows rather than glares.

## 2. Follow the pillow formula

A sofa looks "designed" when pillows vary in **size, tone and texture**. A reliable formula for a standard sofa:

- Two 20-inch covers in the back corners
- Two 18-inch covers in front, in a contrasting (still neutral) tone
- One lumbar pillow in the center, optional but powerful

Swapping covers costs a fraction of replacing pillows. Browse our [living room decor](/category/living-room) picks for linen and knit options.

## 3. Add one natural texture

Rooms feel flat when every surface is smooth. Jute, rattan, seagrass or raw wood adds the roughness that makes smooth things feel softer by contrast. A [handwoven jute rug](/product/handwoven-jute-area-rug) under the coffee table does this better than almost anything else.

## 4. Drape a throw like a stylist

Don't fold your throw into a perfect rectangle — that reads hotel-room-sterile. Drape it diagonally over one sofa corner, or fold it in thirds over the armrest with the texture facing out.

## 5. Style a tray vignette

Grab a [wooden serving tray](/product/handcrafted-wooden-serving-tray) and corral the coffee table chaos: candle, remote, a small plant, one book. A tray turns clutter into composition in about two minutes.

## 6. Warm up the walls with an arch mirror

An [arched mirror](/category/mirrors) bounces window light around the room and adds a soft curve to a boxy space. Lean it or hang it — both work.

## 7. Bring in one "impossible to kill" plant

A faux fiddle leaf or a trailing pothos softens corners and adds life. If you travel or your rooms run dim, a [quality faux tree](/product/faux-fiddle-leaf-fig-tree) near a window reads convincingly real.

## 8. Layer your rugs

If your rug feels thin, don't replace it — layer a smaller patterned or flat-weave rug on top, off-center. It's a designer trick that adds depth for a fraction of the price of a big new rug.

## 9. Curate the bookshelf, don't fill it

Shelves look calmer when about a third of the space stays empty. Mix vertical books, horizontal stacks, and one or three objects (odd numbers win). Leave breathing room.

## 10. Swap cool white bulbs for warm

If your lamps still have blue-ish 5000K bulbs from the hardware store, this five-dollar fix changes everything. Warm light flatters wood, linen and skin tones; cool light flattens all three.

## 11. Ground the room with curtains that reach the floor

Ready-made curtains hung wide and tall — rod 4–6 inches below the ceiling, panels just kissing the floor — make ceilings feel higher and windows feel grander, even with inexpensive panels.

## 12. Make one corner a "moment"

Pick the corner that photographs well — near a window, ideally — and style it hard: chair, lamp, side table, plant. One finished corner elevates how the entire room feels.

## The takeaway

Coziness is texture + warm light + a little softness. Start with lighting and pillows this weekend, add one natural texture next payday, and let the room evolve. For more inspiration, browse all our [shop finds](/shop) or dig into the rest of the [blog](/blog).`,
  },
  {
    title: "How to Style Open Shelves Like a Designer",
    slug: "how-to-style-open-shelves",
    excerpt:
      "Open shelving looks effortless in magazines and impossible in real life. This simple framework — plus a few honest rules — makes any shelf look intentional.",
    featuredImage: IMG("1524758631624-e2822e304c36", 1400),
    imageAlt: "Open wooden shelves styled with books, ceramics and plants",
    category: "Styling Guides",
    tags: ["shelves", "styling", "minimalism", "storage"],
    author: "Editorial Team",
    status: "PUBLISHED",
    seoTitle: "How to Style Open Shelves Like a Designer — Haven & Hue",
    seoDescription:
      "A practical framework for styling open shelves: the 60-30-10 rule, object grouping, height variation and common mistakes to avoid.",
    content: `There's a reason open shelves separate the styled homes from the staged ones: they're small galleries, and galleries need editing. The good news is that "editing" is learnable. Here's the framework we use, distilled from a hundred styled shelf photos and a fair amount of trial and error.

## The 60-30-10 rule

Think of each shelf's contents in three buckets:

- **60% practical** — books, plates, glassware, baskets. The things you actually use.
- **30% beautiful** — vases, ceramics, framed photos, plants. The things you like to look at.
- **10% empty** — deliberate breathing room. Non-negotiable.

Most shelves fail because they're 100% full. Empty space is what makes objects read as *chosen*.

## Vary height and depth

Line-ups of same-height objects read as clutter. Instead:

1. Place one taller anchor object (a vase, a plant) toward one end — never the exact center.
2. Add a medium object nearby, slightly overlapping the anchor's visual space.
3. Finish with a low, wide element — a horizontal book stack with a small object on top.

This creates a triangle of height, and triangles are what the eye reads as "styled."

## Group in odd numbers

One vase. Or three objects. Or five small ones. Odd-numbered groups feel organic; even groups feel matched and stiff. If you're starting from zero, a [set of graduated terracotta vases](/product/terracotta-ceramic-vase-set) solves the height problem instantly.

## Let books be books

Design books on display is a cliché for a reason, but the execution matters:

- Mix vertical runs with horizontal stacks (bookends for the verticals, objects for the horizontals).
- Turn some spines inward for a neutral, tonal look if your covers clash.
- Leave 20–30% of the shelf empty around the books.

## Repeat materials across shelves

Cohesion comes from repetition. If your [stoneware mugs](/product/scalloped-stoneware-mug-set) are speckled ceramic, echo that ceramic on the next shelf up with a vase. If your kitchen is warm wood, repeat wood in trays and boards. Two or three repeating materials, maximum.

## Style the wall side, too

Flat items — small framed prints, a round [wall mirror](/category/mirrors), even a woven basket hung as art — add depth behind objects. Layering front-to-back is the difference between a shelf and a tableau.

## Common mistakes (we've made them all)

- **Overfilling.** When in doubt, remove an object.
- **Matching sets everywhere.** One set is cohesive; three sets is a store display.
- **Ignoring the room.** Shelves should repeat a color already in the room's rug, art or textiles.
- **Tiny objects only.** Small things read as noise from across the room. Anchor with something substantial.

## One weekend, one shelf

Don't restyle the whole wall at once. Pick a single shelf, apply 60-30-10, build one triangle of height, and stop. Live with it for a week. Styled shelves are a practice, not a project — and they're never actually finished. For pieces to style with, start at our [vases and accessories](/category/vases) collection.`,
  },
  {
    title: "The Beginner's Guide to Layering Rugs",
    slug: "beginners-guide-to-layering-rugs",
    excerpt:
      "Layering rugs adds depth, texture and softness — and lets you keep the jute rug you already own. Here's how to do it without the messy look.",
    featuredImage: IMG("1600210492486-724fe5c67fb0", 1400),
    imageAlt: "Layered area rugs adding texture to a neutral living room",
    category: "Styling Guides",
    tags: ["rugs", "texture", "layering", "living room"],
    author: "Editorial Team",
    status: "PUBLISHED",
    seoTitle: "The Beginner's Guide to Layering Rugs — Haven & Hue",
    seoDescription:
      "How to layer rugs like a designer: base rug sizes, texture contrasts, placement rules and the mistakes that make layered rugs look messy.",
    content: `A single rug can feel like a furniture requirement; layered rugs feel like a *decision*. The look adds texture underfoot, defines zones in open-plan rooms, and — best of all — it's cheaper than buying one big statement rug. Here's the beginner-friendly version.

## Why layer works

Big patterned rugs are expensive. Big neutral rugs are not. The layering trick exploits that: a large, affordable, textural base (jute, sisal, flatweave) grounds the room, and a smaller, softer, prettier rug sits on top where the eye — and the feet — land.

## Choose the base rug first

Your base should be:

- **Big** — it should sit under at least the front legs of your furniture.
- **Textural** — chunky weave, flat braid, subtle pattern. See our [handwoven jute rug](/product/handwoven-jute-area-rug) for the archetype.
- **Neutral** — the base's job is contrast, not color.

## Choose the top rug second

The top rug is the jewelry:

- Smaller by about 2–3 feet on each side.
- Softer — wool, cotton, or a washable printed runner.
- It can carry pattern or color, since the base stays quiet.

## Placement rules

1. **Living room:** top rug centered under the coffee table, edges parallel to the base. Don't rotate it — parallel lines are what keep the look intentional.
2. **Bedroom:** base runs perpendicular to the bed; the top rug peeks out on the side you step onto. Morning feet, meet wool.
3. **Dining:** usually skip the layer — chair legs and layered rugs fight.

## Texture contrast is the whole game

Jute under wool. Flatweave under high-pile. Smooth under shag. The friction between textures is what reads as "designed." Two rugs with the same texture just look like a mistake.

## Keep it flat and safe

Two realities of layered rugs:

- **Curling corners are a trip hazard.** A quality rug pad under the base and a thin felt pad under the top rug keeps everything flat.
- **Vacuum with care.** Vacuum the exposed base edges; lift the top rug for the middle. It's a five-second habit.

## When not to layer

Skip layering in high-spill zones (the kitchen), under dining sets, and in rooms already full of pattern — a layered look needs some visual quiet around it to work.

## Start small

Try a 2×3 washable rug on top of your existing rug this weekend. If you love it, graduate to a 5×7. The [rugs and carpets](/category/rugs) collection has base and top rug candidates in every size.`,
  },
  {
    title: "10 Bedroom Updates for a Calmer Space",
    slug: "bedroom-updates-for-a-calmer-space",
    excerpt:
      "Your bedroom should lower your heart rate the moment you walk in. Ten small changes — from bulb temperatures to bedside styling — that make it happen.",
    featuredImage: IMG("1567016432779-094069958ea5", 1400),
    imageAlt: "Calm neutral bedroom with soft bedding and warm bedside light",
    category: "Room Ideas",
    tags: ["bedroom", "cozy home", "lighting", "textiles"],
    author: "Editorial Team",
    status: "PUBLISHED",
    seoTitle: "10 Bedroom Updates for a Calmer Space — Haven & Hue",
    seoDescription:
      "Ten affordable bedroom updates that create calm: warm lighting layers, natural textures, nightstand styling and clutter-free zones.",
    content: `The bedroom is the one room that should ask nothing of you. No productivity, no entertaining — just rest. These ten updates are small, affordable, and specifically chosen to lower the visual noise.

## 1. Go all-warm on the lighting

Every bulb in the bedroom should be 2700K or lower. Better: skip overheads entirely after sunset and run a [small table lamp](/category/lighting) with a warm glow. The difference in how the room feels at 9pm is dramatic.

## 2. Clear the nightstand to three things

A lamp, a book, a glass of water. That's the whole formula. Everything else — chargers, pills, mail, four half-finished lip balms — goes in a drawer or a small basket. A clear nightstand is a clear mind.

## 3. Choose a two-tone bedding palette

Calm bedrooms usually run two colors plus white: say, oat and sage, or ivory and warm gray. Pick your pair and keep sheets, duvet and pillows inside it. Contrast comes from **texture**, not color.

## 4. Add one heavy texture

A [chunky knit throw](/product/chunky-knit-throw-blanket) across the foot of the bed does more for perceived warmth than a higher thread count ever will. Rough, nubby, weighty — one is enough.

## 5. Style the wall above the bed — simply

One large piece or a symmetric pair beats a busy gallery wall in a rest room. A single arch mirror or a pair of botanical prints keeps it quiet.

## 6. Bring in something botanical

A trailing pothos on the dresser or a faux tree in the corner adds the organic note that softens all the straight lines. Low-light room? Faux is the honest answer — see our [plants and planters](/category/plants-planters) picks.

## 7. Hide the laundry situation

Not glamorous, just true: a lidded hamper or a [woven basket](/product/woven-seagrass-storage-baskets) removes the single most common source of bedroom clutter. Choose one that looks like decor, because it will be visible.

## 8. Cool the room, warm the light

Sleep science and coziness agree here: keep the room cool (65–68°F / 18–20°C) and the light warm. The contrast tells your body it's evening.

## 9. Retire the phone charger from the nightstand

If you change only one thing, change this. Move the phone across the room or out entirely. The nightstand becomes a calm place again — and, bonus, you will.

## 10. Make the bed the moment you get up

It's the smallest habit on this list and the one that changes the room most. A made bed with a folded duvet and two placed pillows makes even an imperfect room feel managed.

## Keep it slow

Calm is cumulative — one update a weekend. Start with lighting and the nightstand clear-out, then layer in textiles. If you want starting points, the [bedroom decor](/category/bedroom) collection keeps everything in one palette.`,
  },
  {
    title: "Faux Plants That Actually Look Real (and How to Style Them)",
    slug: "faux-plants-that-look-real",
    excerpt:
      "The five faux plants interior designers actually use, and the placement tricks that make them pass the squint test — no watering can required.",
    featuredImage: IMG("1556228453-efd6c1ff04f6", 1400),
    imageAlt: "Realistic faux plant in a ceramic pot styled beside natural light",
    category: "Decor Guides",
    tags: ["plants", "faux plants", "styling", "low maintenance"],
    author: "Editorial Team",
    status: "PUBLISHED",
    seoTitle: "Faux Plants That Actually Look Real — Haven & Hue",
    seoDescription:
      "The most realistic faux plants for every room, plus styling tricks — light placement, pot choices and fluffing — that make them pass the squint test.",
    content: `Fake plants got good. The best ones now pass the squint test — you know, the one where you narrow your eyes and ask "is that real?" But plenty still fail it instantly. Here's how to pick winners and place them so guests stop guessing.

## The five that pass the squint test

### 1. Fiddle leaf fig

The sculptural icon. Faux versions work because the leaf shape is so distinctive and the real thing is so temperamental that nobody questions it. Look for **matte fabric leaves with visible veining** and varied leaf sizes — uniform leaves are the giveaway. Our [faux fiddle leaf fig](/product/faux-fiddle-leaf-fig-tree) is the reference point.

### 2. Olive tree

Airier than the fig, with silvery leaves that read elegant in a plain terracotta pot. Best beside a big window; the backlit leaves are what sell it.

### 3. Trailing pothos

The shelf edge specialist. Real pothos trails are slightly irregular — good faux versions replicate that wander. Let 2–3 runners spill off a bookshelf or the top of a cabinet.

### 4. Eucalyptus stems

The lowest commitment of all. A few stems in a [ribbed stoneware vase](/product/ribbed-stoneware-vase) on the kitchen counter or bathroom shelf. Dust them once a month and they last years.

### 5. Dried pampas

Technically not even "faux" — it's real, just dried. Fluffy, zero-care and perfect for filling vertical space. See the [pampas bouquet](/product/dried-pampas-grass-bouquet) in our seasonal collection.

## The placement tricks that sell it

**Light is everything.** Plants near windows read as real because real plants live near windows. A faux fig in a dark hallway reads as fake from across the room; the same tree by a bright window passes.

**Go big on the pot, not the plant.** A cheap plant in a beautiful [woven basket](/product/woven-seagrass-storage-baskets) or ceramic pot looks intentional. A good plant in a shiny plastic pot looks like an office.

**Fluff religiously.** Every faux plant arrives compressed. Spend ten minutes bending stems, separating leaves and varying their angles. This is 80% of the realism, and it's free.

**Dust monthly.** Real leaves don't collect a visible gray film. A microfiber cloth or a hairdryer on cool keeps leaves believable.

## Where faux wins outright

- **High shelves** — nobody can inspect leaves up there, and nobody wants to water them.
- **Dark rooms** — real plants struggle, faux thrives.
- **Rentals and frequent moves** — no heartbreak, no spills.
- **Vacation homes** — come back to a living-looking room, not a graveyard.

## The honest bottom line

Faux plants aren't cheating; they're staging. Real greenery where you can care for it, convincing faux where you can't. If a plant makes the room feel better, its maintenance schedule is nobody's business. Browse the [plants and planters](/category/plants-planters) collection to start your corner transformation.`,
  },
];
