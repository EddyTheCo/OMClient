#include<QObject>
#include<QString>

// https://doc.qt.io/qt-6/qtqml-cppintegration-definetypes.html#preconditions
#include<QtQml/qqmlregistration.h>

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
