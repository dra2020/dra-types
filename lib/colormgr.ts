// App libraries
import * as PF from "./packedfields";
import {isColorBy, parseColorBy, DatasetColor, DatasetFormat} from './datasets';
import {Util, Colors, Detail} from '@dra2020/baseclient'

// All Groups Mosaic has 16 colors
// Index values into the 16 colors
export const ColorBySolidWhite = 0;
export const ColorBySolidBlack = 1;
export const ColorBySolidHispanic = 2;
export const ColorBySolidAsian = 3;
export const ColorByMostlyWhite = 4;
export const ColorByMostlyBlack = 5;
export const ColorByMostlyHispanic = 6;
export const ColorByMostlyAsian = 7;
export const ColorByMostlyNative = 8;
export const ColorByMix = 9;
export const ColorByHispanicWhite = 10;
export const ColorByBlackWhite = 11;
export const ColorByHispanicBlack = 12;
export const ColorByAsianWhite = 13;
export const ColorByAsianHispanic = 14;
export const ColorByBlackAsian = 15;

// Text color for All Groups Mosaic (Legend)
export const EthnicTextColor: string[] = [
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#ffffff',
    '#000000',
    '#000000',
    '#ffffff',
  ];

export const ColorByGreatR = 0;
export const ColorByGoodR = 1;
export const ColorByFairR = 2;
export const ColorByEven = 3;
export const ColorByFairD = 4;
export const ColorByGoodD = 5;
export const ColorByGreatD = 6;


// ****************** Colors, Color Stops and Color Functions for "classic" palettes *******************
const PartisanFewStops = [
  0.00,  // Carmine
  0.20,  // 
  0.30,  // 
  0.40,  // 
  0.45,  //
  0.50,  // pale red
  0.50,  // pale blue
  0.55,  // 
  0.60,  // 
  0.70,  // 
  0.80,  // 
  1.00,  // Dark blue
];

// Like PartisanFewStops, but lose the gradient at two buckets at each edge to focus on competitive district differentiation
export let PartisanDistrictStops = [
  // Dark red
  //{ stop: 0.00,  color: '#8B0000' },  // Dark red
  //{ stop: 0.40,  color: '#8B0000' },  // .00 <= .40

  // Crimson
  //{ stop: 0.00,  color: '#DC143C' },  // Crimson
  //{ stop: 0.40,  color: '#DC143C' },  // .00 <= .40

  // Chilli Red
  //{ stop: 0.00,  color: '#C21807' },  // Chilli Red
  //{ stop: 0.40,  color: '#C21807' },  // .00 <= .40

  // Carmine
  0.00,  // Carmine
  0.40,  // .00 <= .40

  0.40,  // 
  0.45,  // .40 <= .45
  0.45,  //
  0.50,  // .45 <= .50
  0.50,  // 
  0.55,  // .50 <= .55
  0.55,  // 
  0.60,  // .55 <= .60
  0.60,  // 
  1.00,  // .60 <= 1.0
];

/*export let PartisanCustomStops = [
  { stop: 0.00,  color: '#FF0000' },  // Dark red
  { stop: 0.20,  color: '#FF0000' },  // 
  { stop: 0.30,  color: '#FF0000' },  // 
  { stop: 0.40,  color: '#CD5C5C' },  // Indian red
  { stop: 0.45,  color: '#DB7093' },  // Pale Violet Red
  { stop: 0.499, color: '#DB7093' },  // Light Pink
  { stop: 0.50,  color: '#FFFFFF' },  // white
  { stop: 0.501, color: '#87CEFA' },  // Light Sky Blue
  { stop: 0.55,  color: '#00bFFF' },  // Deep Sky Blue
  { stop: 0.60,  color: '#002366' },  // Royal Blue
  { stop: 0.70,  color: '#0000CD' },  // Medium Blue
  { stop: 0.80,  color: '#191970' },  // 
  { stop: 1.00,  color: '#191970' },  // Midnight Blue
];*/

export let PartisanPrecinctStops = PartisanFewStops;

export let EthnicFewStops = [
  0.00,  // 
  0.40,  // 
  0.50,  //
  1.00,  // 
];

export type PaletteDefaults = { [key: string]: string };
export const DefaultPaletteDefaults: PaletteDefaults = {
  partisanScale: 'partisanclassic',
  partisanDistrictsScale: 'partisandistrictsclassic',
  demographicsScale: 'demographicsclassic',
  demographicsAllGroups: 'allgroupsclassic',
  };

