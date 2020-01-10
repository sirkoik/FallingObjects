# FallingObjects
 Field of falling THREE.js objects

## Installing local server
ES6 modules don't like running locally with file://. Must use a local server to preview. See https://blogs.msdn.microsoft.com/cdndevs/2016/01/24/visual-studio-code-and-local-web-server/

 1. Open command window and type npm install
 2. To use live preview open command window and type npm start
 This will run lite-server.
 Requires that node.js be installed.
 
# Current tasks
<s>1. Getting object loader to work (working on promise implementation)</s>
    <s>1. Trying to get objects instead of promises.</s>
2. Making the field of falling objects even. (mostly done)
    1. Some objects seem to jump around.
    2. <s>Make objects fade in / fade out if they spawn within the viewport.</s>
3. 3d lighting / normal maps. Using "PMREM" to combine HDRi lighting with snowflakes. Looks good but I want to make the bg texture higher res.
    1. Make bg texture higher res.
    2. Re-implement fog.
4. (lower priority) Start running the animation before all snowflake models have loaded. Right now the Promises make sure that everything is loaded before starting the animation.
5. Add more snowflake models.
6. <s>Add bloom effect. https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html</s>

# Bugs
1. Convert equirectangular map to a cubemap. This will enable more customizable HDRI. Instructions at the end of this page:
https://threejsfundamentals.org/threejs/lessons/threejs-backgrounds.html
1. The snowflakes still look dark and don't seem to reflect light from the map, or if they're doing it, it's very faint. Try to get them to reflect light in a way similar to this example: https://threejs.org/examples/webgl_materials_variations_standard.html

# Parameters
* Randomizing the sign of the orientation doesn't seem to produce a better visual result, because snowflakes usually follow a current.
* Randomizing the scale of the snowflakes doesn't seem to make things look much more interesting.
* Possible to use a snowy IBL background with bump maps for the snowflakes? Making ambient light bluer doesn't seem to make it look better.

# Credits
Snow crystal images: www.snowcrystals.com
Winter forest (Slovakia): Blochi, http://hdrlabs.com/sibl/archive.html, 
Snowy park: Oliksiy Yakovlyev, https://hdrihaven.com/hdri/?c=nature&h=snowy_park_01
Snowy forest path: Oliksiy Yakovlyev, https://hdrihaven.com/hdri/?c=nature&h=snowy_forest_path_02

# Ideas
1. <a href="https://threejs.org/examples/?q=materials#webgl_materials_cubemap_balls_refraction">WebGL Cube refraction demo</a>: This one has spheres that refract the environment. Snowflakes might look nice, or might look dark.