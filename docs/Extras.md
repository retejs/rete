Extras
-

### Tasks

The [Engine](https://github.com/Ni55aN/D3-Node-Editor/wiki/Engine) completely implements the necessary functionality for flow-based programming, namely: at the time of the call `process()` method passes through all nodes and execute their worker one time. What if you need to implement processing your data not once, but at some event, make a decision dynamically about which nodes you need to perform. For example, how it is done in a Blueprint in UE4.

![example](https://image.ibb.co/mYQkO6/2017_10_30_223751.png)

[Live example](https://codepen.io/Ni55aN/pen/MOYPEz)

Inside the [worker](https://github.com/Ni55aN/D3NE-examples/blob/master/Event%26Condition/components.js#L30) you need to create Task instance
```js
worker: function (node, inputs, outputs) {
    var task = new D3NE.Task(inputs, function (inps, data) {
       /// the function is executed when `task.run()` is called
        return [data] // output data excluding sockets to transfer control to the following tasks
    });
    tasksToCallOutside.push(task);

    outputs[0] = task.option(0); // define that the first output is intended to transfer control to the next node
    outputs[1] = task.output(0); // just data transfer from second output
}
```
Note that the builder must determine exactly which sockets are responsible for further calling the tasks (`task.option(index)`), and which ones for the data transfer (`task.output(index)`)

When calling the run() method, all other tasks that are in the connected nodes will be called. If for some situation you need to prevent further execution of the tasks, then you can define indexes of those sockets from which you do not need to carry further tasks.  Write them to the array `task.closed`
```js
task.closed = [1];
```
Conditional operator - the most common example where this possibility is needed

All code is placed in the [example](https://github.com/Ni55aN/D3NE-examples/blob/master/Event%26Condition/)

### Modules

### Difference
