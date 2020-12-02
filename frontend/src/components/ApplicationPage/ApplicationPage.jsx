import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { applicationService, authenticationService } from '../_services';
import { Route, Link } from 'react-router-dom';


class ApplicationsTable extends React.Component {
    constructor(props) {
        super(props)
    }

    render_head() {
        return (Object.keys(this.props.applications[0]).map((key) => <th>{key}</th>))
    }

    render() {
        return (
            <table class="table table-striped">
                <thead>
                    <tr>
                        {this.props.applications && this.render_head()}
                    </tr>
                </thead>
                <tbody>
                    {this.props.applications && this.props.applications.map((application) =>
                        <tr>
                            <td>{application.id}</td>
                            <td>{application.appDate}</td>
                            <td>{application.name}</td>
                            <td>{application.price}</td>
                            <td>{application.state.name}</td>
                            <td>{application.type.name}</td>
                            <th>{application.files && application.files.map((file) => <a id={file.id} href={`${process.env.REACT_APP_API_URL}/api/files/${file.id}`}>{file.name}</a>)}</th>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

class ApplicationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            types: null,
            applications: null,
            showForm: false,
            currentUser: authenticationService.currentUserValue

        };
    }
    componentDidMount() {
        applicationService.getAllTypes().then(types => {
            this.setState({ types })
            this.state.types.forEach(element => {
                applicationService.getAll(element.name).then(applications => {
                    if (!this.state.applications) {
                        this.setState({ applications: applications })
                    } else {
                        this.setState({ applications: this.state.applications.concat(applications) })
                    }
                    console.log(this.state.applications)
                })
            })
        });
    }

    render() {
        return (
            <div className="align-middle">
                <h2>Application</h2>
                {this.state.applications && this.state.applications.length == 0 ? <div>No applications found</div> : <ApplicationsTable applications={this.state.applications} />}
                {this.state.currentUser.roles.includes('ROLE_ADVERTISER') ? <Link to="/application_add" className="btn btn-primary">Add Application</Link> : null}
            </div>
        )
    }
}

export { ApplicationPage }; 