uniform vec3 glowColor;
varying float intensity;
void main() {
    vec3 glow = glowColor * intensity * 0.5;
    gl_FragColor = vec4(glow, 10.0);
}