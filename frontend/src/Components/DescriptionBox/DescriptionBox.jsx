import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
        Advertising media encompasses the channels through which businesses
         communicate promotional messages, including print, broadcast, 
         digital, and outdoor formats. Evolving from traditional mediums 
         like newspapers and TV to highly targeted online ads, advertising 
         media now uses data-driven insights to reach specific audiences 
         globally and shape consumer behavior.
        </p>
        <p>
        Social media, beginning in the early 2000s, transformed how people 
        connect, share, and engage with content by creating interactive, 
        user-driven platforms. It now serves as a powerful tool for global 
        communication, enabling real-time sharing of information, cultural 
        exchange, and community-building across vast distances.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
