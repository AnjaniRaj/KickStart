import React, {Component} from 'react';
import Layout from '../../components/Layout';
import {Form, Button, Input, Message} from "semantic-ui-react";
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };


    onSubmit = async (event) => {
        //prevent from submitting to server
        event.preventDefault();
        this.setState({loading: true, errorMessage:''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (e) {
            this.setState({errorMessage: e.message});
        }
        this.setState({loading: false});
    };

    render() {
        return (
            <Layout>
                <h3>Create New Campaign</h3>
                {/*if error gets empty string it is evaluated to be falsy value and hence doesn't show*/}
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="Wei"
                            labelPosition='right'
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header={"Ooops!"} content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} primary type={'submit'}>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;