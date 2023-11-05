#version 440
#define PI 3.1415926538
#define LIGHTREP 9.0
#define SUNCOLOR vec3(1.0, 1.0, 0.0)

#define BLUR 0.02
#define SUNR1 0.2
#define SUNR2 0.25
#define SUNR3 0.35
#define SUNW  0.35

layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;

layout(std140, binding = 0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    vec2 pixelStep;
    float iTime;
};
layout(binding = 1) uniform sampler2D src;



float sun(float r, float a)
{
    float f= smoothstep(SUNR2-BLUR,SUNR2,r) - smoothstep(SUNR3+0.01*sin(2.0*iTime)-BLUR,SUNR3+0.01*sin(2.0*iTime),r);
    f*= smoothstep(0.0,BLUR,-2.0*SUNW+sin(LIGHTREP*a+iTime));
    f+=1.0-smoothstep(SUNR1-BLUR,SUNR1,r);
    return f;
}
void main( void)
{
    vec2 uv=vec2(qt_TexCoord0.x*2.0-1.0,1.0-qt_TexCoord0.y*2.0);
    uv.x *= pixelStep.y/pixelStep.x;

    float f=sun(length(uv),atan(uv.x,uv.y));

    f = clamp(f,0.0,1.0);

    vec3 fcolor=SUNCOLOR*f;

    vec4 bcolor=texture(src, uv).rgba;
    fragColor=mix(bcolor, vec4(fcolor,1.0), f);


}

