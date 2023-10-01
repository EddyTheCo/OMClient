#pragma once

#include <QNetworkAccessManager>
#include <QtCore/QtGlobal>
#include <QNetworkReply>
#include <QJsonValue>

#if defined(WINDOWS_OMQML)
# define OMQML_EXPORT Q_DECL_EXPORT
#else
#define OMQML_EXPORT Q_DECL_IMPORT
#endif

class OMQML_EXPORT OMResponse: public QObject
{
    Q_OBJECT
public:
    OMResponse(QNetworkReply *thereply);
    void fill();
    void error_found(QNetworkReply::NetworkError code);
signals:
    void returned( QJsonValue data );
private:
    QNetworkReply *reply;

};

class OMQML_EXPORT OMClient: public QObject
{

    Q_OBJECT
public:
    OMClient(QObject *parent = nullptr);
    enum ClientState {
        Disconnected = 0,
        Connected
    };

    OMResponse*  get_reply_rest(const QString& path, const QString &query=QString())const;
    void setAPIUrl(const QUrl apiUrl);

signals:
    void stateChanged();

private:
    void set_State(ClientState state_m){if(state_m!=state_){state_=state_m;emit stateChanged();}}
    QUrl m_ApiUrl;
    QNetworkAccessManager* nam;
    ClientState state_;
};


