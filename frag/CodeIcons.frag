#version 440
#define PI 3.1415926538
#define SUNCOLOR vec3(1.0, 1.0, 0.0)
#define GRAYCLOUD vec3(0.5, 0.5, 0.5)
#define WHITECLOUD vec3(0.95, 0.95, 0.95)

layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;

layout(std140, binding = 0) uniform buf {
        mat4 qt_Matrix;
        float qt_Opacity;
        vec2 pixelStep;
        float code;
        float am;
        float iTime;
};
layout(binding = 1) uniform sampler2D src;


float Circle(vec2 uv,vec2 p, float r,float blur)
{
        float d = length(uv-p);
        float c = smoothstep(r,r-blur,d);
        return c;
}

float sdOrientedBox( in vec2 p, in vec2 a, in vec2 b, float th )
{
    float l = length(b-a);
    vec2  d = (b-a)/l;
    vec2  q = (p-(a+b)*0.5);
          q = mat2(d.x,-d.y,d.y,d.x)*q;
          q = abs(q)-vec2(l,th)*0.5;
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0);
}
float sunlight(vec2 uv, vec2 p,float dcenter,float width, float height,
float rep,float blur)
{
    float angle=2.0*PI/rep;
    float f=0.0;
    for(float a=0.0;a<rep;a++ )
    {
       f+=1.0-smoothstep(-blur,blur,
    sdOrientedBox(uv,p+dcenter*vec2(cos(angle*a),sin(angle*a)),
    p+(dcenter+height)*vec2(cos(angle*a),sin(angle*a)),width));

    }


    return f;
}


