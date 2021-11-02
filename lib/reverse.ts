export function reverseBlockMapping(bm: any): any
{
  let rev: any = {};

  if (bm) Object.keys(bm).forEach(blockid => {
      let geoid = bm[blockid];
      if (! rev[geoid]) rev[geoid] = [];
      rev[geoid].push(blockid);
    });
  Object.values(rev).forEach((a: string[]) => a.sort());
  return rev;
}

export function reverseBlockgroupMapping(bm: any): any
{
  let rev: any = {};

  if (bm) Object.keys(bm).forEach(blockid => {
      let geoid = blockid.substr(0, 12);
      if (! rev[geoid]) rev[geoid] = [];
      rev[geoid].push(blockid);
    });
  return rev;
}
