// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// uniform vec2 uFrequency;
// uniform float uTime;

// attribute vec3 position;
// attribute float aRandom;
// attribute vec2 uv;

// varying float vRandom;
// varying vec2 vUv;

// void main()
// {
    //     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //     // modelPosition.z = aRandom * 0.1;
    //     modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    //     modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    //     modelPosition.y *= 0.5;
    
    //     vec4 viewPosition = viewMatrix * modelPosition;
    //     vec4 projectedPosition = projectionMatrix * viewPosition;
    
    //     gl_Position = projectedPosition;
    
    //     vRandom = aRandom;
    //     vUv = uv;
// }

#define PI 3.1415926535897932384626433832795
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uAngle;
uniform float uProgress;

varying vec2 vUv;

mat4 rotationMatrix(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
    
    return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
    0.,0.,0.,1.);
}

vec3 rotate(vec3 v,vec3 axis,float angle){
    return(rotationMatrix(axis,angle)*vec4(v,1.)).xyz;
}

void main(){
    vUv=uv;
    float rad=.1;
    float rolls=4.;
    float finalAngle=uAngle-0.*.3*sin(uProgress*6.);
    vec3 newPosition=position;newPosition=rotate(newPosition-vec3(-.5,.5,0.),vec3(0.,0.,1.),-finalAngle)+vec3(-.5,.5,0.);
    float offset=(newPosition.x+.5)/(sin(finalAngle)+cos(finalAngle));
    float progress=clamp((uProgress-offset*.99)/.01,0.,1.);
    newPosition.z=rad+rad*(1.-offset/2.)*sin(-offset*rolls*PI-.5*PI);
    newPosition.x=-.5+rad*(1.-offset/2.)*cos(-offset*rolls*PI+.5*PI);
    newPosition=rotate(newPosition-vec3(-.5,.5,0.),vec3(0.,0.,1.),finalAngle)+vec3(-.5,.5,0.);
    newPosition=rotate(newPosition-vec3(-.5,.5,rad),vec3(sin(finalAngle),cos(finalAngle),0.),-PI*uProgress*rolls);
    newPosition+=vec3(-.5+uProgress*cos(finalAngle)*(sin(finalAngle)+cos(finalAngle)),.5-uProgress*sin(finalAngle)*(sin(finalAngle)+cos(finalAngle)),rad*(1.-uProgress/2.));
    newPosition=mix(newPosition,position,progress);gl_Position=projectionMatrix*modelViewMatrix*vec4(newPosition,1.);
}