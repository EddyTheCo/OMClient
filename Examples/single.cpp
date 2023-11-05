#include <QGuiApplication>
#include <QQmlApplicationEngine>


#include <QtCore/QtGlobal>
#if defined(WINDOWS_OMONI)
# define OMONI_EXPORT Q_DECL_EXPORT
#else
#define OMONI_EXPORT Q_DECL_IMPORT
#endif

class OMONI_EXPORT ShaderSel : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString shadder READ getshadder CONSTANT)

    QML_ELEMENT
    QML_SINGLETON

public:
    ShaderSel(QObject *parent = nullptr):QObject(parent){};

    QString getshadder()const{return SHADER;}

};


int main(int argc, char *argv[])
{
	QGuiApplication app(argc, argv);

	QQmlApplicationEngine engine;

	engine.addImportPath("qrc:/esterVtech.com/imports");
	qDebug()<<engine.importPathList();

	const QUrl url(u"qrc:/esterVtech.com/imports/App/qml/single.qml"_qs);

	// Load the main QML file
	engine.load(url);

	return app.exec();
}
