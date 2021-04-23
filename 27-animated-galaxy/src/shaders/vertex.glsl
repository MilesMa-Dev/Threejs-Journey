attribute float aScale;
attribute vec3 aRandomness;

uniform float uSize;
uniform float uTime;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angle = atan(position.x, position.z);
    float distanceToCenter = length(position.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale * ( 1.0 / - viewPosition.z );

    vColor = color;
}