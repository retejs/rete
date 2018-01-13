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

    async run(data, needReset = true, garbage = []) {
        garbage.push(this);

        var inputs = await Promise.all(this.getOutputs().map(async input => {
            return await Promise.all(input.map(async con => {
                if (con) {
                    await con.run(data, false, garbage);
                    return con.get();
                }
            }));
        }));

        if (!this.outputData) {
            this.outputData = await this.action(inputs, data);

            await Promise.all(
                this.next
                    .filter(f => !this.closed.includes(f.index))
                    .map(async f => 
                        await f.task.run(data, false, garbage)
                    )
            );
        }
        
        if (needReset)
            garbage.map(t => t.reset());
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