export function makeStops(stops: number[], colors: string[]): Util.Stop[]
{
  // Lengths should be equal
  const len: number = stops.length <= colors.length ? stops.length : colors.length;
  let result: Util.Stop[] = []
  for (let i = 0; i < len; i++)
    result.push({stop: stops[i], color: colors[i]});
  return result;
}

function partisanStops(stops: number[], pd: PaletteDefaults): Util.Stop[]
{
  const palette: PaletteName = pd['partisanScale'] as PaletteName;
  return makeStops(stops, colorsFromStopsPartisan(palette, 'partisanScale', stops));
}

function partisanDistrictStops(stops: number[], pd: PaletteDefaults): Util.Stop[]
{
  const palette: PaletteName = pd['partisanDistrictsScale'] as PaletteName;
  return makeStops(stops, colorsFromStopsPartisan(palette, 'partisanDistrictsScale', stops));
}

function ethnicStops(stops: number[], pd: PaletteDefaults): Util.Stop[]
{
  const palette: PaletteName = pd['demographicsScale'] as PaletteName;
  if (palette === 'demographicsclassic')
    return makeStops(stops, Colors.EthnicFewClassicColors);
  return makeStops(stops, colorsFromStops(palette, stops, Colors.EthnicFewClassicColors));
}

export function ethnicBackgroundColor(index: number, pd: PaletteDefaults): string
{
  const palette: PaletteName = pd['demographicsAllGroups'] as PaletteName;
  const colors: string[] = allGroups16Colors(palette, Colors.getPalette(palette));
  if (index < colors.length)
    return colors[index];
  return '#ffffff';
}

export function ToAllEthnicColor(agg: PF.PackedFields, dc: PF.DatasetContext, pd: PaletteDefaults): number
{
  // Use VAP/CVAP if it exists
  const did = dc.primeVDS ? dc.primeVDS : dc.primeDDS
  const builtin = dc.dsMeta[did]?.builtin || did;
  return AggregateEthnicColor(PF.ToGetter(agg, dc, did), pd, builtin.endsWith('NH'));
}

export function ToPartisanColorStr(agg: PF.PackedFields, dc: PF.DatasetContext, pd: PaletteDefaults): string
{
  return ToPartisanColor(agg, dc, partisanStops(PartisanPrecinctStops, pd));
}

export function ToPartisanDistrictColor(agg: PF.PackedFields, dc: PF.DatasetContext, pd: PaletteDefaults): string
{
  return ToPartisanColor(agg, dc, partisanDistrictStops(PartisanDistrictStops, pd));
}

function ToPartisanColor(agg: PF.PackedFields, dc: PF.DatasetContext, stops: Util.GradientStops): string
{
  const getter = PF.ToGetter(agg, dc, dc.primeEDS);
  return AggregatePartisanColorStr(getter, stops);
}

export function ToPartisanShiftColor(agg: PF.PackedFields, dc: PF.DatasetContext, datasets: string[], pd: PaletteDefaults, isDistrict?: boolean): string
{
  if (!datasets || datasets.length < 2)
    return '';

  const shift: number = PF.calcShift(agg, dc, datasets[0], datasets[1]);
  if (shift == null)
    return null;

  const defaultIsDistrict = isDistrict ?? false; // make the optional isDistrict parameter to false by default
  
  const rep: number = 0.5 - (shift / 2);
  const dem: number = 0.5 + (shift / 2);
  const stops: Util.GradientStops = defaultIsDistrict ? partisanDistrictStops(PartisanDistrictStops, pd) : partisanStops(PartisanPrecinctStops, pd);
  const color: string = ColorFromRGBPcts(rep, 0, dem, stops);
  // console.log('Shift (r, d, color): (' + rep + ', ' + dem + ', ' + color + ')');
  return color;
}

