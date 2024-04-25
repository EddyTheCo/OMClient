#pragma once

#include <QJsonObject>
#include <QJsonValue>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QtCore/QtGlobal>

#if defined(USE_QML)
#include <QtQml>
#endif

#if defined(WINDOWS_OMClient)
#define OMClient_EXPORT Q_DECL_EXPORT
#else
#define OMClient_EXPORT Q_DECL_IMPORT
#endif

class OMClient_EXPORT OMResponse : public QObject {
  Q_OBJECT
public:
  OMResponse(QNetworkReply *thereply);
  int calc(int a, int b){return a+b;}
  int val;
  void fill();
  void errorFound(QNetworkReply::NetworkError code);
signals:
  void returned(QJsonValue data);

private:
  QNetworkReply *m_reply;
};

class OMClient_EXPORT OMClient : public QObject {
  Q_OBJECT
#if defined(USE_QML)
  Q_PROPERTY(QJsonObject currentWeather READ currentWeather NOTIFY
                 currentWeatherChanged)
  Q_PROPERTY(
      float latitude READ latitude WRITE setLatitude NOTIFY positionChanged)
  Q_PROPERTY(
      float longitude READ longitude WRITE setLongitude NOTIFY positionChanged)
  Q_PROPERTY(TempUnit tempUnit MEMBER m_tempUnit NOTIFY tempUnitChanged)
  Q_PROPERTY(QUrl apiUrl MEMBER m_apiUrl NOTIFY apiUrlChanged)
  QML_ELEMENT
#endif

public:
  OMClient(QObject *parent = nullptr);
  Q_INVOKABLE void getCurrentWeather(void);
  QJsonObject currentWeather() const { return m_currentWeather; }
  float latitude() const { return m_latitude; }
  float longitude() const { return m_longitude; }
  void setLatitude(float lat) {
    if (lat != m_latitude && lat >= -90 && lat <= 90) {
      m_latitude = lat;
      emit positionChanged();
    }
  }
  void setLongitude(float lon) {
    if (lon != m_longitude && lon >= -180 && lon <= 180) {
      m_longitude = lon;
      emit positionChanged();
    }
  }
  enum TempUnit { Celsius = 0, Fahrenheit };

  Q_ENUM(TempUnit)

  void setAPIUrl(const QUrl apiUrl);

signals:
  void currentWeatherChanged();
  void positionChanged();
  void tempUnitChanged();
  void apiUrlChanged();

private:
  OMResponse *getReplyRest(const QString &path,
                           const QString &query = QString()) const;
  QUrl m_apiUrl;
  QNetworkAccessManager *m_nam;
  QJsonObject m_currentWeather;
  float m_latitude, m_longitude;
  TempUnit m_tempUnit;
  static QHash<TempUnit, QString> tempUnitStr;
};
