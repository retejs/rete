export function Control(scope, el, expression, env) {
    var locals = env.changeDetector.locals;
    var control = expression.split('.').reduce((o, i) => o[i], locals);

    el.innerHTML = control.html;
    control.handler(el.children[0], control);
}