export function ToEthnicColorStr(agg: PF.PackedFields, dc: PF.DatasetContext, pd: PaletteDefaults, detail: string): string
{
  let ethnic: string = 'Wh';
  let total: string = 'Tot';
  let bInvert: boolean = false;
  const did = dc.primeVDS ? dc.primeVDS : dc.primeDDS;
  const builtin = dc.dsMeta[did]?.builtin || did;
  switch (detail)
  {
    case null: case '': case 'all':
      let c = ToAllEthnicColor(agg, dc, pd);   // special case 
      return c >= 0 ? ethnicBackgroundColor(c, pd) : '#ffffff';
    case 'white': ethnic = 'Wh'; break;
    case 'nonwhite': ethnic = 'Wh'; bInvert = true; break;
    case 'black': ethnic = builtin.endsWith('NH') ? 'Bl' : 'BlC'; break;
    case 'hisp': ethnic = 'His'; break;
    case 'native': ethnic = builtin.endsWith('NH') ? 'Nat' : 'NatC'; break;
    case 'asianpi': ethnic = 'AsnPI'; break;
    case 'asian': ethnic = builtin.endsWith('NH') ? 'Asn' : 'AsnC'; break;
    case 'pac': ethnic = builtin.endsWith('NH') ? 'Pac' : 'PacC'; break;
    case 'other': ethnic = 'OthAl'; break;
    case 'mix': ethnic = 'Mix'; break;
    default: break;
  }

  const getter = PF.ToGetter(agg, dc, did);
  let den = getter(total);
  let num = getter(ethnic);
  if (den === undefined || isNaN(den) || num === undefined || isNaN(num))
    return '#ffffff';

  if (den == 0)
    return '#ffffff';
  const pct = bInvert ? 1 - (num / den) : num / den;
  return Util.execGradient(ethnicStops(EthnicFewStops, pd), pct);
}

// All Groups Mosaic
export function AggregateEthnicColor(getter: PF.FieldGetter, pd: PaletteDefaults, nhAlone: boolean): number
{
  // Dataset should have 'Tot' field
  let totField = 'Tot';
  let totalPop = getter(totField);
  if (totalPop == 0) return -1;

  // Field names hard-coded
  let white: number = getter('Wh') / totalPop;
  let hisp: number = getter('His') / totalPop;
  let black: number = 0;
  let native: number = 0;
  let asianPI: number = 0;
  if (nhAlone)
  {
    black= getter('Bl') / totalPop;
    native = getter('Nat') / totalPop;
    asianPI = (getter('Asn') + getter('Pac')) / totalPop;
  }
  else
  {
    black= getter('BlC') / totalPop;
    native = getter('NatC') / totalPop;
    asianPI = (getter('AsnC') + getter('PacC')) / totalPop;
  }

  if (white >= 0.75)
    return ColorBySolidWhite;
  if (black >= 0.75)
    return ColorBySolidBlack;
  if (hisp >= 0.75)
    return ColorBySolidHispanic;
  if (asianPI >= 0.75)
    return ColorBySolidAsian;
  if (white >= 0.5 && black < 0.3 && hisp < 0.3 && native < 0.3 && asianPI < 0.3)
    return ColorByMostlyWhite;
  if (black >= 0.5 && white < 0.3 && hisp < 0.3 && native < 0.3 && asianPI < 0.3)
    return ColorByMostlyBlack;
  if (hisp >= 0.5 && white < 0.3 && black < 0.3 && native < 0.3 && asianPI < 0.3)
    return ColorByMostlyHispanic;
  if (asianPI >= 0.5 && white < 0.3 && black < 0.3 && native < 0.3 && hisp < 0.3)
    return ColorByMostlyAsian;
  if (native > 0.5)
    return ColorByMostlyNative;
  if (hisp >= 0.3 && white >= 0.3 && hisp + white > 0.75)
    return ColorByHispanicWhite;
  if (black >= 0.3 && white >= 0.3 && black + white > 0.75)
    return ColorByBlackWhite;
  if (hisp >= 0.3 && black >= 0.3 && hisp + black > 0.75)
    return ColorByHispanicBlack;
  if (asianPI >= 0.3 && white >= 0.3 && asianPI + white > 0.75)
    return ColorByAsianWhite;
  if (asianPI >= 0.3 && hisp >= 0.3 && asianPI + hisp > 0.75)
    return ColorByAsianHispanic;
  if (black >= 0.3 && asianPI >= 0.3 && black + asianPI > 0.75)
    return ColorByBlackAsian;
  return ColorByMix;
}

