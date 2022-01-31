# FallingObjects
 Snowfall
 
# Has
* Randomized field of falling objects with independent sizes and orientation / rotation vectors for each object.
* Re-generation that involves fading an object out and then fading it in again at a new location from above.
* Custom meshes that are pre-loaded and then cloned at random to generate the field.
* HDR IBL background.
* Unreal Engine-style bloom shader.
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
1. Scene moves more slowly on slower GPUs. Change animations to align to system clock.
2. Scene is slow in iOS Safari.

# Possible improvements
1. Convert equirectangular map to a cubemap. This will enable more customizable HDRI. Instructions at the end of this page:
https://threejsfundamentals.org/threejs/lessons/threejs-backgrounds.html

# Parameters
* Randomizing the sign of the orientation doesn't seem to produce a better visual result, because snowflakes usually follow a current.
* Randomizing the scale of the snowflakes doesn't seem to make things look much more interesting.
* Adding one point light dramatically improves the lighting. Adding more may or may not help.

# Updates
* Updated ThreeJS to r137.
* ThreeJS modules are now bundled and minified using Rollup. This resolves many security, performance, and compatibility problems that resulted from hosting the library itself in the repository. Based on the <a href="https://github.com/Mugen87/three-jsm">three-jsm</a> repo.

# Credits
Snow crystal images: www.snowcrystals.com
Winter forest (Slovakia): Blochi, http://hdrlabs.com/sibl/archive.html, 
Snowy park: Oliksiy Yakovlyev, https://hdrihaven.com/hdri/?c=nature&h=snowy_park_01
Snowy forest path: Oliksiy Yakovlyev, https://hdrihaven.com/hdri/?c=nature&h=snowy_forest_path_02

# References
1. <a href="https://threejs.org/examples/?q=materials#webgl_materials_cubemap_balls_refraction">WebGL Cube refraction demo</a>
2. <a href="https://threejs.org/examples/webgl_materials_variations_standard.html">Material variations demo</a>