/**
 * Chimney Inspection Templates
 *
 * Structured per NFPA 211-2016, Annex A.15.4 (Level II Inspection items 1-33)
 * and CSIA Standard Operating Procedures for:
 *   - Level 2 Masonry Chimney Attached to a Building Heating Appliance
 *   - Level 2 Inspection – Factory-Built Fireplace
 */

export type ItemResult =
  | "pass"
  | "deficient"
  | "not_applicable"
  | "not_accessible";

export interface TemplateItem {
  key: string;
  label: string;
  nfpaRef?: string; // e.g. "A.15.4 (3)"
  sortOrder: number;
}

export interface TemplateSection {
  key: string;
  title: string;
  sortOrder: number;
  items: TemplateItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// MASONRY CHIMNEY — Level II (NFPA 211 A.15.4 + CSIA SOP)
// ─────────────────────────────────────────────────────────────────────────────
export const masonryTemplate: TemplateSection[] = [
  {
    key: "appliance",
    title: "Appliance / Heating Equipment",
    sortOrder: 1,
    items: [
      { key: "appliance_condition", label: "Appliance is in apparent good condition with no visible damage, rust, or deterioration", sortOrder: 1 },
      { key: "appliance_clearances", label: "Appliance clearances to combustibles meet manufacturer specifications and applicable codes", sortOrder: 2 },
      { key: "appliance_label", label: "Appliance listing label is present and legible", sortOrder: 3 },
      { key: "combustion_air", label: "Adequate combustion air supply is provided to the appliance location", sortOrder: 4 },
      { key: "appliance_connections", label: "Fuel connections show no evidence of leaks or deterioration", sortOrder: 5 },
    ],
  },
  {
    key: "connector",
    title: "Connector / Flue Pipe",
    sortOrder: 2,
    items: [
      { key: "connector_material", label: "Connector material is appropriate for the appliance type and fuel", sortOrder: 1 },
      { key: "connector_condition", label: "Connector is free of holes, excessive corrosion, or mechanical damage", sortOrder: 2 },
      { key: "connector_clearances", label: "Connector clearances to combustibles meet code requirements", sortOrder: 3, nfpaRef: "A.15.4 (1)" },
      { key: "connector_slope", label: "Connector has proper rise toward the chimney (¼ inch per foot minimum)", sortOrder: 4 },
      { key: "connector_joints", label: "Connector joints are secure and properly fastened", sortOrder: 5 },
      { key: "connector_length", label: "Connector length does not exceed 75% of chimney height above the connector entry", sortOrder: 6 },
    ],
  },
  {
    key: "wall_passthrough",
    title: "Wall Pass-Through / Thimble",
    sortOrder: 3,
    items: [
      { key: "thimble_present", label: "Listed or code-compliant thimble is installed at the wall pass-through", sortOrder: 1 },
      { key: "thimble_clearance", label: "Clearances to combustibles at the wall pass-through meet code requirements", sortOrder: 2 },
      { key: "thimble_condition", label: "Thimble and surrounding masonry are in good condition with no cracks or gaps", sortOrder: 3 },
    ],
  },
  {
    key: "floor_protection",
    title: "Clearances and Floor Protection",
    sortOrder: 4,
    items: [
      { key: "floor_protection_present", label: "Floor protection (hearth extension or required clearance) is present", sortOrder: 1 },
      { key: "floor_protection_size", label: "Floor protection extends required distance in front of and to the sides of the appliance opening", sortOrder: 2 },
      { key: "floor_protection_material", label: "Floor protection material is noncombustible and meets code requirements", sortOrder: 3 },
      { key: "overall_clearances", label: "All clearances from the appliance, connector, and chimney to combustibles are met", nfpaRef: "A.15.4 (1)", sortOrder: 4 },
    ],
  },
  {
    key: "chimney_interior",
    title: "Chimney Interior / Flue",
    sortOrder: 5,
    items: [
      { key: "video_scan_performed", label: "Video/camera scan of the flue was performed", sortOrder: 1 },
      { key: "liner_present", label: "Flue liner is present and continuous throughout the entire flue system", nfpaRef: "A.15.4 (4)", sortOrder: 2 },
      { key: "liner_condition", label: "Flue liner is free of cracks, spalling, missing sections, or structural defects", nfpaRef: "A.15.4 (2)", sortOrder: 3 },
      { key: "liner_joints", label: "Liner joints and mortar are intact with no open gaps or displaced sections", sortOrder: 4 },
      { key: "flue_clear", label: "Flue is free of obstructions, bird/animal nests, debris, and excessive creosote buildup", sortOrder: 5 },
      { key: "creosote_level", label: "Creosote accumulation is within acceptable limits (Stage 1 or minimal Stage 2)", sortOrder: 6 },
      { key: "flue_sizing", label: "Flue cross-sectional area is appropriate for the appliance(s) served", nfpaRef: "A.15.4 (7)", sortOrder: 7 },
      { key: "smoke_chamber", label: "Smoke chamber walls are smooth, parged, and free of open mortar joints or cracks", sortOrder: 8 },
      { key: "damper_operation", label: "Damper opens, closes, and seals properly; hardware is in serviceable condition", sortOrder: 9 },
      { key: "firebox_condition", label: "Firebox walls, floor, and joints are free of cracks and deterioration", sortOrder: 10 },
      { key: "firebox_clearances", label: "Firebox clearances to combustibles meet applicable codes", sortOrder: 11 },
    ],
  },
  {
    key: "cleanout",
    title: "Clean-Out",
    sortOrder: 6,
    items: [
      { key: "cleanout_present", label: "Clean-out door or access is present at the base of the flue", sortOrder: 1 },
      { key: "cleanout_accessible", label: "Clean-out is accessible and operable", sortOrder: 2 },
      { key: "cleanout_condition", label: "Clean-out door and frame are in serviceable condition with no missing or damaged components", sortOrder: 3 },
      { key: "cleanout_sealed", label: "Clean-out door seals effectively; no gaps that could allow air infiltration or combustion gas spillage", sortOrder: 4 },
    ],
  },
  {
    key: "attic_crawl",
    title: "Attic, Basement, and Crawl Space",
    sortOrder: 7,
    items: [
      { key: "firestopping_present", label: "Proper firestopping is installed where the chimney passes through floor assemblies", nfpaRef: "A.15.4 (18)", sortOrder: 1 },
      { key: "attic_clearances", label: "Required clearances from chimney masonry to combustible framing are maintained in the attic", nfpaRef: "A.15.4 (1)", sortOrder: 2 },
      { key: "attic_chimney_condition", label: "Chimney masonry is in good condition in attic and crawl space areas", nfpaRef: "A.15.4 (2)", sortOrder: 3 },
      { key: "attic_liner_visible", label: "Flue liner, if visible in the attic, shows no cracks, gaps, or displacement", sortOrder: 4 },
      { key: "basement_cleanout", label: "Basement or below-grade chimney sections and cleanout areas are in good condition", sortOrder: 5 },
    ],
  },
  {
    key: "top_of_chimney",
    title: "Top of Chimney",
    sortOrder: 8,
    items: [
      { key: "chimney_height", label: "Chimney extends at least 3 feet above the highest point of roof penetration and 2 feet above any roof surface within 10 feet (NFPA 211 §12.6)", nfpaRef: "A.15.4 (15)", sortOrder: 1 },
      { key: "chimney_crown", label: "Chimney crown/wash is present, intact, and properly sloped to shed water away from the liner", nfpaRef: "A.15.4 (13)", sortOrder: 2 },
      { key: "crown_condition", label: "Crown is free of cracks, crazing, or spalling that could allow water penetration", sortOrder: 3 },
      { key: "flashing_present", label: "Flashing and counterflashing are present at the chimney-roof intersection", nfpaRef: "A.15.4 (14)", sortOrder: 4 },
      { key: "flashing_condition", label: "Flashing is properly sealed, free of gaps, rust, or separations from the masonry", sortOrder: 5 },
      { key: "cricket_required", label: "Cricket or saddle is present where required (chimney wider than 30 inches and on the uphill side)", sortOrder: 6 },
      { key: "rain_cap", label: "Chimney cap/rain cover is present and in serviceable condition", nfpaRef: "A.15.4 (16)", sortOrder: 7 },
      { key: "spark_arrestor", label: "Spark arrestor screen is present, undamaged, and free of blockage (where required)", nfpaRef: "A.15.4 (17)", sortOrder: 8 },
      { key: "liner_termination", label: "Flue liner terminates properly at or above the top of the chimney with required clearance from crown", sortOrder: 9 },
    ],
  },
  {
    key: "exterior_masonry",
    title: "Exterior Masonry",
    sortOrder: 9,
    items: [
      { key: "mortar_joints", label: "Mortar joints are intact, fully filled, and free of erosion, gaps, or open joints", nfpaRef: "A.15.4 (2)", sortOrder: 1 },
      { key: "brick_stone_condition", label: "Brick or stone units are free of significant spalling, cracking, or displacement", nfpaRef: "A.15.4 (2)", sortOrder: 2 },
      { key: "efflorescence", label: "Exterior masonry shows no active efflorescence (white mineral deposits) indicating moisture intrusion", sortOrder: 3 },
      { key: "structural_integrity", label: "Chimney is structurally sound and plumb with no visible lean or separation from the structure", sortOrder: 4 },
      { key: "chimney_staining", label: "No signs of staining, sooting, or smoke tracking on the exterior that indicate combustion gas leakage", sortOrder: 5 },
    ],
  },
  {
    key: "glass_doors_accessories",
    title: "Glass Doors and Accessories",
    sortOrder: 10,
    items: [
      { key: "glass_doors_listed", label: "Glass doors or enclosures are listed/approved for the appliance or fireplace", nfpaRef: "A.15.4 (21)", sortOrder: 1 },
      { key: "glass_doors_condition", label: "Glass panels are intact with no cracks; frames and hardware are in serviceable condition", sortOrder: 2 },
      { key: "glass_doors_clearances", label: "Glass door assembly does not obstruct required combustion air or reduce firebox clearances below minimums", sortOrder: 3 },
      { key: "ash_dump", label: "Ash dump door (if present) closes and seals properly", sortOrder: 4 },
      { key: "fireplace_screen", label: "Fireplace screen (if present) is functional and in good condition", sortOrder: 5 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY-BUILT FIREPLACE — Level II (NFPA 211 A.15.4 + CSIA SOP)
// ─────────────────────────────────────────────────────────────────────────────
export const factoryBuiltTemplate: TemplateSection[] = [
  {
    key: "fireplace_unit",
    title: "Fireplace Unit",
    sortOrder: 1,
    items: [
      { key: "unit_listed", label: "Fireplace unit is a listed/labeled factory-built appliance installed per manufacturer instructions", nfpaRef: "A.15.4 (20)", sortOrder: 1 },
      { key: "unit_condition", label: "Fireplace unit (firebox, outer shell, and visible components) is in apparent good condition with no visible damage", sortOrder: 2 },
      { key: "unit_clearances", label: "Clearances to combustibles around the fireplace unit meet manufacturer specifications", nfpaRef: "A.15.4 (1)", sortOrder: 3 },
      { key: "combustion_air", label: "Combustion air supply to the firebox is adequate and unobstructed", sortOrder: 4 },
    ],
  },
  {
    key: "glass_doors_fb",
    title: "Glass Doors and Combustion Air",
    sortOrder: 2,
    items: [
      { key: "glass_doors_listed", label: "Glass doors are listed for use with this specific fireplace make and model", nfpaRef: "A.15.4 (21)", sortOrder: 1 },
      { key: "glass_doors_condition", label: "Glass panels are free of cracks; frames, gaskets, and hardware are in serviceable condition", sortOrder: 2 },
      { key: "glass_doors_operation", label: "Glass doors open, close, and latch properly", sortOrder: 3 },
      { key: "outside_air_kit", label: "Outside combustion air kit is installed and functional (if required by model or applicable code)", sortOrder: 4 },
    ],
  },
  {
    key: "hearth_extension",
    title: "Hearth Extension",
    sortOrder: 3,
    items: [
      { key: "hearth_present", label: "Noncombustible hearth extension is present in front of and alongside the fireplace opening", sortOrder: 1 },
      { key: "hearth_dimensions", label: "Hearth extension dimensions meet the requirements of NFPA 211 and the manufacturer's listing", sortOrder: 2 },
      { key: "hearth_condition", label: "Hearth extension material is in good condition with no cracks, loose tiles, or gaps", sortOrder: 3 },
    ],
  },
  {
    key: "chimney_pipe",
    title: "Factory-Built Chimney / Pipe Assembly",
    sortOrder: 4,
    items: [
      { key: "pipe_listed", label: "All chimney pipe sections are listed and approved for use with this fireplace unit", nfpaRef: "A.15.4 (20)", sortOrder: 1 },
      { key: "pipe_same_mfr", label: "Chimney pipe sections are from the same manufacturer and system as the fireplace unit (no mixing of systems)", sortOrder: 2 },
      { key: "pipe_assembly", label: "All pipe sections are fully engaged and properly locked per manufacturer instructions", nfpaRef: "A.15.4 (22)", sortOrder: 3 },
      { key: "pipe_clearances", label: "Required clearances to combustibles are maintained along the entire chimney pipe assembly", nfpaRef: "A.15.4 (1)", sortOrder: 4 },
      { key: "pipe_support", label: "Chimney pipe is properly supported per manufacturer requirements with no unsupported spans", nfpaRef: "A.15.4 (25)", sortOrder: 5 },
      { key: "video_scan", label: "Video/camera scan of the chimney flue was performed", sortOrder: 6 },
      { key: "flue_clear", label: "Flue is free of obstructions, nesting materials, debris, and significant creosote buildup", sortOrder: 7 },
      { key: "flue_sizing", label: "Flue dimensions are correct for the fireplace as specified by the manufacturer", nfpaRef: "A.15.4 (7)", sortOrder: 8 },
    ],
  },
  {
    key: "attic_inspection",
    title: "Attic Inspection",
    sortOrder: 5,
    items: [
      { key: "attic_accessible", label: "Attic was accessible for inspection", sortOrder: 1 },
      { key: "insulation_shield", label: "Listed attic insulation shield is installed where the chimney passes through the attic floor", nfpaRef: "A.15.4 (23)", sortOrder: 2 },
      { key: "insulation_shield_condition", label: "Insulation shield is in good condition and properly secured", sortOrder: 3 },
      { key: "attic_clearances", label: "Required clearances from the chimney pipe to combustible framing are maintained throughout the attic", nfpaRef: "A.15.4 (1)", sortOrder: 4 },
      { key: "attic_pipe_condition", label: "Chimney pipe sections visible in the attic are in good condition with no dents, damage, or disconnections", sortOrder: 5 },
      { key: "firestopping", label: "Proper firestopping is installed where the chimney penetrates each floor and ceiling assembly", nfpaRef: "A.15.4 (18)", sortOrder: 6 },
    ],
  },
  {
    key: "top_of_chimney_fb",
    title: "Top of Chimney",
    sortOrder: 6,
    items: [
      { key: "chimney_height", label: "Chimney terminates at required height: minimum 3 feet above roof penetration and 2 feet above any roof surface within 10 feet", nfpaRef: "A.15.4 (15)", sortOrder: 1 },
      { key: "storm_collar", label: "Storm collar is present, properly installed, and sealed to prevent water intrusion", nfpaRef: "A.15.4 (27)", sortOrder: 2 },
      { key: "rain_cap", label: "Listed rain cap/termination cap is installed per manufacturer instructions", nfpaRef: "A.15.4 (26)", sortOrder: 3 },
      { key: "rain_cap_condition", label: "Rain cap screen is intact, free of blockage, and in serviceable condition", sortOrder: 4 },
      { key: "flashing", label: "Flashing is properly installed at the roof penetration and adequately sealed", nfpaRef: "A.15.4 (14)", sortOrder: 5 },
      { key: "chase_pan", label: "Chase pan/cover (if present) is properly installed, sloped to drain, and free of rust, holes, or standing water", sortOrder: 6 },
    ],
  },
  {
    key: "exterior_chase",
    title: "Exterior Chase",
    sortOrder: 7,
    items: [
      { key: "chase_structure", label: "Chase framing and exterior cladding are in apparent good condition with no visible damage or deterioration", sortOrder: 1 },
      { key: "chase_cover", label: "Chase top cover is properly installed and in good condition (if applicable)", sortOrder: 2 },
      { key: "chase_siding", label: "Exterior siding or cladding of the chase is free of significant damage, gaps, or moisture intrusion indicators", sortOrder: 3 },
      { key: "chase_clearances", label: "Chase framing maintains required clearances to the factory-built chimney pipe throughout", sortOrder: 4 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export function getTemplate(chimneyType: "masonry" | "factory_built") {
  return chimneyType === "masonry" ? masonryTemplate : factoryBuiltTemplate;
}

export const resultLabels: Record<ItemResult, string> = {
  pass: "Satisfactory",
  deficient: "Deficient",
  not_applicable: "N/A",
  not_accessible: "Not Accessible",
};

export const resultColors: Record<ItemResult, string> = {
  pass: "text-green-700 bg-green-50 border-green-200",
  deficient: "text-red-700 bg-red-50 border-red-200",
  not_applicable: "text-gray-500 bg-gray-50 border-gray-200",
  not_accessible: "text-yellow-700 bg-yellow-50 border-yellow-200",
};

export const FUEL_TYPES = [
  { value: "natural_gas", label: "Natural Gas" },
  { value: "propane", label: "Propane (LP)" },
  { value: "oil", label: "Fuel Oil" },
  { value: "wood", label: "Wood" },
  { value: "pellet", label: "Wood Pellet" },
  { value: "coal", label: "Coal" },
  { value: "gas_logs", label: "Gas Logs" },
  { value: "other", label: "Other" },
];

export const APPLIANCE_TYPES = [
  { value: "fireplace", label: "Fireplace (Open)" },
  { value: "fireplace_insert", label: "Fireplace Insert" },
  { value: "wood_stove", label: "Wood Stove / Freestanding Stove" },
  { value: "gas_appliance", label: "Gas Appliance / Log Set" },
  { value: "furnace", label: "Furnace" },
  { value: "boiler", label: "Boiler" },
  { value: "water_heater", label: "Water Heater" },
  { value: "other", label: "Other" },
];

export const LINER_TYPES = [
  { value: "clay_tile", label: "Clay Tile (Terracotta)" },
  { value: "cast_in_place", label: "Cast-In-Place (Poured Liner)" },
  { value: "metal_liner", label: "Metal Liner (Flexible or Rigid)" },
  { value: "none", label: "No Liner Present" },
  { value: "unknown", label: "Unable to Determine" },
];

export const OVERALL_CONDITIONS = [
  {
    value: "satisfactory",
    label: "Satisfactory",
    description: "No deficiencies observed. System is in proper working condition.",
  },
  {
    value: "unsatisfactory",
    label: "Unsatisfactory — Service Required",
    description:
      "One or more deficiencies were identified. System should not be operated until repairs are completed.",
  },
  {
    value: "further_evaluation",
    label: "Further Evaluation Required",
    description:
      "Conditions were observed that warrant additional investigation or a Level III inspection.",
  },
];
