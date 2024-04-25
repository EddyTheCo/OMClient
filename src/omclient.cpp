#include "omclient.hpp"
#include <QJsonDocument>
#include <QJsonObject>

QHash<OMClient::TempUnit, QString> OMClient::tempUnitStr = {
    std::make_pair(OMClient::Celsius, "celsius"),
    std::make_pair(OMClient::Fahrenheit, "fahrenheit")};

OMClient::OMClient(QObject *parent)
    : QObject(parent), m_nam(new QNetworkAccessManager(this)),
      m_apiUrl("https://api.open-meteo.com"), m_latitude(41.902229),
      m_longitude(12.458100), m_tempUnit(Celsius) {
  connect(this, &OMClient::positionChanged, this, &OMClient::getCurrentWeather);
};
void OMClient::getCurrentWeather(void) {
  QString query =
      "latitude=" + QString::number(m_latitude) +
      "&longitude=" + QString::number(m_longitude) +
      "&current_weather=true&temperature_unit=" + tempUnitStr[m_tempUnit];
  auto rply = getReplyRest("/v1/forecast", query);
  connect(rply, &OMResponse::returned, this, [=](QJsonValue data) {
    if (!data["current_weather"].toObject().isEmpty()) {
      m_currentWeather = data["current_weather"].toObject();
      emit currentWeatherChanged();
    }
    rply->deleteLater();
  });
}

void OMClient::setAPIUrl(const QUrl apiUrl) {
  if (apiUrl != m_apiUrl && apiUrl.isValid()) {
    m_apiUrl = apiUrl;
    emit apiUrlChanged();
  }
}

OMResponse *OMClient::getReplyRest(const QString &path,
                                   const QString &query) const {
  QUrl InfoUrl = m_apiUrl;
  InfoUrl.setPath(path);
  if (!query.isNull())
    InfoUrl.setQuery(query);
  auto request = QNetworkRequest(InfoUrl);
  request.setAttribute(QNetworkRequest::UseCredentialsAttribute, false);
  return new OMResponse(m_nam->get(request));
}
OMResponse::OMResponse(QNetworkReply *reply) : m_reply(reply) {
  QObject::connect(reply, &QNetworkReply::finished, this, &OMResponse::fill);
  QObject::connect(reply, &QNetworkReply::errorOccurred, this,
                   &OMResponse::errorFound);
}
void OMResponse::fill() {
  if (!m_reply->error()) {
    QByteArray response_data = m_reply->readAll();
    auto data = (QJsonDocument::fromJson(response_data)).object();
    emit returned(data);
  }
  m_reply->deleteLater();
}
void OMResponse::errorFound(QNetworkReply::NetworkError code) {
  auto errorreply = m_reply->errorString();
  qDebug() << "Error:" << errorreply;
  qDebug() << "code:" << code;
  qDebug() << "errorfound" << m_reply->readAll();
}
