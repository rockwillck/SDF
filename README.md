# Yet-Another-Metaballs-Implementation (YAMI)
Metaballs. Gooey, gloopy, delicious metaballs. Traditional metaball implementations are painstakingly slow and compute intensive, and require optimization and algorithms like marching squares (or cubes) to run in real-time. So I present to you... **YAMI**, a pseudo-metaballs implementation that runs in real-time out of the box and can support any polygon, from circles to squares to hexagons to blocky drawings of dragons. The included demo is just two circles, but you can adjust the incredibly simple code however you'd like.
## The Method
There are, of course, many ways to calculate true metaballs. One of my favorite methods I've seen so far uses a charge function and a threshhold. But all of those methods require pixel by pixel - or in the case of marching square, cells that grow increasingly close to the size of a pixel as your resolution increases - rendering. With multithreading, interpolation, and other optimizations, metaballs *can* run in real-time. YAMI, however, will run in real time with passable accuracy without optimization, multiple threads, access to the GPU, or even pixel-by-pixel rendering! Instead, it employs a rough estimation of gravity.
### What? Gravity?
If you think about it, metaballs are a lot like balls of sand. If you treat them less as a shape and more as an amalgamation of particles, you can see how, by taking the center of a metaball as a source of gravity (or attraction), you could estimate where the particles should go. Then, by simply rendering the particles, you get something remarkably similar to metaballs without all the overhead of all those blank pixels.
## Pros v. Cons
### Pros
- YAMI is incredibly fast
- YAMI supports any polygon, unlike most metaball implementations
- YAMI's compute load increases at a slower late than other implementations
### Cons
- YAMI is not true metaballs, but rather a pseudo-metaball implementations
- YAMI breaks down especially horribly around high "goopiness values"
## Demo
You can play around with a dirt-simple YAMI demo [here](https://www.rockwill.dev/Yet-Another-Metaballs-Implementation/)
## License
The MIT License (MIT)
Copyright © 2023 <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
