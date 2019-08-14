import React, {Component} from 'react';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';

class TodoComponent extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            newItem: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = async() => {
        await this.refreshList();
    }

    refreshList = async() => {
        var items = await API.graphql(graphqlOperation(queries.listItems));
        items = items.data.listItems.items;
        this.setState({items: items});
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        var payload = {
            description: this.state.newItem,
            posted: Math.floor(Date.now() / 1000)
        }
        
        await API.graphql(graphqlOperation(mutations.createItem, {input: payload}));

        this.setState({newItem: ""});
        await this.refreshList();
    }

    handleChange = async(event) => {
        var payload = {};
        payload[event.target.name] = event.target.value;
        this.setState(payload);
    }

    handleDate(posted) {
        var date = new Date(posted * 1000);
        return date.toLocaleDateString() + " "+date.toLocaleTimeString();
    }

    render() {
        return (
            <div>
                <h3>Todo Items</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Posted</th>
                        </tr>
                    </thead>
                    {this.state.items.map(item => {
                        return (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.description}</td>
                                <td>{this.handleDate(item.posted)}</td>
                            </tr>
                        );
                    })}
                </table>
                <hr />
                <h4>New Item</h4>
                <div>
                    <form method="POST" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label for="newItem">Description</label>
                            <input type="text" className="form-control" name="newItem" value={this.state.newItem} onChange={this.handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>

                </div>
            </div>
            
        );
    }
}

export default TodoComponent;