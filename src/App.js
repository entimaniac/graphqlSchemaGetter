import React from 'react';
import './App.css';
import {buildClientSchema} from 'graphql/utilities/buildClientSchema'
import {printSchema} from 'graphql/utilities/schemaPrinter'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {inputJson: '', output: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({inputJson: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const rawJson = JSON.parse(this.state.inputJson);
        console.log(rawJson);
        if (typeof rawJson['__schema'] === 'object') {
            const data = rawJson;
            const schema = buildClientSchema(data);
            console.log(printSchema(schema))
        } else if (typeof rawJson['data'] === 'object' && typeof rawJson['errors'] === 'undefined') {
            const data = rawJson['data'];
            const schema = buildClientSchema(data);
            console.log(printSchema(schema));
            this.setState({output: printSchema(schema)});
        } else if (typeof rawJson['errors'] === 'object') {
            throw new Error(JSON.stringify(rawJson['errors'], null, 2))
        } else {
            throw new Error('No "data" key found in JSON object')
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>GRAPHQL SCHEMA CONVERTER!</h1>
                    <p>Hi! Hello! This very basic form allows you to paste in the raw json from a graphql introspection
                        request and output the SDL schema thing for whatever you want to do with it (no judgment
                        here).</p>

                    <br/><br/>
                    <form onSubmit={this.handleSubmit}>
                        JSON Input:
                        <div>

                            <textarea value={this.state.inputJson} onChange={this.handleChange}/>
                        </div>
                        Output:
                        <div>

                            <textarea value={this.state.output} readOnly={true}/>
                        </div>
                        <input type="submit" value="Convert"/>
                    </form>
                </header>
            </div>
        );
    }
}

export default App;
