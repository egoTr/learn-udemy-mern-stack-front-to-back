import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
    if (alerts && alerts.length > 0)
        return (
            <div>
                { alerts.map( (item, i) =>
                    <div key={item.id} className={`alert alert-${item.alertType}`}>
                        {item.msg}
                    </div>
                )}
            </div>
        ) // return
    return <></>
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  alerts: state.alert  
})

export default connect(mapStateToProps)(Alert);