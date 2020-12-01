import * as ColorData from "./colordata";

let ColorTable: string[] = null;
const MaxColors: number = 100;

export function genColor(i: number, useFirstColor: boolean): string
{
  // i is district number, 0 => District[0] (unassigned), so subtract 1 to access ColorTable
  function gen_table(): void
  {
    ColorTable = [];
    for (let i: number = 0; i < MaxColors; i++)
    {
      // A little funky math below to skip the first (white) color
      let j = (i % (ColorData.DefaultColorNames.length - 1)) + 1;
      ColorTable.push(ColorData.ColorValues[ColorData.DefaultColorNames[j]]);
    }
  }

  if (ColorTable == null)
    gen_table();
  
  if (i == 0)
    return ColorData.ColorValues[ColorData.DefaultColorNames[0]];
  return ColorTable[((i - 1) + (useFirstColor ? 0 : 1)) % MaxColors];
}