// This is used only for 2016_BG analytics, seemingly only for values, not colors (dave 12/9/21)
export function AggregatePartisanColor(getter: PF.FieldGetter): number
{
  // Dataset should have 'Tot' field
  let totField = 'Tot';
  let presTot = getter(totField);
  if (presTot == 0) return -1;

  // TODO: Field names hard-coded
  let presR = getter('R');
  let presD = getter(' D');

  if (presTot === undefined || presD === undefined || presR === undefined || presTot <= 0)
    return -1;

  let pctD = presD / presTot;
  let pctR = presR / presTot;
  let diff = pctD - pctR;
  if (diff < -0.20)
    return ColorByGreatR;
  if (diff < -0.10)
    return ColorByGoodR;
  if (diff < -0.02)
    return ColorByFairR;
  if (diff > 0.20)
    return ColorByGreatD;
  if (diff > 0.10)
    return ColorByGoodD;
  if (diff > 0.02)
    return ColorByFairD;
  return ColorByEven;
}

export function AggregatePartisanColorStr(getter: PF.FieldGetter, stops: Util.GradientStops): string
{
  // Dataset should have 'Tot' field
  let totField = 'Tot';
  let presTot = getter(totField);
  if (presTot == 0) return '';

  // TODO: Field names hard-coded
  let presR = getter('R');
  let presD = getter('D');

  if (presTot === undefined || presD === undefined || presR === undefined || presTot <= 0)
    return '';

  let pctD: number = presD / presTot;
  let pctR: number = presR / presTot;
  let pctOth: number = (presTot - presD - presR) / presTot;
  const color: string = ColorFromRGBPcts(pctR, pctOth, pctD, stops);
  //console.log('Agg (r, d, color): (' + pctR + ', ' + pctD + ', ' + color + ')');
  return color;
}

// This is the new gradient code
export function ColorFromRGBPcts(pctRed: number, pctGreen: number, pctBlue: number, stops: Util.GradientStops): string
{
  let pctTot = pctRed + pctBlue;
  if (pctTot == 0) return '#ffffff';
  pctBlue /= pctTot;
  return Util.execGradient(stops, pctBlue);
}

// ****************** End of "classic" palettes *****************

export type ColorUse = 'districts' | 'partisanScale' | 'demographicsScale' | 'demographicsAllGroups' | 'partisanDistrictsScale';

// Currently supported palettes
export const PaletteNames = ['jet_r', 'turbo_r', 'inferno_r', 'viridis_r', 'magma_r', 'plasma_r', 'Greys', 'bone_r',
  'draclassic', 'demographicsclassic', 'partisanclassic', 'allgroupsclassic', 'partisandistrictsclassic'] as const;
export type PaletteName = typeof PaletteNames[number];

export function colorsFromStops(palette: PaletteName, stops: number[], classicColors: string[]): string[]
{
  // Use classicColors to see where there are duplicate colors
  const allColors: string[] = Colors.getPalette(palette);
  let colors: string[] = [];
  for (let i = 0; i < stops.length; i++)
  {
    const stop: number =
      (i + 1 < classicColors.length && classicColors[i] == classicColors[i + 1]) ? (stops[i] + stops[i + 1]) / 2 :
      (i > 0 && i < classicColors.length && classicColors[i - 1] == classicColors[i]) ? (stops[i - 1] + stops[i]) / 2 : stops[i];
          
    let inx: number = Math.floor(allColors.length * stop);
    if (inx >= allColors.length) inx = allColors.length - 1;
    colors.push(allColors[inx]);
  }
  return colors;
}

export function colorsFromStopsPartisan(palette: PaletteName, colorUse: ColorUse, stops: number[]): string[]
{
  if (palette === 'partisanclassic')
    return Colors.PartisanPrecinctClassicColors;
  if (palette === 'partisandistrictsclassic')
    return Colors.PartisanDistrictClassicColors;

  // For partisanScale and partisanDistrictsScale; indexes match classic color pattern
  const allColors: string[] = Colors.getPalette(palette);
  if (allColors.length < Colors.MaxColors)
    return Colors.PartisanPrecinctClassicColors;      // Safety check; shouldn't happen

  let colors: string[] = [];

  const indexes: number[] = colorUse === 'partisanScale' ?
    [15, 27, 37, 47, 57, 67, 82, 92, 102, 112, 122, 134] : [15, 15, 37, 37, 47, 67, 82, 102, 122, 122, 134, 134];
  for (let i = 0; i < stops.length; i++)
  {
    colors.push(allColors[indexes[i]]);
  }
  return colors;
}

