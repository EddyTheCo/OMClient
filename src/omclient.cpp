#include<QJsonDocument>
#include<QJsonObject>
#include<iostream>
#include"omclient.hpp"

OMClient::OMClient(QObject *parent):QObject(parent),
    nam(new QNetworkAccessManager(this)),m_ApiUrl("https://api.open-meteo.com")
{

};

void OMClient::setAPIUrl(const QUrl apiUrl)
{

    if((apiUrl!=m_ApiUrl||state_!=Connected)&&apiUrl.isValid())
    {
        set_State(Disconnected);
        m_ApiUrl=apiUrl;
    }
}

OMResponse*  OMClient::get_reply_rest(const QString& path,const QString& query)const
{
    QUrl InfoUrl=m_ApiUrl;
    InfoUrl.setPath(path);
    if(!query.isNull())InfoUrl.setQuery(query);
    auto request=QNetworkRequest(InfoUrl);
    request.setAttribute(QNetworkRequest::UseCredentialsAttribute,false);
    return new OMResponse(nam->get(request));
}
OMResponse::OMResponse(QNetworkReply *thereply):reply(thereply)
{
    reply->setParent(this);
    QObject::connect(reply, &QNetworkReply::finished,this, &OMResponse::fill);
    QObject::connect(reply, &QNetworkReply::errorOccurred,this, &OMResponse::error_found);
}
void OMResponse::fill()
{
    if(!reply->error())
    {
        QByteArray response_data = reply->readAll();
        auto data = (QJsonDocument::fromJson(response_data)).object();
        qDebug()<<"data:"<<data;
        emit returned(data);
        reply->deleteLater();
    }
    else
    {
        reply->deleteLater();
    }

}
void OMResponse::error_found(QNetworkReply::NetworkError code)
{
    auto errorreply=reply->errorString();
    qDebug()<<"Error:"<<errorreply;
    qDebug()<<"code:"<<code;
    qDebug()<<"errorfound"<<reply->readAll();
}


