import React, { Component } from 'react';
import '../css/ModalWrapper.css'

class ModalWrapper extends Component {
    constructor(props) {
        super(props);
    
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }
      
      // Add listeners immediately after the component is mounted.
    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp, false);
        document.addEventListener('click', this.handleOutsideClick, false);
    }
    
      // Remove listeners immediately before a component is unmounted and destroyed.
    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp, false);
        document.removeEventListener('click', this.handleOutsideClick, false);
    }
      
      // Handle the key press event.
    handleKeyUp(e) {
        const { onCloseRequest } = this.props;
        const keys = {
          27: () => {
            e.preventDefault();
            onCloseRequest();
            window.removeEventListener('keyup', this.handleKeyUp, false);
          },
        };
    
        if (keys[e.keyCode]) { keys[e.keyCode](); }
    }
      
      // Handle the mouse click on browser window.
    handleOutsideClick(e) {
        const { onCloseRequest } = this.props;
    
        if (this.modal !== undefined) {
          if (!this.modal.contains(e.target)) {
            onCloseRequest();
            document.removeEventListener('click', this.handleOutsideClick, false);
          }
        }
    }
      
      // Render the component passing onCloseRequest and children as props.
    render () {
        const { onCloseRequest, children } = this.props;
        return (
          <div className="custom-modal">
            <section className="custom-modal-main" div ref={node => (this.modal = node)}>
              {children}
            </section>
            <button className="close-button" onClick={onCloseRequest}>X</button>
          </div>
        );
    }
}

export default ModalWrapper;