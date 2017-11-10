export function Control(scope, el, expression, env) {
    var locals = env.changeDetector.locals;
    var control = locals.input ? locals.input.control:locals.control;

    el.innerHTML = control.html;
    control.handler(el.children[0], control);
}