import React from 'react'

const FeaturesHeading = ({heading , title, icon}) => {
  return (
    <>
        <div className='vendorEmailFeaturesSection'>
                <img src={icon} alt="" />
                <div className="vendorEmailFeaturesSectionDetail">
                  <h2 className="vendorEmailFeaturesSectionHeading">
                  {heading}
                  </h2>
                  <p className="vendorEmailFeaturesSectionTitle">
                  {title}
                  </p>
                </div>
              </div>
    </>
  )
}

export default FeaturesHeading