export function allGroups16Colors(palette: PaletteName, colors: string[])
{
  let modColors: string[] = [];
  //if (palette === 'allgroupsclassic')     // Only support classic for now
  {
    modColors.push(Colors.EthnicBackgroundColor[ColorBySolidWhite]);   // pos 0
    modColors.push(Colors.EthnicBackgroundColor[ColorBySolidBlack]);   // pos 1
    modColors.push(Colors.EthnicBackgroundColor[ColorBySolidHispanic]);// pos 2
    modColors.push(Colors.EthnicBackgroundColor[ColorBySolidAsian]);   // pos 3
    modColors.push(Colors.EthnicBackgroundColor[ColorByMostlyWhite]);  // pos 4
    modColors.push(Colors.EthnicBackgroundColor[ColorByMostlyBlack]);  // pos 5
    modColors.push(Colors.EthnicBackgroundColor[ColorByMostlyHispanic]);// pos 6
    modColors.push(Colors.EthnicBackgroundColor[ColorByMostlyAsian]);  // pos 7
    modColors.push(Colors.EthnicBackgroundColor[ColorByMostlyNative]); // pos 8
    modColors.push(Colors.EthnicBackgroundColor[ColorByMix]);          // pos 9
    modColors.push(Colors.EthnicBackgroundColor[ColorByHispanicWhite]);// pos 10
    modColors.push(Colors.EthnicBackgroundColor[ColorByBlackWhite]);   // pos 11
    modColors.push(Colors.EthnicBackgroundColor[ColorByHispanicBlack]);// pos 12
    modColors.push(Colors.EthnicBackgroundColor[ColorByAsianWhite]);   // pos 13
    modColors.push(Colors.EthnicBackgroundColor[ColorByAsianHispanic]);// pos 14
    modColors.push(Colors.EthnicBackgroundColor[ColorByBlackAsian]);   // pos 15
  }
  /*else if (palette === 'viridis_r' || palette === 'plasma_r')
  {
    modColors.push(colors[149]);
    modColors.push(colors[129]);
    modColors.push(colors[109]);
    modColors.push(colors[89]);
    modColors.push(colors[139]);
    modColors.push(colors[119]);
    modColors.push(colors[99]);
    modColors.push(colors[79]);
    modColors.push(colors[0]);
    modColors.push(colors[9]);
    modColors.push(colors[29]);
    modColors.push(colors[19]);
    modColors.push(colors[49]);
    modColors.push(colors[39]);
    modColors.push(colors[69]);
    modColors.push(colors[59]);    
  }
  else if (palette === 'magma_r')
  {
    modColors.push(colors[134]);
    modColors.push(colors[116]);
    modColors.push(colors[98]);
    modColors.push(colors[80]);
    modColors.push(colors[125]);
    modColors.push(colors[107]);
    modColors.push(colors[89]);
    modColors.push(colors[71]);
    modColors.push(colors[0]);
    modColors.push(colors[8]);
    modColors.push(colors[26]);
    modColors.push(colors[17]);
    modColors.push(colors[44]);
    modColors.push(colors[35]);
    modColors.push(colors[62]);
    modColors.push(colors[53]);    
  }*/
  return modColors;
}

export interface DistrictCache
{
  colorElection?: string;
  colorEthnic?: string;
  colorExtended?: string;
  colorSolid?: string;
}

// Color property we need out of the full DistrictProps
export interface ColorProp
{
  color: string,
}
export type ColorProps = Array<ColorProp>;

export interface DistrictColorParams
{
  datasetContext: PF.DatasetContext,
  mapColors: ColorProps,
  aggregates: PF.PackedFields[],
  paletteDefaults: PaletteDefaults,
  useFirstColor: boolean,
  usePalette: string,
  colorDistrictsBy: string,
  shiftDatasets?: string[],
}

function safeNumber(n: any): number { n = Number(n); return typeof n !== 'number' || isNaN(n) ? 0 : n }
function safeStops(s: string): number[]
{
  if (!s) return EthnicFewStops;
  return s.split(',').map(safeNumber);
}
function safeColors(s: string): string[]
{
  if (!s) return ['#fafafa', '#aaaaaa', '#666666', '#111111'];
  return s.split(',').map(s => s.trim());
}

