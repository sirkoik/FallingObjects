const envs = {
  'winterForest': [
      'Winter_Forest/WinterForest_Env.hdr',
      'Winter_Forest/WinterForest_8k.jpg'
  ],
  'snowyPark': [
      'Snowy_Park/snowy_park_01_1k.hdr',
      'Snowy_Park/snowy_park_01.jpg'
  ],
  'snowyForestPath': [
      'Snowy_Forest_Path/snowy_forest_path_02_2k.hdr',
      'Snowy_Forest_Path/snowy_forest_path_02_e.jpg'
  ],
  'snowyForestPath4k': [
      'Snowy_Forest_Path/snowy_forest_path_02_4k.hdr',
  ],
  'white': [
      'Snowy_Forest_Path/white.png',
  ]
};

export const HDR_BG = `./resources/environments/${envs['snowyForestPath'][0]}`;
export const SPHERE_ENVMAP = `./resources/environments/{${envs['snowyForestPath'][1]}`;