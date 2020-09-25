import React, {Component} from 'react';
import Layout from '../../components/Layout';
import {Card, Grid, Button, GridRow} from "semantic-ui-react";
import web3 from '../../ethereum/web3';
import Campaign from "../../ethereum/campaign";
import ContributeForm from "../../components/ContributeForm";
import {Link} from '../../routes';

class CampaignShow extends Component {
    //query comes from routing lib
    static async getInitialProps({query}) {
        const campaign = Campaign(query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            address: query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {balance, manager, minimumContribution, approversCount, requestCount} = this.props;

        const items = [
            {
                header: manager,
                meta: 'address of manager',
                description: 'manager created this campaign. she can make requests',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'minimum contribution (wei)',
                description: 'you need to contribute at least this much',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: requestCount,
                meta: 'number of requests',
                description: 'a request is to withdraw money from the pool',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: approversCount,
                meta: 'number of approvers',
                description: 'number of people who already contributed',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'campaign balance (ether)',
                description: 'the balance available in campaign',
                style: {overflowWrap: 'break-word'}
            }

        ];

        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }

}

export default CampaignShow;