export function ToExtendedColor(agg: PF.PackedFields, dc: PF.DatasetContext, colorBy: string): string
{
  // compute pct
  const {datasetid, field} = parseColorBy(colorBy);
  if (!datasetid || !field || !dc.dsMeta || !dc.dsMeta[datasetid])
    return '#ffffff';
  const meta = dc.dsMeta[datasetid];
  const dsfield = meta.fields ? meta.fields[field] : null;
  const dscolor = meta.colors ? meta.colors.find((c: DatasetColor) => c.shortCaption === field) : null;
  if (!dsfield && !dscolor)
    return '#ffffff';
  if (dscolor)
  {
    let stops = safeStops(dscolor.stops);
    let colors = safeColors(dscolor.colors);
    if (stops.length != colors.length)
    {
      stops = EthnicFewStops;
      colors = safeColors('');
    }
    let o: any = {};
    let getter = PF.ToGetter(agg, dc, datasetid);
    Object.keys(meta.fields).forEach(f => o[f] = getter(f));
    let formatter = new Detail.FormatDetail(dscolor.expr);
    let result = formatter.format(Detail.FormatDetail.prepare(o));
    let intensity = Math.min(Math.max(result.n || 0, 0), 1);
    return Util.execGradient(makeStops(stops, colors), intensity);
  }
  else
  {
    let getter = PF.ToGetter(agg, dc, datasetid);
    let fields = PF.sortedFieldList(meta);
    let den = 0;
    if (meta.fields['Tot'])
      den = getter('Tot');
    else
      fields.forEach(f => { den += getter(f) });
    let num = getter(field);

    // Careful...
    if (den == 0 || den === undefined || isNaN(den) || num === undefined || isNaN(num))
      return '#ffffff';

    return Util.execGradient(makeStops(EthnicFewStops, Colors.EthnicFewClassicColors), num / den);
  }
}

export function computeDistrictColors(params: DistrictColorParams): DistrictCache[]
{
  let dcNew: DistrictCache[] = [];
  for (let i: number = 0; i < params.aggregates.length; i++)
  {
    let agg = params.aggregates[i];
    let mapColor = i < params.mapColors.length ? params.mapColors[i].color : Colors.genColor(i, params.useFirstColor, params.usePalette);
    let dc: DistrictCache = {};

    // Compute election color and partisan color
    dc.colorEthnic = mapColor;
    dc.colorElection = ToPartisanDistrictColor(agg, params.datasetContext, params.paletteDefaults);

    switch (params.colorDistrictsBy)
    {
      case 'election':
        dc.colorSolid = dc.colorElection;
        break;
      case 'nonwhite':
      case 'hisp':
      case 'black':
      case 'native':
      case 'asian':
      case 'pac':
      case 'all':
        dc.colorEthnic = ToEthnicColorStr(agg, params.datasetContext, params.paletteDefaults, params.colorDistrictsBy);
        dc.colorSolid = dc.colorEthnic;
        break;
      case 'elecshift':
        if (params.shiftDatasets && params.shiftDatasets.length == 2) 
        {
          dc.colorSolid = ToPartisanShiftColor(agg, params.datasetContext, params.shiftDatasets, params.paletteDefaults, true);
        } 
        else 
        {
          dc.colorSolid = mapColor;
        }
        break;
      default:
        if (isColorBy(params.colorDistrictsBy))
        {
          dc.colorExtended = ToExtendedColor(agg, params.datasetContext, params.colorDistrictsBy);
          dc.colorSolid = dc.colorExtended;
        }
        else
          dc.colorSolid = mapColor;
        break;
    }
    dcNew.push(dc);
  }
  return dcNew;
}

// Dotmap support
export interface RGB { r: number, g: number, b: number };

export const BinRed = 0
export const BinOrangeRed = 1;
export const BinBrown = 2;
export const BinOrange = 3;
export const BinGold = 4;
export const BinYellow = 5;
export const BinGreenish = 6;
export const BinChartreuse = 7;
export const BinLime = 8;
export const BinMediumSpringGreen = 9;
export const BinCyan = 10;
export const BinLightBlue = 11;
export const BinBlue = 12;
export const BinBlueViolet = 13;
export const BinDarkViolet = 14;
export const BinMagenta = 15;
export const BinDeepPink = 16;
export const BinBlack = 17;

// Ethnic colors
export const BinEthnicWhite = BinLightBlue;
export const BinEthnicBlack = BinGreenish;
export const BinEthnicAsian = BinRed;
export const BinEthnicHispanic = BinOrange;
export const BinEthnicOther = BinBrown;

