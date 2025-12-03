export function dxBaseCycle(dx: string): string
{
  return dx === '2016_BG' ? '2010_VD' : dx
}

export function dxValid(dx: string): string
{
  switch (dx)
  {
    case '2010_VD':
    case '2016_BG':
    case '2020_VD':
    case '2030_VD':
      return dx;
    default:
      return '';
  }
}

export interface SupportMap
{
  dataset: boolean,
  blockediting: boolean,
  citypainting: boolean,
}

export const Support: { [dx: string]: SupportMap } =
  {
    ['2010_VD']:
      {
        dataset: false,
        blockediting: false,
        citypainting: false,
      },
    ['2016_BG']:
      {
        dataset: false,
        blockediting: false,
        citypainting: false,
      },
    ['2020_VD']:
      {
        dataset: true,
        blockediting: true,
        citypainting: true,
      },
    ['2030_VD']:
      {
        dataset: true,
        blockediting: true,
        citypainting: true,
      },
    ['']:
      {
        dataset: false,
        blockediting: false,
        citypainting: false,
      },
  };

export function dxSupportsDataset(dx: string): boolean
{
  return Support[dxValid(dx)].dataset
}

export function dxSupportsBlockediting(dx: string): boolean
{
  return Support[dxValid(dx)].blockediting
}

export function dxSupportsCitypainting(dx: string): boolean
{
  return Support[dxValid(dx)].citypainting
}
