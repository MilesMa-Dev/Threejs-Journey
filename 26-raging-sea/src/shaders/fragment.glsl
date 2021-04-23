uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorStrength;

varying float vElevation;
varying float vWaveElevation;
varying vec3 vPosition;

void main() {
    float mixedStrength = uColorStrength * vElevation * 1.0 / vWaveElevation;

    float alpha = smoothstep(0.5, 1.0, vPosition.y) + 0.5;
    float mixedMultipler = smoothstep(0.0, 1.0, vPosition.y);
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixedStrength * mixedMultipler);
    gl_FragColor = vec4(mixedColor, alpha);
}