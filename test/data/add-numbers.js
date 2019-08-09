export default {
    'id': 'test@0.0.1',
    'nodes': {
        '1': {
            'id': 1,
            'data': {
                'num': 2
            },
            'inputs': {},
            'outputs': {
                'num': {
                    'connections': [{
                        'node': 3,
                        'input': 'num1',
                        'data': {}
                    }]
                }
            },
            'position': [80, 200],
            'name': 'Number'
        },
        '2': {
            'id': 2,
            'data': {
                'num': 0
            },
            'inputs': {},
            'outputs': {
                'num': {
                    'connections': [{
                        'node': 3,
                        'input': 'num2',
                        'data': {}
                    }]
                }
            },
            'position': [80, 400],
            'name': 'Number'
        },
        '3': {
            'id': 3,
            'data': {},
            'inputs': {
                'num1': {
                    'connections': [{
                        'node': 1,
                        'output': 'num',
                        'data': {}
                    }]
                },
                'num2': {
                    'connections': [{
                        'node': 2,
                        'output': 'num',
                        'data': {}
                    }]
                }
            },
            'outputs': {
                'num': {
                    'connections': []
                }
            },
            'position': [500, 240],
            'name': 'Add'
        }
    }
}