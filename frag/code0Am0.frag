#version 440
#define PI 3.1415926538
#define LIGHTREP 9
#define SUNCOLOR vec3(1.0, 1.0, 0.0)

#define BLUR 0.02


layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;

layout(std140, binding = 0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    vec2 pixelStep;
    float iTime;
};
layout(binding = 1) uniform sampler2D src;


float Circle(vec2 uv,vec2 p, float r)
{
    float d = length(uv-p);
    float c = smoothstep(r,r-BLUR,d);
    return c;
}

float moon(vec2 uv, vec2 p,float radius,float angle)
{
    float f=Circle(uv,p,radius);
    f-=Circle(uv,p+0.6*radius*vec2(cos(angle),sin(angle)),radius);
    return clamp(f,0.0,1.0);
}
float sdStar5(in vec2 p, in float r, in float rf)
{
    const vec2 k1 = vec2(0.809016994375, -0.587785252292);
    const vec2 k2 = vec2(-k1.x,k1.y);
    p.x = abs(p.x);
    p -= 2.0*max(dot(k1,p),0.0)*k1;
    p -= 2.0*max(dot(k2,p),0.0)*k2;
    p.x = abs(p.x);
    p.y -= r;
    vec2 ba = rf*vec2(-k1.y,k1.x) - vec2(0,1);
    float h = clamp( dot(p,ba)/dot(ba,ba), 0.0, r );
    return length(p-ba*h) * sign(p.y*ba.x-p.x*ba.y);
}

void main( void)
{
    vec2 uv=vec2(qt_TexCoord0.x*2.0-1.0,1.0-qt_TexCoord0.y*2.0);
    uv.x *= pixelStep.y/pixelStep.x;

    vec2 p=vec2(0.0);
    float f=moon(uv,vec2(0.0),0.4+0.007*sin(3.0*iTime),
                 0.4+0.1*sin(3.0*iTime));

    f+=1.0-smoothstep(-0.01,0.01,sdStar5(uv-vec2(-0.55,-0.2),0.1+0.01*sin(2.0*iTime),0.48));
    f+=1.0-smoothstep(-0.01,0.01,sdStar5(uv-vec2(0.2,0.35),0.07/(1.0+abs(sin(1.1*iTime))),0.48));

    vec3 fcolor=SUNCOLOR*f;

    vec4 bcolor=texture(src, uv).rgba;
    fragColor=mix(bcolor, vec4(fcolor,1.0), f);

}