export const BinColorLookup: RGB[] = [
  { r: 0xff, g: 0x00, b: 0x00 },  // 0 - red
  { r: 0xff, g: 0x45, b: 0x00 },  // 1 - orange red
  { r: 0x99, g: 0x66, b: 0x33 },  // 2 - brown
  { r: 0xff, g: 0xaa, b: 0x00 },  // 3 - orange
  { r: 0xff, g: 0xd7, b: 0x00 },  // 4 - gold
  { r: 0xff, g: 0xd7, b: 0x00 },  // 5 - yellow
  { r: 0x9f, g: 0xd4, b: 0x00 },  // 6 - greenish
  { r: 0x7f, g: 0xff, b: 0x00 },  // 7 - chartreuse
  { r: 0x00, g: 0xff, b: 0x00 },  // 8 - lime
  { r: 0x00, g: 0xfa, b: 0x9a },  // 9 - medium spring green
  { r: 0x00, g: 0xff, b: 0xff },  // 10 - cyan
  { r: 0x73, g: 0xb2, b: 0xff },  // 11 - light blue
  { r: 0x00, g: 0x00, b: 0xff },  // 12 - blue
  { r: 0x8a, g: 0x2b, b: 0xe2 },  // 13 - blue violet
  { r: 0x94, g: 0x00, b: 0xd3 },  // 14 - dark violet
  { r: 0xff, g: 0x00, b: 0xff },  // 15 - magenta
  { r: 0xff, g: 0x14, b: 0x93 },  // 16 - deep pink
  { r: 0x00, g: 0x00, b: 0x00 },  // 17 - black
];

// Map ordering to Bin* lookup values
const ColorOrderEthnic = 'wbaho'; // abcde

// Map number of fields to color selection
export const FieldCountToColors: { [nfields: number]: number[] } = {
  [1]: [ BinBrown ],
  [2]: [ BinRed, BinBlue ],
  [3]: [ BinRed, BinBlue, BinBrown ],
  [4]: [ BinRed, BinBlue, BinBrown, BinGreenish ],
  [5]: [ BinLightBlue, BinGreenish, BinRed, BinOrange, BinBrown ],
  [6]: [ BinRed, BinBrown, BinGold, BinGreenish, BinLightBlue, BinBlueViolet ],
  [7]: [ BinRed, BinBrown, BinGold, BinBlueViolet, BinMagenta , BinGreenish, BinLightBlue ],
  [8]: [ BinRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta , BinGreenish, BinLightBlue ],
  [9]: [ BinRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta , BinGreenish, BinLightBlue, BinBlue ],
  [10]: [ BinRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta , BinGreenish, BinCyan, BinLightBlue, BinBlue ],
  [11]: [ BinRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta , BinGreenish, BinLime, BinCyan, BinLightBlue, BinBlue ],
  [12]: [ BinRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta, BinDeepPink, BinGreenish, BinMediumSpringGreen, BinCyan, BinLightBlue, BinBlue ],
  [13]: [ BinRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta, BinDeepPink, BinGreenish, BinLime, BinMediumSpringGreen, BinCyan, BinLightBlue, BinBlue ],
  [14]: [ BinRed, BinOrangeRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinMagenta, BinDeepPink, BinGreenish, BinLime, BinMediumSpringGreen, BinCyan, BinLightBlue, BinBlue ],
  [15]: [ BinRed, BinOrangeRed, BinBrown, BinOrange, BinGold, BinBlueViolet, BinDarkViolet, BinMagenta, BinDeepPink, BinGreenish, BinLime, BinMediumSpringGreen, BinCyan, BinLightBlue, BinBlue ],
  [16]: [ BinRed, BinOrangeRed, BinBrown, BinOrange, BinGold, BinYellow, BinBlueViolet, BinDarkViolet, BinMagenta, BinDeepPink, BinGreenish, BinLime, BinMediumSpringGreen, BinCyan, BinLightBlue, BinBlue ],
};
export const MaxFields = 16;


export function colorindexToRGB(colorindex: number): RGB
{
  return BinColorLookup[colorindex] || BinColorLookup[BinBrown];
}

export const ColorFlags = 'abcdefghijklmnopqrstuvwxyz';

export function colorflagToColorindex(nfields: number, colorflag: string): number
{
  let i = ColorFlags.indexOf(colorflag);
  return i >= 0 && nfields > 0 && nfields <= MaxFields ? FieldCountToColors[nfields][i] : BinBrown;
}

export function colororderToColorindex(nfields: number, order: number): number
{
  return order >= 0 && nfields > 0 && nfields <= MaxFields ? FieldCountToColors[nfields][order] : BinBrown;
}
