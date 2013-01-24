Jaggi
============

Aggregator's blueprints


Manual for jaggi
Jaggi
Структура файлов/папок в проекте
blocks
   -includes
	-%file_name%.js
%pages_folder_name%
    -%page_folder_name%
	-%page_name.blocks.js%
 
%file_name%.js  содержит «настройки» от куда и по какому протоколу брать json, работает не зависимо от расширения (в примере в конце json), для http и https папаметр call используется http
Пример:
module.exports = {
    call : 'http',
    params : {
        url : 'https://api.twitter.com/1/trends/1.json'
    }
};
Параметры, которые можно добавлять (в поле params)
-data  
-method
-headers
-maxRedirects
-url 
-dataType

Методы Jaggi:
create():  в параметры передается объект,  обязательный параметр call, не обязательный timeout (нс)
в call пишеться  имя объекта из которого вынимать данные, а также в «каких количествах»
пример 1:
            call : {
                A : { //имя
                    call : function(_, promise) { //вызывается при завершении
                        promise.fulfill('A done'); 
                    },
                    toState : {
                        'A-1-res' : '.'
                    }
                }
}
Пример2: 
{
    call : {
                'feeds' : {
                    include : 'includes/feeds.js',//тут указываеться файл с описанием (см выше %file_name%.js)
                    timeout : 10000, //таймаут можно указывать для каждого вложения call
                    pointer : '.[:5]'//количество результатов, которое надо вернуть, также можно указать какие именно результаты нужно вернуть
                }
            },
            timeout : 10000,
            done : function(res, _, promise) {
                promise.fulfill(somefunc(res.feeds, res.users));
            }
        }
    },
    timeout : 20000
}
Пример3: 
{
    call : {
        'top-trends' : {
            call : {
                'trends' : {
                    include : 'includes/trends.js',
                    timeout : 10000,
                    toState : { trends : '.trends[:3]' },
                    pointer : '.trends[:3]'
                },

                'tweets' : {
                    deps : 'trends',  //указываем зависимость от trends
                    guard : 'trends',
                    params : function(ctx) {
                        return { trends : ctx.state('trends') };
                    },
                    call : function(params) {
                        return params.trends.map(function(trend) {
                            return {
                                include : 'includes/tweets.js',
                                timeout : 10000,
                                params  : function() {
                                    var res = this.__base();
                                    res.data = { q : trend.query };
                                    return res;
                                },
                                pointer : '.results[:3]'
                            }
                        });
                    },
                    timeout : 10000
                }
            },
            timeout : 10000,
            done : function(res, _, promise) {
                promise.fulfillsomefunc(res.trends, res.tweets));
            }
        }
    },
    timeout : 20000
};

run(): запускает выполнение
then(): принимает управление, в параметр передается калбэк
