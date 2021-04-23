precision highp float;

uniform sampler2D tMap;
uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uVelocity;
varying vec2 vUv;

void main(){

    vec2 cursor=vUv-uMouse;

    cursor.x*=uAspect;

    vec3 stamp=vec3(uVelocity*vec2(1,-1),1.-pow(1.-min(1.,length(uVelocity)),3.));
    float falloff=smoothstep(uFalloff,0.,length(cursor))*uAlpha;

    vec2 moveUv = vec2(0.0, 0.0);
    moveUv.x = vUv.x + falloff / 30.;
    moveUv.y = vUv.y + falloff / 30.;
    // vUv.x += (falloff * 10.);
    // vUv.y += (falloff * 10.);
    vec4 color=texture2D(tMap,moveUv)*uDissipation;
    // color.rgb=mix(color.rgb,stamp,vec3(falloff));
    
    gl_FragColor=color;
}