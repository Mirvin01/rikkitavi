
function newRikitavi(options) {

    let _default = {
        root: 'rikitavi',
        sessionCache: true,
        localCache: false,
    };

    if (options.default) { _default = Object.assign(_default, options.default); }

    const _components = options.components;

    let _route = {};


    let _localStorage = localStorage.getItem('app'); // содержит обьект из localStorage с корневым узлом app: имя | ссылка
    let _sessionStorage = sessionStorage.getItem('app'); // содержит обьект из sessionStorage с корневым узлом app: имя | ссылка

    return {

        component(id) {
            return {
                init(callback){
                    callback();
                }
            }
        },

        R(root = _default.root) {
            let tags = document.querySelector(`#${root}`).getElementsByTagName('*');
            let parse = new DOMParser();

            for (let tag of tags) {
                let id = tag.getAttribute('include');
                let path = app.component().get(id);

                if (path) {
                    if (sessionStorage.getItem(path)) {
                        let html = parse.parseFromString(sessionStorage.getItem(path), 'text/html');
                        tag.append(html.querySelector('#' + id));
                        tag.removeAttribute('include');
                        tag.setAttribute('id', 'render-wrapper');
                    } else {
                        fetch(path).then(async (response) => {
                            let res = await response.text();
                            if (_default.sessionCache) { sessionStorage.setItem(path, res); }
                            let html = parse.parseFromString(res, 'text/html');
                            tag.append(html.querySelector('#' + id));
                        });
                        tag.removeAttribute('include');
                        tag.setAttribute('id', 'render-wrapper');
                        app.R();
                        return;
                    }
                }
            }
        },

        PLU(root = _default.root){
            
        },

        routing() {
            return {

                newRoute(path, callback) {
                    _route[path] = callback;
                },

                setRoute(path) {
                    // document.location.href = path;
                    let stateObj = { id: "100" };
                    window.history.pushState(stateObj, "Page 2", path);
                }
            }
        },

        state(component) {
            const state = {};
            const appState = {};

            return {

                get() { },

                set() { },

                delate() { }
            }
        },

        storage: {

            local(key) {
                return {

                    // content: JSON.parse(localStorage.getItem(_default.appId))[key],

                    get() {

                    },

                    set() {

                    },

                    remove() {

                    }
                }
            },

            session(key) {
                return {

                    get() {

                    },

                    set() {

                    },

                    remove() {

                    }
                }
            }
        },



        storage(id) {
            return {

                get(key) {
                    let storage = JSON.parse(localStorage.getItem(id));
                    return storage[key];
                },

                set(storage) {
                    // let storage = JSON.parse(localStorage.getItem(id));
                    localStorage.setItem(id, storage);
                },

                set() { }
            }
        },

        request(url) {
            return {

                async get(callback) {

                    fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then(async response => { callback(await response.text()); });
                },

                async post(body, callback) {

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(body)
                    })
                        .then(async response => { callback(await response.text()); });
                },

                async put(callback) {

                    fetch(url, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then(async response => { callback(await response.text()); });
                },

                async delete(callback) {

                    fetch(url, {
                        method: 'delete',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then(async response => { callback(await response.text()); });
                }
            }
        }
    }
}
