import React, { Fragment } from 'react'
/* import Card from './Card'
import { FaDollarSign, FaFire, FaHeart, FaComment } from 'react-icons/fa'
import { numFormatter, getRateDiff } from '../helpers';  */
import GrowthChart from './GrowthChart';

const ChartSection = ({ isPrivate, data }
) => {
  console.log(data);
  return (
    <div className="rounded-lg">
      {isPrivate ? <h4 style={{ textAlign: 'center' }}><i className="fas fa-lock" /> This account is private</h4> :
        (
          <Fragment>
              <div className="mt-12">
                <GrowthChart currFollowers = {2213}  data={data} />
              </div>
          </Fragment>
        )
      }
    </div>
  )
}


export default ChartSection
