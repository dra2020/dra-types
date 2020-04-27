export const DefaultColorNames: string[] = 
[
'GhostWhite',
'Blue',
'Green',
'DarkMagenta',
'Red',
'Gold',
'Teal',
'Chocolate',   //'DarkGray',     // 
'SlateBlue',
'Cyan',
'DeepPink',
'Chartreuse',
'CornflowerBlue',
'DarkSalmon',
'Olive',
'DarkOrange',
'Lime',
'DarkSlateBlue',
'Yellow',
'YellowGreen',
'Pink',
'Maroon',
'Sienna',
'Aquamarine',
'Indigo',
'PaleVioletRed',
'Navy',   // 'Gray',       //     
'SpringGreen',
'Plum',
'DarkSeaGreen',
'LightCoral',
'Khaki',
'OrangeRed',
'RoyalBlue',
'LimeGreen',
'DarkOrchid',
'Orange',
'DodgerBlue',
'MediumAquamarine',
'Moccasin',
'Firebrick',
'LightSteelBlue',
'LawnGreen',
'Magenta',
'MediumVioletRed',
'Turquoise',
'Tomato',
'Thistle',
'SandyBrown',
'IndianRed',
'PowderBlue',
'SaddleBrown',
'OliveDrab',
'Fuchsia',      // 'Gainsboro',    //
'PeachPuff',
'RosyBrown',
];

export interface ColorLookup
{
    [key: string]: string;
}

export const ColorValues: ColorLookup =
{
  'AliceBlue': '#F0F8FF',
  'AntiqueWhite': '#FAEBD7',
  'Aqua': '#00FFFF',
  'Aquamarine': '#7FFFD4',
  'Azure': '#F0FFFF',
  'Beige': '#F5F5DC',
  'Bisque': '#FFE4C4',
  'Black': '#000000',
  'BlanchedAlmond': '#FFEBCD',
  'Blue': '#0000FF',
  'BlueViolet': '#8A2BE2',
  'Brown': '#A52A2A',
  'BurlyWood': '#DEB887',
  'CadetBlue': '#5F9EA0',
  'Chartreuse': '#7FFF00',
  'Chocolate': '#D2691E',
  'Coral': '#FF7F50',
  'CornflowerBlue': '#6495ED',
  'Cornsilk': '#FFF8DC',
  'Crimson': '#DC143C',
  'Cyan': '#00FFFF',
  'DarkBlue': '#00008B',
  'DarkCyan': '#008B8B',
  'DarkGoldenrod': '#B8860B',
  'DarkGray': '#A9A9A9',
  'DarkGreen': '#006400',
  'DarkKhaki': '#BDB76B',
  'DarkMagenta': '#8B008B',
  'DarkOliveGreen': '#556B2F',
  'DarkOrange': '#FF8C00',
  'DarkOrchid': '#9932CC',
  'DarkRed': '#8B0000',
  'DarkSalmon': '#E9967A',
  'DarkSeaGreen': '#8FBC8F',
  'DarkSlateBlue': '#483D8B',
  'DarkSlateGray': '#2F4F4F',
  'DarkTurquoise': '#00CED1',
  'DarkViolet': '#9400D3',
  'DeepPink': '#FF1493',
  'DeepSkyBlue': '#00BFFF',
  'DimGray': '#696969',
  'DodgerBlue': '#1E90FF',
  'Firebrick': '#B22222',
  'FloralWhite': '#FFFAF0',
  'ForestGreen': '#228B22',
  'Fuchsia': '#FF00FF',
  'Gainsboro': '#DCDCDC',
  'GhostWhite': '#F8F8FF',
  'Gold': '#FFD700',
  'Goldenrod': '#DAA520',
  'Gray': '#808080',
  'Green': '#008000',
  'GreenYellow': '#ADFF2F',
  'Honeydew': '#F0FFF0',
  'HotPink': '#FF69B4',
  'IndianRed': '#CD5C5C',
  'Indigo': '#4B0082',
  'Ivory': '#FFFFF0',
  'Khaki': '#F0E68C',
  'Lavender': '#E6E6FA',
  'LavenderBlush': '#FFF0F5',
  'LawnGreen': '#7CFC00',
  'LemonChiffon': '#FFFACD',
  'LightBlue': '#ADD8E6',
  'LightCoral': '#F08080',
  'LightCyan': '#E0FFFF',
  'LightGoldenrodYellow': '#FAFAD2',
  'LightGray': '#D3D3D3',
  'LightGreen': '#90EE90',
  'LightPink': '#FFB6C1',
  'LightSalmon': '#FFA07A',
  'LightSeaGreen': '#20B2AA',
  'LightSkyBlue': '#87CEFA',
  'LightSlateGray': '#778899',
  'LightSteelBlue': '#B0C4DE',
  'LightYellow': '#FFFFE0',
  'Lime': '#00FF00',
  'LimeGreen': '#32CD32',
  'Linen': '#FAF0E6',
  'Magenta': '#FF00FF',
  'Maroon': '#800000',
  'MediumAquamarine': '#66CDAA',
  'MediumBlue': '#0000CD',
  'MediumOrchid': '#BA55D3',
  'MediumPurple': '#9370DB',
  'MediumSeaGreen': '#3CB371',
  'MediumSlateBlue': '#7B68EE',
  'MediumSpringGreen': '#00FA9A',
  'MediumTurquoise': '#48D1CC',
  'MediumVioletRed': '#C71585',
  'MidnightBlue': '#191970',
  'MintCream': '#F5FFFA',
  'MistyRose': '#FFE4E1',
  'Moccasin': '#FFE4B5',
  'NavajoWhite': '#FFDEAD',
  'Navy': '#000080',
  'OldLace': '#FDF5E6',
  'Olive': '#808000',
  'OliveDrab': '#6B8E23',
  'Orange': '#FFA500',
  'OrangeRed': '#FF4500',
  'Orchid': '#DA70D6',
  'PaleGoldenrod': '#EEE8AA',
  'PaleGreen': '#98FB98',
  'PaleTurquoise': '#AFEEEE',
  'PaleVioletRed': '#DB7093',
  'PapayaWhip': '#FFEFD5',
  'PeachPuff': '#FFDAB9',
  'Peru': '#CD853F',
  'Pink': '#FFC0CB',
  'Plum': '#DDA0DD',
  'PowderBlue': '#B0E0E6',
  'Purple': '#800080',
  'Red': '#FF0000',
  'RosyBrown': '#BC8F8F',
  'RoyalBlue': '#4169E1',
  'SaddleBrown': '#8B4513',
  'Salmon': '#FA8072',
  'SandyBrown': '#F4A460',
  'SeaGreen': '#2E8B57',
  'SeaShell': '#FFF5EE',
  'Sienna': '#A0522D',
  'Silver': '#C0C0C0',
  'SkyBlue': '#87CEEB',
  'SlateBlue': '#6A5ACD',
  'SlateGray': '#708090',
  'Snow': '#FFFAFA',
  'SpringGreen': '#00FF7F',
  'SteelBlue': '#4682B4',
  'Tan': '#D2B48C',
  'Teal': '#008080',
  'Thistle': '#D8BFD8',
  'Tomato': '#FF6347',
  'Turquoise': '#40E0D0',
  'Violet': '#EE82EE',
  'Wheat': '#F5DEB3',
  'White': '#FFFFFF',
  'WhiteSmoke': '#F5F5F5',
  'Yellow': '#FFFF00',
  'YellowGreen': '#9ACD32',
};

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

