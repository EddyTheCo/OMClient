#pragma once
#include"omclient.hpp"
#include<QObject>
#include<QJsonObject>
#include <QtQml/qqmlregistration.h>
#include <QtCore/QtGlobal>


class OMQML_EXPORT OMQMLData : public QObject
{
    Q_OBJECT

    Q_PROPERTY(QJsonObject  current_weather MEMBER m_current_weather NOTIFY current_weatherChanged)
    Q_PROPERTY(float  latitude MEMBER m_latitude NOTIFY positionChanged)
    Q_PROPERTY(float  longitude MEMBER m_longitude NOTIFY positionChanged)
    Q_PROPERTY(QString  temperature_unit MEMBER m_temperature_unit NOTIFY temperature_unitChanged)


    QML_ELEMENT

public:
    OMQMLData(QObject *parent = nullptr);
    void restart();
    Q_INVOKABLE void get_current_weather(void);
signals:
    void current_weatherChanged();
    void code_pictureChanged();
    void temperature_unitChanged();
    void positionChanged();
private:

    QJsonObject m_current_weather;
    OMClient* m_omclient;
    float m_latitude,m_longitude;
    QString m_temperature_unit,m_code_picture;
};

