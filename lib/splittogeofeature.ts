import * as geojson from 'geojson';
import { Util, Poly, G } from '@dra2020/baseclient';
import * as DT from './vfeature';

// Given the topology for a precinct and a split, compute the feature data for the virtual feature.
//

export function splitToGeoFeature(split: DT.SplitBlock, topoPrecinct: Poly.Topo, mbm: G.MultiBlockMapping): G.GeoFeature
{
  let f = Poly.topoMerge(topoPrecinct, split.blocks);
  if (!f) return f;

  let contiguity = new Util.IndexedArray();
  let block_contiguity = new Util.IndexedArray();
  f.properties.datasets = {};
  split.blocks.forEach(blockid => {
      let b = topoPrecinct.objects[blockid];
      if (b.properties.datasets)
        Util.deepAccum(f.properties.datasets, b.properties.datasets);
      if (b.properties.contiguity)
      {
        b.properties.contiguity.forEach((id: string) => {
            if (id === 'OUT_OF_STATE')
              contiguity.set(id);
            else
              mbm.multimap(id).forEach(geoid => contiguity.set(geoid));
          });
        b.properties.contiguity.forEach((id: string) => {
            block_contiguity.set(id);
          });
      }
    });
  split.blocks.forEach(blockid => block_contiguity.clear(blockid));
  f.properties.id = DT.splitToVgeoid(split);
  f.properties.name = `Part of ${split.geoid} from ${split.blocks.length} blocks`;
  f.properties.contiguity = contiguity.asArray();
  f.properties.block_contiguity = block_contiguity.asArray();
  f.properties.blocks = split.blocks;
  f.properties.mbmstamp = mbm.stamp;
  return f;
}