float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}
float cloud(vec2 uv, vec2 p,float width,float height,float blur)
{
    float f=1.0-smoothstep(-blur,blur,
    sdRoundedBox(uv-p,vec2(width,height/2.5),vec4(min(width,height)*0.4)));
    f+=Circle(uv,p+vec2(-width*0.33,height/2.1),width/2.2,blur);
    f+=Circle(uv,p+vec2(width*0.33,height/2.1),width/2.9,blur);
    return clamp(f,0.0,1.0);
}
float sun(vec2 uv, vec2 p,float radius, float lightstart,
float lightheight,float lightwidth,float lightnumber,float blur)
{
    float f=Circle(uv,p,radius,blur);
    f+=sunlight(uv,p,lightstart,lightwidth,lightheight,lightnumber,0.01);
    return clamp(f,0.0,1.0);
}
float moon(vec2 uv, vec2 p,float radius,float angle,float blur)
{
    float f=Circle(uv,p,radius,blur);
    f-=Circle(uv,p+0.6*radius*vec2(cos(angle),sin(angle)),radius,blur);
    return clamp(f,0.0,1.0);
}
vec4 code_0_am(vec2 uv)
{
    float fsun=sun(uv,vec2(0.0),0.3+0.007*sin(3.0*iTime),0.35,
    0.15+0.01*sin(3.0*iTime),0.1,9.0,0.02);
    vec3 pict=SUNCOLOR*fsun;
    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), fsun);
    return color;
}
vec4 code_0_pm(vec2 uv)
{
    float fsun=moon(uv,vec2(0.0),0.4+0.007*sin(3.0*iTime),
    0.4+0.1*sin(3.0*iTime),0.01);
    vec3 pict=SUNCOLOR*fsun;

    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), fsun);
    return color;
}
vec4 code_1_am(vec2 uv)
{
    float fsun=sun(uv,vec2(0.17,0.10),0.2+0.007*sin(3.0*iTime),0.25,
    0.08+0.007*sin(3.0*iTime),0.05,9.0,0.01);
    vec3 suncolor=SUNCOLOR*fsun;
    float fcloud=cloud(uv,vec2(0.0,-0.2)+
    vec2(0.01*sin(3.0*iTime),0.0),0.4,0.4,0.01);
    vec3 cloudcolor=WHITECLOUD*fcloud;
    vec3 pict = mix(suncolor,cloudcolor,fcloud);
    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), clamp(0.0,1.0,fcloud+fsun));
    return color;
}
vec4 code_1_pm(vec2 uv)
{
    float fsun=moon(uv,vec2(0.17,0.15),0.3+0.007*sin(3.0*iTime),
    0.6+0.1*sin(3.0*iTime),0.01);
    vec3 suncolor=SUNCOLOR*fsun;
    float fcloud=cloud(uv,vec2(0.0,-0.2)+
    vec2(0.01*sin(3.0*iTime),0.0),0.4,0.4,0.01);
    vec3 cloudcolor=WHITECLOUD*fcloud;
    vec3 pict= mix(suncolor,cloudcolor,fcloud);
    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), clamp(0.0,1.0,fcloud+fsun));
    return color;
}
vec4 code_2_am(vec2 uv)
{
    float fsun=sun(uv,vec2(0.17,0.10),0.2+0.007*sin(3.0*iTime),0.25,
    0.08+0.007*sin(3.0*iTime),0.05,9.0,0.01);
    vec3 suncolor=SUNCOLOR*fsun;
    float fcloud=cloud(uv,vec2(-0.1,-0.2)+
    vec2(0.01*sin(3.0*iTime),0.0),0.3,0.3,0.01);
    fcloud+=cloud(uv,vec2(0.3,-0.1)+
    vec2(0.01*cos(3.0*iTime),0.0),0.3,0.3,0.01);
    fcloud=clamp(0.0,1.0,fcloud);

    float fcloud2=cloud(uv,vec2(0.2,-0.2)+
    vec2(0.02*cos(4.0*iTime),0.0),0.2,0.2,0.01);
    vec3 cloudback=GRAYCLOUD*fcloud;
    vec3 cloudfront=WHITECLOUD*fcloud2;
    vec3 cloudcolor=mix(cloudback,cloudfront,fcloud2);
    vec3 pict= mix(suncolor,cloudcolor,clamp(0.0,1.0,fcloud+fcloud2));

    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), clamp(0.0,1.0,fcloud+fcloud2+fsun));
    return color;
}
vec4 code_2_pm(vec2 uv)
{
    float fsun=moon(uv,vec2(0.17,0.15),0.3+0.007*sin(3.0*iTime),
    0.6+0.1*sin(3.0*iTime),0.01);
    vec3 suncolor=SUNCOLOR*fsun;
    float fcloud=cloud(uv,vec2(-0.1,-0.2)+
    vec2(0.01*sin(3.0*iTime),0.0),0.3,0.3,0.01);
    fcloud+=cloud(uv,vec2(0.3,-0.1)+
    vec2(0.01*cos(3.0*iTime),0.0),0.3,0.3,0.01);
    fcloud=clamp(0.0,1.0,fcloud);

    float fcloud2=cloud(uv,vec2(0.2,-0.2)+
    vec2(0.02*cos(4.0*iTime),0.0),0.2,0.2,0.01);
    vec3 cloudback=GRAYCLOUD*fcloud;
    vec3 cloudfront=WHITECLOUD*fcloud2;
    vec3 cloudcolor=mix(cloudback,cloudfront,fcloud2);
    vec3 pict= mix(suncolor,cloudcolor,clamp(0.0,1.0,fcloud+fcloud2));

    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), clamp(0.0,1.0,fcloud+fcloud2+fsun));
    return color;
}
vec4 code_3(vec2 uv)
{
    float fcloud=cloud(uv,vec2(-0.1,-0.2)+
    vec2(0.01*sin(3.0*iTime),0.0),0.3,0.3,0.01);
    fcloud+=cloud(uv,vec2(0.3,-0.1)+
    vec2(0.01*cos(3.0*iTime),0.0),0.3,0.3,0.01);
    fcloud=clamp(0.0,1.0,fcloud);

    vec3 pict=GRAYCLOUD*fcloud;

    vec4 bcolor=texture(src, uv).rgba;
    vec4 color=mix(bcolor, vec4(pict,1.0), clamp(0.0,1.0,fcloud));
    return color;
}
void main( void)
{
    vec2 uv=vec2(qt_TexCoord0.x*2.0-1.0,1.0-qt_TexCoord0.y*2.0);
    uv.x *= pixelStep.y/pixelStep.x;

    vec4 fcolor=vec4(0.0);

    if(code>0.0&&code<1.0)
    {
        if(am>1.0)
        fcolor=code_0_am(uv);
        else
        fcolor=code_0_pm(uv);
    }
    if(code>1.0&&code<2.0)
    {
        if(am>1.0)
        fcolor=code_1_am(uv);
        else
        fcolor=code_1_pm(uv);
    }
    if(code>2.0&&code<3.0)
    {
        if(am>1.0)
        fcolor=code_2_am(uv);
        else
        fcolor=code_2_pm(uv);
    }
    if(code>3.0&&code<4.0)
    {
        fcolor=code_3(uv);
    }


    fragColor = fcolor;

}

