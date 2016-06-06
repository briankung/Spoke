import React from 'react'
import Formsy from 'formsy-react'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import { FormsyText } from 'formsy-material-ui/lib'
import { addTexter } from '../../api/organizations/methods'
import { FlowRouter } from 'meteor/kadira:flow-router'

const errorMessages = {
  emailError: "Please enter a valid email",
}

const styles = {
  submitStyle: {
    marginTop: 32
  }
}

export class TexterSignupForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false
    };
  }

  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }

  submitForm(data) {
    console.log("submit form!")
    const { organization } = this.props
    Accounts.createUser(data, (accountError) => {
      if (accountError) {
        console.log("account creation error", accountError)
      } else {
        console.log("calling add texter")
        addTexter.call({organizationId: organization._id}, (organizationError) => {
          if (organizationError) {
            console.log("error adding texter to org", organizationError)
          } else {
            console.log("successfully added tetxer")
            FlowRouter.go(`${organization._id}/assignments`)
          }
        })
      }
    })
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  render() {
    const { organization } = this.props
    let {submitStyle } = styles;
    let { emailError, numericError, urlError } = errorMessages;

    return (
      <Formsy.Form
        onValid={this.enableButton.bind(this)}
        onInvalid={this.disableButton.bind(this)}
        onValidSubmit={this.submitForm.bind(this)}
        onInvalidSubmit={this.notifyFormError.bind(this)}
      >
        <FormsyText
          name="firstName"
          autoFocus
          fullWidth
          required
          floatingLabelText="First name"
        />
        <FormsyText
          name="lastName"
          fullWidth
          required
          floatingLabelText="Last name"
        />
        <FormsyText
          name="email"
          fullWidth
          validations="isEmail"
          validationError={emailError}
          required
          floatingLabelText="Your email"
        />
        <FormsyText
          fullWidth
          name="password"
          type="password"
          required
          floatingLabelText="Password"
        />
        <RaisedButton
          fullWidth
          style={submitStyle}
          type="submit"
          label="Join organization"
          disabled={!this.state.canSubmit}
        />
      </Formsy.Form>
    )
  }
}