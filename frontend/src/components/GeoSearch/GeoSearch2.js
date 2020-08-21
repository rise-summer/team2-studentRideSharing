import React, { Component } from 'react';
import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocode from '@mapbox/mapbox-sdk/services/geocoding';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';

class GeoSearch2 extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            results: [],
            geocodingClient: null,
        };
    }

    componentDidMount() {
        const baseClient = mbxClient({
            accessToken:
                'pk.eyJ1IjoicmlzZXRlYW0yIiwiYSI6ImNrZDIzdDJkbjBzcnEyc3E5YnViazdoYWEifQ.6O1AdDa4j5XR9qSRWMkcWQ',
        });
        this.setState({ geocodingClient: mbxGeocode(baseClient) });
    }
    handleChange = (e, { value }) => {
        this.state.geocodingClient
            .forwardGeocode({
                query: value,
                countries: ['US'],
                types: [
                    'postcode',
                    'district',
                    'locality',
                    'neighborhood',
                    'address',
                    'poi',
                ],
            })
            .send()
            .then(
                (response) => {
                    const match = response.body.features;
                    this.setState({ results: match });
                },
                (error) => {
                    console.log(error);
                }
            );
        this.setState({ query: value });
    };

    handleResultSelect = (e, { result }) => this.setState({ query: result.description })

    render() {
        const { results } = this.state;
        const resultsFormatted = results.map((result) => {
            return {
                title: result.text,
                description: result.place_name,
            };
        });
        return (
            <div>
                <Search
                    onSearchChange={_.debounce(this.handleChange, 200, {
                      leading: true,
                    })}
                    onResultSelect={this.handleResultSelect}
                    results={resultsFormatted}
                    value={this.state.query}
                />
                <pre>{JSON.stringify(resultsFormatted, null, 2)}</pre>
            </div>
        );
    }
}

export default GeoSearch2;
