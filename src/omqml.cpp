#include"omqml.hpp"
#include<QTimer>
OMQMLData::OMQMLData(QObject *parent):QObject(parent),m_latitude(41.902229),m_longitude(12.458100),
    m_omclient(new OMClient(this)),m_temperature_unit("celsius")
{
    QTimer* timer = new QTimer(this);
    connect(timer, &QTimer::timeout, this, &OMQMLData::get_current_weather);
    timer->start(1000*60);

}
void OMQMLData::restart()
{
    get_current_weather();
}
void OMQMLData::get_current_weather(void)
{
    QString query="latitude="+QString::number(m_latitude)+"&longitude="+QString::number(m_longitude)+
                    "&current_weather=true&temperature_unit="+m_temperature_unit;
    auto rply=m_omclient->get_reply_rest("/v1/forecast",query);
    connect(rply,&OMResponse::returned,this,[=](QJsonValue data){
        if(!data["current_weather"].toObject().isEmpty())
        {
            m_current_weather=data["current_weather"].toObject();
            emit current_weatherChanged();
        }
        rply->deleteLater();
    });
}

