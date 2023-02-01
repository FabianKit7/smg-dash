import React, { Fragment } from 'react'
import GrowthChart from './GrowthChart';

const ChartSection = ({ isPrivate, data, sessionsData }
) => {
  
  return (
    <div className="rounded-lg">
      {isPrivate ? <h4 style={{ textAlign: 'center' }}><i className="fas fa-lock" /> This account is private</h4> :
        (
          <Fragment>
              <div className="mt-12">
              <GrowthChart currFollowers={2213} userDefaultData={data} sessionsData={sessionsData} />
              </div>
          </Fragment>
        )
      }
    </div>
  )
}


export default ChartSection
