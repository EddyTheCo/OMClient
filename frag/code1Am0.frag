#version 440
#define PI 3.1415926538
#define LIGHTREP 9
#define SUNCOLOR vec3(1.0, 1.0, 0.0)
#define WHITECLOUD vec3(0.95, 0.95, 0.95)

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
float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}
float cloud(vec2 uv, vec2 p,float width,float height)
{
    float f=1.0-smoothstep(0.0,BLUR,
                           sdRoundedBox(uv-p,vec2(width,height/2.5),vec4(min(width,height)*0.4)));
    f+=Circle(uv,p+vec2(-width*0.33,height/2.1),width/2.2);
    f+=Circle(uv,p+vec2(width*0.33,height/2.1),width/2.9);
    return clamp(f,0.0,1.0);
}
void main( void)
{
    vec2 uv=vec2(qt_TexCoord0.x*2.0-1.0,1.0-qt_TexCoord0.y*2.0);
    uv.x *= pixelStep.y/pixelStep.x;

    vec2 p=vec2(0.0);
    float f=moon(uv,vec2(0.17,0.15),0.3+0.007*sin(3.0*iTime),
                 0.6+0.1*sin(3.0*iTime));

    f+=1.0-smoothstep(-0.01,0.01,sdStar5(uv-vec2(-0.35,-0.0),0.1+0.01*sin(2.0*iTime),0.48));
    f+=1.0-smoothstep(-0.01,0.01,sdStar5(uv-vec2(0.3,0.3),0.05/(1.0+abs(sin(1.1*iTime))),0.48));

    vec3 suncolor=SUNCOLOR*f;


    float fcloud=cloud(uv,vec2(0.0,-0.2)+
                       vec2(0.01*sin(3.0*iTime),0.0),0.4,0.4);
    vec3 cloudcolor=WHITECLOUD*fcloud;

    vec3 fcolor = mix(suncolor,cloudcolor,fcloud);

    vec4 bcolor=texture(src, uv).rgba;
    fragColor=mix(bcolor, vec4(fcolor,1.0), f+fcloud);

}

