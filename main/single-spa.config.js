import appConfig from './app.config.js';
import startFetchHtml from './fetchProjectIndexJsName.js';
function isActive(location,page) {
    let isShow = false;
    if(location.hash.startsWith(`#${page}`)){
        isShow = true
    }
    return isShow;
}
function activeFns(app) {
    return function (location) {
        return isActive(location,app.path)
    }
}

function bootstrapApp() {
    // 注册应用
    Promise.all([System.import('single-spa')]).then(modules => {
        const singleSpa = modules[0];
        registerApp(singleSpa,appConfig);
        singleSpa.start();
    })
}
// 注册项目
function registerApp(singleSpa,projects) {
    projects.forEach(function (project) {
        function start(app) {
            // 确保应用挂载点在页面中存在
            if(!app.domID || document.getElementById(app.domID)) {
                singleSpa.registerApplication(project.name,
                    () => System.import(project.main),
                    project.base ? (function () { return true }) : activeFns(project))
            } else {
                setTimeout(function () {
                    start(app);
                },50)
            }
        }

        start(project);
    })
}


bootstrapApp();

startFetchHtml(appConfig)
