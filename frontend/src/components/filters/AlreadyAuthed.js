import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function AlreadyAuthed(ComponentToProtect) {
  return class extends Component {
    static contextType = UserContext;

    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      if (this.context.user) this.setState({ redirect: true, loading: false });
      else this.setState({ loading: false });
    }

    render() {
      const { loading, redirect } = this.state;
      if (loading) return null;
      if (redirect) return <Redirect to="/" />;
      return <ComponentToProtect {...this.props} />;
    }
  };
}
