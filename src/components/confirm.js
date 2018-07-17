import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import '../css/dialog.css';

const YourDialog = ({show, proceed, dismiss, cancel, confirmation, options}) => (
    <div className="flex-container-column popup">
                <h5 className="flex-element text-center">{confirmation}</h5>
        <img alt="" style={{width: '150px', height: '150px', margin: 'auto'}} src="https://cdn0.iconfinder.com/data/icons/game-line-icon-set-2/512/reset-512.png" />
                <div className="flex-element text-right" style={{verticalAlign: 'flex-end'}}>
                    <button className="btn btn-cancel" onClick={() => cancel('arguments will be passed to the callback')}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => proceed('same as cancel')}>Ok</button>
                </div>
            </div>
);

YourDialog.propTypes = {
    show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
    proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
    cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
    dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
    confirmation: PropTypes.string,  // arguments of your confirm function
    options: PropTypes.object        // arguments of your confirm function
};

export default confirmable(YourDialog);
