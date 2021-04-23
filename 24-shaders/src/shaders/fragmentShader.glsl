precision highp float;
varying vec2 vUv;
uniform float uAlpha;
uniform sampler2D tMap;
void main(){
    vec4 map=texture2D(tMap,vUv);
    map.a*=uAlpha;
    gl_FragColor=map;
}