export const EthnicBackgroundColor: string[] = [
    '#c0392b', // solid white
    '#3498db', // solid black
    '#2ecc71', // solid hispanic
    '#9b59b6', // solid asian
    '#d98880', // mostly white
    '#aed6f1', // mostly black
    '#abebc6', // mostly hispanic
    '#bb8fce', // mostly asian
    '#f1c40f', // mostly native
    '#aab7b8', // mix
    '#d5f5e3', // hispanic / white
    '#d6eaf8', // black / white
    '#186a3b', // hispanic / black
    '#e8daef', // asian / white
    '#45b39d', // asian / hispanic
    '#4a235a', // black / asian
  ];
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
export const EthnicLabel: string[] = [
    'Solid White',
    'Solid Black',
    'Solid Hispanic',
    'Solid Asian',
    'Mostly White',
    'Mostly Black',
    'Mostly Hispanic',
    'Mostly Asian',
    'Mostly Native',
    'Mixed',
    'Hispanic / White Mix',
    'Black / White Mix',
    'Hispanic / Black Mix',
    'Asian / White Mix',
    'Asian / Hispanic Mix',
    'Black / Asian Mix'
  ];

export const ColorByGreatR = 0;
export const ColorByGoodR = 1;
export const ColorByFairR = 2;
export const ColorByEven = 3;
export const ColorByFairD = 4;
export const ColorByGoodD = 5;
export const ColorByGreatD = 6;

export const ElectionBackgroundColor: string[] = [
  '#CF0000', // greatR
  '#FF4555', // goodR
  '#FFB0CB', // fairR
  '#9932CC', // even
  '#87CEEB', // fairD
  '#1E90FF', // goodD
  '#0000CF', // greatD
];

export const ElectionTextColor: string[] = [
  '#ffffff',
  '#000000',
  '#000000',
  '#ffffff',
  '#000000',
  '#000000',
  '#ffffff',
];
export const ElectionLabel: string[] = [
  'Great Republican',
  'Good Republican',
  'Fair Republican',
  'Even',
  'Fair Democrat',
  'Good Democrat',
  'Great Democrat'
  ];

const lum: number[] = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 255];
export let IntensityBackgroundColor: string[] = [];
lum.forEach((n: number) => { IntensityBackgroundColor.push(`rgba(${n}, ${n}, ${n}, 1.0)`) } );
