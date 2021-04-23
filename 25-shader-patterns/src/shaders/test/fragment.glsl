varying vec2 vUv;

#define PI 3.1415927

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // Pattern 1
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // Pattern 2
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // Pattern 3
    // float strength = vUv.y;

    // Pattern 4
    // float strength = 1.0 - vUv.y;

    // Pattern 5
    // float strength = vUv.y * 10.0;

    // Pattern 6
    // float strength = mod(vUv.y * 10.0, 1.0);

    // Pattern 7
    // float strength = step(0.5, mod(vUv.y * 10.0, 1.0));

    // Pattern 8
    // float strength = step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 9
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));

    // Pattern 10
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) + step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 12
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 13
    // float padX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float padY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = padX + padY;

    // Pattern 14
    // float padX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float padY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = padX + padY;

    // Pattern 15
    // float strength = abs(vUv.x - 0.5);

    // Pattern 16
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // Pattern 17
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // Pattern 18
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Pattern 19
    // float pad1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float pad2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = pad1 * pad2;

    // Pattern 20
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // Pattern 21
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

    // Pattern 22
    // float strength = random(vUv);

    // Pattern 23
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );
    // float strength = random(gridUv);

    // Pattern 24
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0
    // );
    // float strength = random(gridUv);

    // Pattern 25
    // float strength = length(vUv);

    // Pattern 26
    // float strength = distance(vUv, vec2(0.5));

    // Pattern 27
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // Pattern 28
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // Pattern 29
    // vec2 vUv2 = vec2(
    //     vUv.x * 0.1 + 0.45,
    //     vUv.y * 0.5 + 0.25
    // );
    // float strength = 0.015 / distance(vUv2, vec2(0.5));

    // Pattern 30
    // float pad1 = 0.015 / distance(vec2(vUv.x * 0.1 + 0.45,vUv.y * 0.5 + 0.25), vec2(0.5));
    // float pad2 = 0.015 / distance(vec2(vUv.x * 0.5 + 0.25,vUv.y * 0.1 + 0.45), vec2(0.5));
    // float strength = pad1 * pad2;

    // Pattern 31
    // vec2 rvUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // float pad1 = 0.015 / distance(vec2(rvUv.x * 0.1 + 0.45,rvUv.y * 0.5 + 0.25), vec2(0.5));
    // float pad2 = 0.015 / distance(vec2(rvUv.x * 0.5 + 0.25,rvUv.y * 0.1 + 0.45), vec2(0.5));
    // float strength = pad1 * pad2;

    // Pattern 32
    // float strength = step(0.2, distance(vUv, vec2(0.5)));

    // Pattern 33
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // Pattern 34
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // Pattern 35
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 36
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 37
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 38
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // Pattern 39
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;

    // Pattern 40
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // Pattern 41
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = mod(angle*20.0, 1.0);

    // Pattern 42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 100.0);

    // Pattern 43
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float radius = sin(angle * 100.0) * 0.02 + 0.25;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // Pattern 44
    // float strength = cnoise(vUv * 10.0);

    // Pattern 45
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // Pattern 46
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // Pattern 47
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // Pattern 48
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    vec3 mixedColor = mix(vec3(0.0), vec3(vUv, 1.0), strength);
    gl_FragColor = vec4(mixedColor, 1.0);
}