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
    2. Objects all rotate in the same direction - need to randomize rotation.
    3. Make objects fade in / fade out if they spawn within the viewport.
3. 3d lighting / bump maps. Bump maps can load, but I need to set up lights that can use them (right now I'm just using ambient light with a basic material)
4. (lower priority) Start running the animation before all snowflake models have loaded. Right now the Promises make sure that everything is loaded before starting the animation.

# Credits
Snow crystal images: www.snowcrystals.com