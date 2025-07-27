import React from 'react';
import PropTypes from 'prop-types';

function LeadCard({ lead, onDelete, isAdmin }) {
  return (
    <li>
      {lead.name} ({lead.status})
      {isAdmin && onDelete && <button onClick={() => onDelete(lead.id)}>Delete</button>}
    </li>
  );
}

LeadCard.propTypes = {
  lead: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  isAdmin: PropTypes.bool.isRequired,
};

export default LeadCard;