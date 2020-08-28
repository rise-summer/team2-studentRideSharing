import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
class PrivateRoute extends Component {

    render() {
        const {loggedIn, children, ...rest} = this.props;
        if (loggedIn === null) {//display a loader while the auth status is not determined
            return <Loader active/>;
        }
        return (
            <Route
                {...rest}
                render={(props) =>
                    loggedIn ? (
                        children
                    ) : (
                        <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                        />
                    )
                }
            />
        );
    }
}

/* makes info from redux store available as prop for this component
*   - loggedIn: accessible via this.props.loggedIn
*   - uid: accessible via this.props.uid
* */
const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    // uid: state.uid,
});

export default connect(mapStateToProps)(PrivateRoute);