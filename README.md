# FallingObjects
 Field of falling THREE.js objects
 
# Has
* Randomized field of falling objects with independent sizes and orientation / rotation vectors for each object.
* Re-generation that involves fading an object out and then fading it in again at a new location from above.
* Custom meshes that are pre-loaded and then cloned at random to generate the field.
* HDR IBL background.
* Unreal-style bloom shader.
* Fully pannable viewport.

# Current tasks
1. Making the field of falling objects even. (mostly done)
    1. Some objects seem to jump around.
1. 3d lighting / normal maps. Using "PMREM" to combine HDRi lighting with snowflakes. Looks good but I want to make the bg texture higher res.
    1. Make bg texture higher res. (bloom effect seems to help)
    2. Re-implement fog. (might not be feasible with image bg)
1. Make promises use async/await and show a progress bar before loading.
1. Add more snowflake models.

# Bugs
1. Convert equirectangular map to a cubemap. This will enable more customizable HDRI. Instructions at the end of this page:
https://threejsfundamentals.org/threejs/lessons/threejs-backgrounds.html

# Parameters
* Randomizing the sign of the orientation doesn't seem to produce a better visual result, because snowflakes usually follow a current.
* Randomizing the scale of the snowflakes doesn't seem to make things look much more interesting.
* Adding one point light dramatically improves the lighting. Adding more may or may not help.

## Installing local server
ES6 modules don't like running locally with file://. Must use a local server to preview. See https://blogs.msdn.microsoft.com/cdndevs/2016/01/24/visual-studio-code-and-local-web-server/

1. Open command window and type npm install
2. To use live preview open command window and type npm start
This will run lite-server.
Requires that node.js be installed.

# Credits
Snow crystal images: www.snowcrystals.com
Winter forest (Slovakia): Blochi, http://hdrlabs.com/sibl/archive.html, 
Snowy park: Oliksiy Yakovlyev, https://hdrihaven.com/hdri/?c=nature&h=snowy_park_01
Snowy forest path: Oliksiy Yakovlyev, https://hdrihaven.com/hdri/?c=nature&h=snowy_forest_path_02

# References
1. <a href="https://threejs.org/examples/?q=materials#webgl_materials_cubemap_balls_refraction">WebGL Cube refraction demo</a>
2. <a href="https://threejs.org/examples/webgl_materials_variations_standard.html">Material variations demo</a>