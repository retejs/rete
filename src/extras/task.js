export class Task {

    constructor(inputs, action) {
        this.inputs = inputs;
        this.action = action;
        this.next = [];
        this.outputData = null;
        this.closed = [];

        this.getOptions().forEach(input => {
            input.forEach(con => {
                con.task.next.push({index: con.index, task: this});
            })
        });
    }

    getOptions() {
        return this.inputs.filter(input => input[0] && input[0].task)
    }

    getOutputs() {
        return this.inputs.filter(input => input[0] && input[0].get);
    }

    reset() {
        this.outputData = null;
    }

    run(data) {
        var inputs = this.getOutputs().map(input => {
            return input.map(con => {
                if (con) {
                    con.run();
                    return con.get();
                }
            })
        });

        if (!this.outputData) {
            this.outputData = this.action(inputs, data);

            this.next.filter(f => !this.closed.includes(f.index)).forEach(f => f.task.run());
        }
    }

    option(index) {
        var task = this;

        return {task, index}
    }

    output(index) {
        var task = this;

        return {
            run: task.run.bind(task),
            get() {
                return task.outputData[index];
            }
        }
    }
}