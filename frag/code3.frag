#version 440
#define PI 3.1415926538
#define LIGHTREP 9
#define SUNCOLOR vec3(1.0, 1.0, 0.0)
#define WHITECLOUD vec3(0.95, 0.95, 0.95)
#define GRAYCLOUD vec3(0.5, 0.5, 0.5)
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


float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}
float cloud(vec2 uv, vec2 p,float width,float height)
{
    float f=1.0-smoothstep(-BLUR,BLUR,
                           sdRoundedBox(uv-p,vec2(width,height/2.5),vec4(min(width,height)*0.4)));
    f+=Circle(uv,p+vec2(-width*0.33,height/2.1),width/2.2);
    f+=Circle(uv,p+vec2(width*0.33,height/2.1),width/2.9);
    return clamp(f,0.0,1.0);
}
void main( void)
{
    vec2 uv=vec2(qt_TexCoord0.x*2.0-1.0,1.0-qt_TexCoord0.y*2.0);
    uv.x *= pixelStep.y/pixelStep.x;


    float f=cloud(uv,vec2(-0.1,-0.2)+
                  vec2(0.01*sin(3.0*iTime),0.0),0.3,0.3);
    f+=cloud(uv,vec2(0.3,-0.1)+
                  vec2(0.01*cos(3.0*iTime),0.0),0.3,0.3);
    f=clamp(0.0,1.0,f);
    vec3 fcolor= GRAYCLOUD*f;

    vec4 bcolor=texture(src, uv).rgba;
    fragColor=mix(bcolor, vec4(fcolor,1.0), f);

}

